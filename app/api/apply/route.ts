import { NextResponse } from "next/server";
import { UseSend } from "usesend-js";

import {
  AUTHORIZATION_VERSION,
  authorizationPlainText,
} from "@/lib/authorization-text";
import {
  applicationSchema,
  formatDate,
  formatPhone,
  formatSsn,
  validateStatements,
  type Application,
} from "@/lib/application-schema";

// Buffer + base64 for the attachments, so this must not run on Edge.
export const runtime = "nodejs";
// A funding application is never a cacheable response.
export const dynamic = "force-dynamic";

const TO_EMAIL = process.env.APPLICATION_TO_EMAIL ?? "deals@miracleadvancellc.com";
const FROM_EMAIL =
  process.env.APPLICATION_FROM_EMAIL ?? "applications@miracleadvancellc.com";

// Bots fill every field they can see. A hidden input that stays empty for a
// human, plus a form that was on screen for less than this, are both tells.
const HONEYPOT_FIELD = "company_website";
const MIN_FILL_MS = 3_000;

/**
 * PRIVACY CONTRACT FOR THIS FILE.
 *
 * This handler receives SSN, date of birth, and bank statements. The repo
 * previously routed this straight to Jotform specifically so none of it touched
 * our server; going native is a deliberate reversal, and these rules are what
 * make it defensible. Do not weaken them:
 *
 *   1. Never log a parsed field, the raw FormData, or a file's contents. The
 *      only things written to stdout are an outcome and, on failure, an error
 *      from the mail provider.
 *   2. Never persist. No Blob, no database, no temp files. Buffers live for the
 *      duration of the request and are dropped.
 *   3. Never echo submitted values back in a response, including in validation
 *      errors — return the field name and a static message.
 *   4. The confirmation to the applicant is the one place a submitted value is
 *      sent anywhere other than the team inbox. It carries the business name and
 *      first name only — never the SSN, date of birth, phone, or statement
 *      contents — because it lands in a mailbox we neither control nor can vouch
 *      for. Adding a field there is a privacy decision, not a formatting one.
 */

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Could not read the submitted form." },
      { status: 400 }
    );
  }

  // --- Bot checks. Both return a 200 so a bot cannot tell it was caught. -----
  if (String(form.get(HONEYPOT_FIELD) ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const elapsed = Number(form.get("elapsedMs"));
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  // --- Validation -----------------------------------------------------------
  const parsed = applicationSchema.safeParse({
    legalBusinessName: form.get("legalBusinessName") ?? "",
    dba: form.get("dba") ?? "",
    businessStartDate: form.get("businessStartDate") ?? "",
    firstName: form.get("firstName") ?? "",
    lastName: form.get("lastName") ?? "",
    dateOfBirth: form.get("dateOfBirth") ?? "",
    ssn: form.get("ssn") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") ?? "",
    authorized: form.get("authorized") === "true",
    contactConsent: form.get("contactConsent") === "true",
    signature: form.get("signature") ?? "",
  });

  if (!parsed.success) {
    // Field names and messages only — never the values that failed.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message;
    }
    return NextResponse.json(
      { error: "Some fields need attention.", fieldErrors },
      { status: 400 }
    );
  }

  const statements = form
    .getAll("statements")
    .filter((entry): entry is File => entry instanceof File);

  const statementError = validateStatements(statements);
  if (statementError) {
    return NextResponse.json(
      { error: statementError, fieldErrors: { statements: statementError } },
      { status: 400 }
    );
  }

  // --- E-SIGN audit trail ---------------------------------------------------
  // Both generated here rather than accepted from the client: a signature record
  // the signer could set is not a record. These reach the email only — like every
  // other field, they are never logged or stored (see the privacy contract above).
  const signedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "medium",
  });
  // Vercel's proxy sets x-forwarded-for; the left-most entry is the client.
  const signedFrom =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // --- Send -----------------------------------------------------------------
  const apiKey = process.env.USESEND_API_KEY;
  if (!apiKey) {
    console.error("[apply] USESEND_API_KEY is not set; cannot send application.");
    return NextResponse.json(
      { error: "The application could not be sent. Please call (786) 902-2025." },
      { status: 503 }
    );
  }

  // Second arg is the base URL, for self-hosted instances. Omitted (undefined)
  // it falls back to the managed cloud at app.usesend.com. Hoisted out of the
  // try below so the applicant confirmation can reuse the same client.
  const usesend = new UseSend(apiKey, process.env.USESEND_URL);

  try {
    const attachments = await Promise.all(
      statements.map(async (file) => ({
        filename: file.name,
        // usesend-js types `content` as a string: base64, no data: prefix.
        content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      }))
    );

    const { error } = await usesend.emails.send({
      to: TO_EMAIL,
      from: FROM_EMAIL,
      // Replying in the inbox reaches the applicant, not this app.
      replyTo: parsed.data.email,
      subject: `New funding application — ${parsed.data.legalBusinessName}`,
      text: buildEmailBody(parsed.data, statements, signedAt, signedFrom),
      attachments,
    });

    if (error) {
      // The provider's message describes the send, not the applicant's data.
      console.error("[apply] useSend rejected the send:", describeSendError(error));
      return NextResponse.json(
        {
          error:
            "We could not deliver your application. Please call (786) 902-2025 and we will take it over the phone.",
        },
        { status: 502 }
      );
    }
  } catch (cause) {
    console.error(
      "[apply] Unexpected failure while sending:",
      cause instanceof Error ? cause.message : "unknown error"
    );
    return NextResponse.json(
      {
        error:
          "We could not deliver your application. Please call (786) 902-2025 and we will take it over the phone.",
      },
      { status: 502 }
    );
  }

  console.log("[apply] Application delivered.");

  // --- Confirmation to the applicant (best effort) ---------------------------
  // Deliberately last and deliberately non-fatal. The application has already
  // reached the team by this point, so a confirmation that fails to send is a
  // worse experience, not a lost deal — it must never turn a delivered
  // application into an error the applicant sees and then retries, which would
  // land the same deal in the inbox twice.
  try {
    const { error } = await usesend.emails.send({
      to: parsed.data.email,
      from: FROM_EMAIL,
      // A reply to the confirmation should reach the team, not this app.
      replyTo: TO_EMAIL,
      subject: "We received your application — Miracle Advance",
      text: buildConfirmationBody(parsed.data, statements, signedAt),
    });

    if (error) {
      console.error(
        "[apply] Confirmation to the applicant failed:",
        describeSendError(error)
      );
    }
  } catch (cause) {
    console.error(
      "[apply] Confirmation to the applicant threw:",
      cause instanceof Error ? cause.message : "unknown error"
    );
  }

  return NextResponse.json({ ok: true });
}

