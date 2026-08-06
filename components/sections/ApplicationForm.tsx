"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  AUTHORIZATION_CLAUSES,
  AUTHORIZATION_LABEL,
  AUTHORIZATION_PREAMBLE,
  AUTHORIZATION_PRIVACY_CLAUSE,
  CONTACT_CONSENT_BODY,
  CONTACT_CONSENT_EMPHASIS,
  CONTACT_CONSENT_LABEL,
  CONTACT_CONSENT_WITHDRAWAL,
} from "@/lib/authorization-text";
import {
  ACCEPTED_STATEMENT_EXTENSIONS,
  MAX_STATEMENT_FILES,
  MAX_STATEMENT_BYTES,
  applicationSchema,
  formatBytes,
  validateStatements,
  type ApplicationInput,
} from "@/lib/application-schema";
import { cn } from "@/lib/utils";

// Replaced the Jotform embed. The form posts multipart FormData to /api/apply,
// which validates against the *same* schema imported here and emails the
// application with the statements attached. See README "Contact form".

const FIELD_CLASS =
  "mt-2 h-12 w-full border border-border bg-surface px-4 text-base text-foreground " +
  "transition-colors duration-200 ease-out placeholder:text-muted " +
  "hover:border-foreground/40 aria-[invalid=true]:border-destructive";

const LABEL_CLASS = "block text-sm font-medium text-foreground";
const LEGEND_CLASS = "label-eyebrow";

const CHECKBOX_CLASS =
  "flex cursor-pointer items-start gap-3 border border-border p-4 transition-colors duration-200 ease-out " +
  "hover:bg-foreground/[0.02] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 " +
  "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-strong";

type FieldName = keyof ApplicationInput | "statements";

