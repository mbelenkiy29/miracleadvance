import { z } from "zod";

// Shared by the client form (components/sections/ApplicationForm.tsx) and the
// route handler (app/api/apply/route.ts). Importing one schema in both places is
// the point: a rule relaxed on the client can never quietly bypass the server.

export const MAX_STATEMENT_FILES = 6;
export const MAX_STATEMENT_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_STATEMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
/** For the file input's `accept` attribute and the visible hint. */
export const ACCEPTED_STATEMENT_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";

function digits(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Parse a native `<input type="date">` value in *local* time.
 *
 * `new Date("2000-01-01")` is parsed as UTC midnight, which is the previous day
 * in every US timezone — enough to flip an 18th-birthday check. Building from
 * components keeps the date the applicant actually picked. The round-trip
 * comparison rejects rollover input like 2025-02-31, which JS would otherwise
 * silently accept as March 3.
 */
function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function yearsBetween(from: Date, to: Date) {
  let age = to.getFullYear() - from.getFullYear();
  const monthDelta = to.getMonth() - from.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && to.getDate() < from.getDate())) {
    age -= 1;
  }
  return age;
}

/** Lowercase, strip punctuation, collapse whitespace — for comparing names. */
function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

const requiredText = (label: string, max = 200) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

/**
 * Every date check below is null-safe on purpose. Zod 4 runs the whole chain of
 * `.refine()` checks even after an earlier one has failed, so a refinement that
 * assumed `parseLocalDate` succeeded would throw on empty or malformed input and
 * turn a validation error into a 500 (and a client-side crash, since the browser
 * runs this same schema). Each rule therefore passes when the value does not
 * parse — the "is this a date" refinement owns that error on its own.
 */
const onParsedDate = (predicate: (date: Date) => boolean) => (value: string) => {
  const date = parseLocalDate(value);
  return date === null || predicate(date);
};

const pastDate = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => parseLocalDate(value) !== null, {
      error: `Enter ${label.toLowerCase()} as a valid date.`,
    })
    .refine(onParsedDate((date) => date <= new Date()), {
      error: `${label} cannot be in the future.`,
    });

export const applicationSchema = z
  .object({
    // --- Business -----------------------------------------------------------
    legalBusinessName: requiredText("Legal business name").pipe(
      z.string().min(2, "Legal business name must be at least 2 characters.")
    ),
    dba: z
      .string()
      .trim()
      .max(200, "DBA must be 200 characters or fewer.")
      .optional()
      .default(""),
    businessStartDate: pastDate("Business start date").refine(
      onParsedDate((date) => date.getFullYear() >= 1900),
      { error: "Enter a business start date after 1900." }
    ),

    // --- Owner --------------------------------------------------------------
    firstName: requiredText("First name", 80),
    lastName: requiredText("Last name", 80),
    dateOfBirth: pastDate("Date of birth")
      .refine(onParsedDate((date) => yearsBetween(date, new Date()) >= 18), {
        error: "The owner must be at least 18 years old.",
      })
      .refine(onParsedDate((date) => yearsBetween(date, new Date()) <= 120), {
        error: "Enter a valid date of birth.",
      }),
    ssn: z
      .string()
      .trim()
      .min(1, "Social Security number is required.")
      .refine((value) => digits(value).length === 9, {
        error: "Social Security number must be 9 digits.",
      })
      // SSA's own allocation rules. Cheap to check and it catches the
      // placeholder junk people type when they are not ready to share it —
      // 000-00-0000, 123-45-6789, 666-…, and the 900-block.
      .refine(
        (value) => {
          const ssn = digits(value);
          const area = ssn.slice(0, 3);
          const group = ssn.slice(3, 5);
          const serial = ssn.slice(5);
          return (
            area !== "000" &&
            area !== "666" &&
            Number(area) < 900 &&
            group !== "00" &&
            serial !== "0000"
          );
        },
        { error: "That is not a valid Social Security number." }
      ),
    email: z.email({ error: "Enter a valid email address." }),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required.")
      .refine(
        (value) => {
          const phone = digits(value);
          // Accept a leading country code so "+1 (786) 902-2025" passes.
          return phone.length === 10 || (phone.length === 11 && phone.startsWith("1"));
        },
        { error: "Enter a 10-digit US phone number." }
      ),

    // --- Authorization ------------------------------------------------------
    authorized: z.boolean().refine((value) => value === true, {
      error: "You must authorize the review to submit this application.",
    }),
    // Optional on purpose. TCPA consent that is required in order to apply is
    // not consent; the form also states that it is not a condition of funding.
    contactConsent: z.boolean().optional().default(false),
    signature: requiredText("Electronic signature", 160),
  })
  .refine(
    (data) => {
      // The signature is meaningful only if it is actually their name. Matching
      // on tokens rather than the exact string so "John A. Smith" still signs
      // for first="John" last="Smith" — a strict equality check would reject
      // every applicant who signs with a middle name.
      const signed = normalizeName(data.signature);
      const first = normalizeName(data.firstName);
      const last = normalizeName(data.lastName);
      return (
        first.every((part) => signed.includes(part)) &&
        last.every((part) => signed.includes(part))
      );
    },
    {
      error: "Type your full legal name exactly as entered above.",
      path: ["signature"],
    }
  );

export type ApplicationInput = z.input<typeof applicationSchema>;
export type Application = z.output<typeof applicationSchema>;

/**
 * Files are validated apart from the zod object: `File` only exists in the
 * browser and in the Node runtime handling `FormData`, so folding it into a
 * schema shared with client-side type inference costs more than it returns.
 * Both sides call this, so the limits stay in one place.
 */
export function validateStatements(files: File[]): string | null {
  if (files.length === 0) {
    return "Attach your last three months of bank statements.";
  }

  if (files.length > MAX_STATEMENT_FILES) {
    return `Attach at most ${MAX_STATEMENT_FILES} files.`;
  }

  const wrongType = files.find(
    (file) =>
      !ACCEPTED_STATEMENT_TYPES.includes(
        file.type as (typeof ACCEPTED_STATEMENT_TYPES)[number]
      )
  );
  if (wrongType) {
    return `"${wrongType.name}" is not a PDF, JPG, or PNG.`;
  }

  const empty = files.find((file) => file.size === 0);
  if (empty) {
    return `"${empty.name}" is empty.`;
  }

  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_STATEMENT_BYTES) {
    return `Attachments total ${formatBytes(total)}. The limit is ${formatBytes(
      MAX_STATEMENT_BYTES
    )}.`;
  }

  return null;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** `7869022025` -> `(786) 902-2025`, for the email body. */
export function formatPhone(value: string) {
  const phone = digits(value).slice(-10);
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

/** `123456789` -> `123-45-6789`, for the email body. */
export function formatSsn(value: string) {
  const ssn = digits(value);
  return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
}

/** `2020-03-01` -> `March 1, 2020`, for the email body. */
export function formatDate(value: string) {
  const date = parseLocalDate(value);
  if (!date) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