/**
 * usesend-js types the failure as `{ code, message }`, but the API actually
 * responds with `{ error: { code, message } }` and the SDK hands that body back
 * unwrapped — so reading `error.code` directly logs "undefined undefined" for
 * every real failure, including the "Invalid API token" you get from a bad key.
 * Checks both shapes, and pulls only the two diagnostic fields so a provider
 * that echoes the request back cannot drag the applicant's data into the log.
 */
function describeSendError(error: unknown): string {
  if (!error || typeof error !== "object") return "unknown error";

  const shape = error as {
    code?: string;
    message?: string;
    error?: { code?: string; message?: string };
  };

  const code = shape.code ?? shape.error?.code ?? "unknown";
  const message = shape.message ?? shape.error?.message ?? "no message returned";

  return `${code}: ${message}`;
}

function buildEmailBody(
  application: Application,
  statements: File[],
  signedAt: string,
  signedFrom: string
) {
  const {
    legalBusinessName,
    dba,
    businessStartDate,
    firstName,
    lastName,
    dateOfBirth,
    ssn,
    email,
    phone,
    signature,
    contactConsent,
  } = application;

  return [
    "NEW FUNDING APPLICATION",
    "Submitted from the application form at miracleadvancellc.com/contact",
    "",
    "BUSINESS",
    `  Legal business name:  ${legalBusinessName}`,
    `  DBA:                  ${dba || "—"}`,
    `  Business start date:  ${formatDate(businessStartDate)}`,
    "",
    "OWNER",
    `  Name:                 ${firstName} ${lastName}`,
    `  Date of birth:        ${formatDate(dateOfBirth)}`,
    `  SSN:                  ${formatSsn(ssn)}`,
    `  Email:                ${email}`,
    `  Phone:                ${formatPhone(phone)}`,
    "",
    "AUTHORIZATION",
    `  Authorization accepted:     Yes (version ${AUTHORIZATION_VERSION})`,
    `  Calls/texts consent (TCPA): ${contactConsent ? "Yes" : "No"}`,
    `  Electronic signature:       ${signature}`,
    `  Signed at:                  ${signedAt} ET`,
    `  Signed from IP:             ${signedFrom}`,
    "",
    `BANK STATEMENTS (${statements.length} attached)`,
    ...statements.map((file) => `  • ${file.name}`),
    "",
    "Reply to this email to reach the applicant directly.",
    "",
    "─".repeat(72),
    `AUTHORIZATION TEXT ACCEPTED BY THE APPLICANT (version ${AUTHORIZATION_VERSION})`,
    "─".repeat(72),
    "",
    authorizationPlainText(),
  ].join("\n");
}