export function ApplicationForm() {
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [statements, setStatements] = React.useState<File[]>([]);
  const [statementError, setStatementError] = React.useState<string | null>(null);

  // Bot signal: a form completed faster than a human could read it.
  const mountedAt = React.useRef(Date.now());
  const successHeadingRef = React.useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    mode: "onBlur",
  });

  // Announce the success panel to screen readers and put the keyboard caret
  // somewhere sensible — the form that had focus no longer exists.
  React.useEffect(() => {
    if (submitted) successHeadingRef.current?.focus();
  }, [submitted]);

  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setStatements(files);
    setStatementError(files.length > 0 ? validateStatements(files) : null);
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    // Files live outside react-hook-form, so they are checked here rather than
    // by the resolver. Same helper the route handler calls.
    const fileError = validateStatements(statements);
    if (fileError) {
      setStatementError(fileError);
      return;
    }

    const body = new FormData();
    for (const [key, value] of Object.entries(values)) {
      body.append(key, String(value ?? ""));
    }
    for (const file of statements) body.append("statements", file);
    body.append("elapsedMs", String(Date.now() - mountedAt.current));

    try {
      const response = await fetch("/api/apply", { method: "POST", body });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Partial<Record<FieldName, string>>;
      };

      if (!response.ok) {
        // Server-side validation is authoritative; surface it on the fields.
        for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
          if (field === "statements") {
            setStatementError(message);
          } else {
            setError(field as keyof ApplicationInput, { message });
          }
        }
        setFormError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError(
        "We could not reach the server. Check your connection, or call (786) 902-2025."
      );
    }
  });

  if (submitted) {
    return (
      <SuccessPanel
        headingRef={successHeadingRef}
        reduceMotion={Boolean(shouldReduceMotion)}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      encType="multipart/form-data"
      className="border border-border bg-surface p-6 sm:p-8"
    >
      {/* Honeypot. Hidden from sight and from assistive tech; bots still fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <fieldset className="border-0 p-0">
        <legend className={LEGEND_CLASS}>Business</legend>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field
            label="Legal business name"
            name="legalBusinessName"
            error={errors.legalBusinessName?.message}
            className="sm:col-span-2"
          >
            <input
              {...register("legalBusinessName")}
              id="legalBusinessName"
              type="text"
              autoComplete="organization"
              aria-invalid={Boolean(errors.legalBusinessName)}
              aria-describedby={errors.legalBusinessName ? "legalBusinessName-error" : undefined}
              className={FIELD_CLASS}
            />
          </Field>

          <Field label="DBA, if applicable" name="dba" error={errors.dba?.message} optional>
            <input
              {...register("dba")}
              id="dba"
              type="text"
              aria-invalid={Boolean(errors.dba)}
              aria-describedby={errors.dba ? "dba-error" : undefined}
              className={FIELD_CLASS}
            />
          </Field>

          <Field
            label="Business start date"
            name="businessStartDate"
            error={errors.businessStartDate?.message}
          >
            <input
              {...register("businessStartDate")}
              id="businessStartDate"
              type="date"
              aria-invalid={Boolean(errors.businessStartDate)}
              aria-describedby={
                errors.businessStartDate ? "businessStartDate-error" : undefined
              }
              className={FIELD_CLASS}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-12 border-0 p-0">
        <legend className={LEGEND_CLASS}>Owner</legend>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="First name" name="firstName" error={errors.firstName?.message}>
            <input
              {...register("firstName")}
              id="firstName"
              type="text"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className={FIELD_CLASS}
            />
          </Field>

          <Field label="Last name" name="lastName" error={errors.lastName?.message}>
            <input
              {...register("lastName")}
              id="lastName"
              type="text"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={FIELD_CLASS}
            />
          </Field>

          <Field label="Date of birth" name="dateOfBirth" error={errors.dateOfBirth?.message}>
            <input
              {...register("dateOfBirth")}
              id="dateOfBirth"
              type="date"
              autoComplete="bday"
              aria-invalid={Boolean(errors.dateOfBirth)}
              aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
              className={FIELD_CLASS}
            />
          </Field>

          <Field
            label="Social Security number"
            name="ssn"
            error={errors.ssn?.message}
            hint="Used for identity and credit verification only."
          >
            <input
              {...register("ssn")}
              id="ssn"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="123-45-6789"
              aria-invalid={Boolean(errors.ssn)}
              aria-describedby={cn("ssn-hint", errors.ssn && "ssn-error")}
              className={cn(FIELD_CLASS, "font-mono")}
            />
          </Field>

          <Field label="Email" name="email" error={errors.email?.message}>
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={FIELD_CLASS}
            />
          </Field>

          <Field label="Phone number" name="phone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(786) 902-2025"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={FIELD_CLASS}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-12 border-0 p-0">
        <legend className={LEGEND_CLASS}>Bank statements</legend>
        <div className="mt-6">
          <label htmlFor="statements" className={LABEL_CLASS}>
            Last three months of bank statements
          </label>
          <p id="statements-hint" className="mt-2 text-sm text-muted">
            PDF, JPG, or PNG. Up to {MAX_STATEMENT_FILES} files,{" "}
            {formatBytes(MAX_STATEMENT_BYTES)} total.
          </p>
          <input
            id="statements"
            name="statements"
            type="file"
            multiple
            accept={ACCEPTED_STATEMENT_EXTENSIONS}
            onChange={onFilesChange}
            aria-invalid={Boolean(statementError)}
            aria-describedby={cn("statements-hint", statementError && "statements-error")}
            className={cn(
              "mt-3 block w-full cursor-pointer border border-border bg-surface p-3 text-sm text-muted-foreground",
              "file:mr-4 file:cursor-pointer file:border-0 file:bg-foreground file:px-4 file:py-2",
              "file:text-sm file:font-medium file:text-background hover:file:bg-foreground/88",
              statementError && "border-destructive"
            )}
          />

          {statements.length > 0 && !statementError && (
            <ul className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
              {statements.map((file) => (
                <li key={`${file.name}-${file.size}`} className="font-mono text-xs">
                  {file.name} · {formatBytes(file.size)}
                </li>
              ))}
            </ul>
          )}

          {statementError && (
            <p id="statements-error" className="mt-2 text-sm text-destructive">
              {statementError}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="mt-12 border-0 p-0">
        <legend className={LEGEND_CLASS}>Authorization</legend>

        <div className="mt-6">
          <label
            htmlFor="authorized"
            className={CHECKBOX_CLASS}
          >
            <input
              {...register("authorized")}
              id="authorized"
              type="checkbox"
              value="true"
              aria-invalid={Boolean(errors.authorized)}
              aria-describedby={errors.authorized ? "authorized-error" : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-foreground)]"
            />
            <span className="text-base text-foreground">
              <span className="font-medium">Yes.</span> {AUTHORIZATION_LABEL}
            </span>
          </label>

          <Disclosure summary="Read the full authorization">
            <p>{AUTHORIZATION_PREAMBLE}</p>
            {AUTHORIZATION_CLAUSES.map((clause) => (
              <p key={clause.heading}>
                <span className="text-foreground">{clause.heading}</span>{" "}
                {clause.body}
              </p>
            ))}
            <p>
              <span className="text-foreground">
                {AUTHORIZATION_PRIVACY_CLAUSE.heading}
              </span>{" "}
              {AUTHORIZATION_PRIVACY_CLAUSE.before}
              <LegalLink href="/privacy">Privacy Policy</LegalLink> and{" "}
              <LegalLink href="/terms">Terms of Service</LegalLink>
              {AUTHORIZATION_PRIVACY_CLAUSE.after}
            </p>
          </Disclosure>

          {errors.authorized && (
            <p id="authorized-error" className="mt-2 text-sm text-destructive">
              {errors.authorized.message}
            </p>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="contactConsent" className={CHECKBOX_CLASS}>
            <input
              {...register("contactConsent")}
              id="contactConsent"
              type="checkbox"
              value="true"
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-foreground)]"
            />
            <span className="text-base text-foreground">
              {CONTACT_CONSENT_LABEL}
              <span className="ml-2 text-sm text-muted">Optional</span>
            </span>
          </label>

          <Disclosure summary="Read the full consent">
            <p>{CONTACT_CONSENT_BODY}</p>
            <p>
              <span className="text-foreground">{CONTACT_CONSENT_EMPHASIS}</span>{" "}
              {CONTACT_CONSENT_WITHDRAWAL}
            </p>
          </Disclosure>
        </div>

        <div className="mt-6">
          <Field
            label="Electronic signature"
            name="signature"
            error={errors.signature?.message}
            hint="Type your full legal name. This serves as your electronic signature."
          >
            <input
              {...register("signature")}
              id="signature"
              type="text"
              autoComplete="off"
              aria-invalid={Boolean(errors.signature)}
              aria-describedby={cn("signature-hint", errors.signature && "signature-error")}
              className={cn(FIELD_CLASS, "font-serif text-xl")}
            />
          </Field>
        </div>
      </fieldset>

      {formError && (
        <p role="alert" className="mt-8 border border-destructive p-4 text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-8 w-full sm:w-auto">
        {isSubmitting ? "Submitting…" : "Submit application"}
      </Button>

      <p className="mt-4 text-xs text-muted">
        Submitted over an encrypted connection and sent directly to our underwriting
        team. Your information is used solely for funding and verification.
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

function Field({ label, name, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className={LABEL_CLASS}>
        {label}
        {optional && <span className="ml-2 font-normal text-muted">Optional</span>}
      </label>
      {children}
      {hint && (
        <p id={`${name}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Native <details> rather than a state-driven panel: it is keyboard accessible
 * for free, and browsers expand it automatically when printing or when the user
 * runs an in-page find — so the full terms are reachable even by someone who
 * never clicks the toggle.
 */
function Disclosure({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group mt-3 border border-border bg-background/40">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground">
        <span
          aria-hidden="true"
          className="mr-2 inline-block transition-transform duration-200 ease-out group-open:rotate-90"
        >
          ›
        </span>
        {summary}
      </summary>
      <div className="flex flex-col gap-4 border-t border-border px-4 py-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </details>
  );
}

function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline decoration-accent-strong underline-offset-4 transition-colors duration-200 ease-out hover:text-accent-strong"
    >
      {children}
    </a>
  );
}

/**
 * Completion state. The checkmark draws itself (pathLength 0 -> 1), then the
 * copy rises in behind it on the same easing curve the rest of the site uses
 * (see components/ui/reveal.tsx). Under prefers-reduced-motion every element
 * renders at its end state, matching how Reveal handles the same preference.
 */
function SuccessPanel({
  headingRef,
  reduceMotion,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  reduceMotion: boolean;
}) {
  const ease = [0.22, 1, 0.36, 1] as const;

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease },
        };

  return (
    <div
      aria-live="polite"
      className="flex flex-col items-center border border-border bg-surface px-6 py-20 text-center"
    >
      <motion.svg
        viewBox="0 0 52 52"
        className="h-16 w-16"
        fill="none"
        aria-hidden="true"
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          stroke="var(--color-accent-strong)"
          strokeWidth="1.5"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: 0.6, ease }}
        />
        <motion.path
          d="M15 27l8 8 15-16"
          stroke="var(--color-foreground)"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.35, ease }}
        />
      </motion.svg>

      <motion.h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 font-serif text-4xl text-foreground focus:outline-none"
        {...rise(0.6)}
      >
        Application received
      </motion.h3>

      <motion.p className="mt-4 max-w-md text-lg text-muted-foreground" {...rise(0.72)}>
        Your application and bank statements are with our underwriting team. Expect a
        response within one business day.
      </motion.p>

      <motion.p className="mt-6 text-sm text-muted" {...rise(0.84)}>
        Need it sooner? Call{" "}
        <a
          href="tel:+17869022025"
          className="font-mono text-foreground underline decoration-accent-strong underline-offset-4 transition-colors duration-200 ease-out hover:text-accent-strong"
        >
          (786) 902-2025
        </a>
        .
      </motion.p>
    </div>
  );
}