/**
 * Confirmation sent to the applicant, at the address they entered.
 *
 * Two rules govern what goes in here. It must not restate anything sensitive —
 * this lands in a mailbox we neither control nor can vouch for, so the SSN, date
 * of birth, phone number, and statement filenames all stay out (rule 4 of the
 * privacy contract at the top of this file). And it must not read as a decision:
 * an applicant who mistakes a receipt for an approval was misled by us, not by
 * themselves, which is why the "not an approval" line is not optional.
 *
 * The authorization copy is not padding. Clause 6 has the applicant consent to
 * receive these records electronically; actually sending one is what makes that
 * clause true rather than decorative, and it leaves them holding the exact
 * version they agreed to rather than whatever the site says later.
 */
function buildConfirmationBody(
  application: Application,
  statements: File[],
  signedAt: string
) {
  const { firstName, legalBusinessName, contactConsent } = application;
  const count = statements.length;

  return [
    `Thank you for applying to Miracle Advance, ${firstName}.`,
    "",
    "We have received your application and your bank statements. Our",
    "underwriting team is reviewing them now, and someone will be in touch",
    "within one business day.",
    "",
    `  Business:    ${legalBusinessName}`,
    `  Statements:  ${count} file${count === 1 ? "" : "s"} received`,
    `  Submitted:   ${signedAt} ET`,
    "",
    "This message confirms receipt only. It is not an approval, an offer of",
    "financing, or a commitment to fund.",
    "",
    // Second person on purpose. The CONTACT_CONSENT_* constants are written in
    // the applicant's voice for the form ("I authorize…"), which reads wrong in
    // a message addressed to them — so this is worded here rather than reused.
    ...(contactConsent
      ? [
          "You also agreed to receive calls and text messages about this",
          "application. You can withdraw that consent at any time by replying",
          "to this email.",
          "",
        ]
      : []),
    "Questions? Reply to this email or call (786) 902-2025.",
    "",
    "— Miracle Advance LLC",
    "",
    "─".repeat(72),
    "YOUR COPY OF THE AUTHORIZATION YOU SIGNED",
    `Version ${AUTHORIZATION_VERSION} · signed ${signedAt} ET`,
    "─".repeat(72),
    "",
    authorizationPlainText(),
  ].join("\n");
}
