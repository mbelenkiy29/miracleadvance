# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Marketing site for **Miracle Advance LLC**, a NY commercial financing / merchant cash advance company. Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · Framer Motion.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # bare `eslint` — ESLint 9 flat config, lints cwd
npx tsc --noEmit # typecheck (no dedicated script)
```

**Node lives at `~/.local/node`, not system-wide.** Prefix commands with
`export PATH="$HOME/.local/node/bin:$PATH"` or `node`/`npm` will not resolve.

**There is no test framework and no test files.** Nothing to run a single test
against. The `/api/apply` route has historically been verified with a throwaway
`node` script that POSTs a `FormData` payload at the deployed URL — write one in
the scratchpad rather than adding a test dependency, and use obviously fake data
(the SSN validator rejects `123-45-6789` and other placeholder patterns, so a
probe needs a structurally valid one).

## Architecture

The site is static except for one route. `app/page.tsx` composes homepage
sections in order; `/about`, `/services`, `/contact`, `/privacy`, `/terms` are
separate pages. Section components live in `components/sections/` (one per
section), primitives in `components/ui/`.

Content that appears in more than one place lives in `lib/` and is imported, not
copied. Sections read from these; they never inline the data.

| File | Owns |
|---|---|
| `lib/application-schema.ts` | zod schema + file rules for the application form |
| `lib/authorization-text.ts` | every word of the legal authorization + TCPA consent |
| `lib/images.ts` | photography registry (src, alt, dimensions, blur placeholder) |
| `lib/products.ts` | the product catalogue |

### The application form — three files, one schema

`/contact` collects **SSN, date of birth, and three months of bank statements**.
It replaced a Jotform embed that existed specifically so that data never touched
this server. Going native reversed that, and the constraints below are what make
it defensible.

- `lib/application-schema.ts` — imported by **both** the client form and the
  route handler. The handler re-parses with the same object the browser used, so
  a rule relaxed on the client cannot bypass the server. Keep it that way.
- `components/sections/ApplicationForm.tsx` — react-hook-form + `zodResolver`.
  Files live in `useState` outside RHF, so `validateStatements()` (a plain
  function beside the schema, called from both sides) checks them separately.
- `app/api/apply/route.ts` — validates, then sends mail.

**`app/api/apply/route.ts` carries a PRIVACY CONTRACT in its header comment. It
is binding. Read it before editing that file and do not weaken it:** nothing is
logged (no parsed field, no raw `FormData`, no file contents); nothing is
persisted (no Blob, no DB, no temp files); nothing is echoed back in a response,
including validation errors; and the applicant confirmation carries the business
name and first name only. Adding a field to that confirmation is a privacy
decision, not a formatting one.

The route pins `runtime = "nodejs"` (Buffer/base64 attachments) and
`dynamic = "force-dynamic"`.

**Two emails per submission**, both plain text, via useSend (`usesend-js`):

1. The application to `deals@miracleadvancellc.com`, statements attached,
   `replyTo` the applicant.
2. A confirmation to the applicant's address, `replyTo` the team inbox, with a
   receipt and a copy of the authorization they signed.

The confirmation is **best effort and deliberately non-fatal** — it is sent after
the application has already reached the team, and a failure is logged, never
returned. Turning it into an error would push the applicant to resubmit and land
the same deal in the inbox twice.

This means the form emails an **applicant-supplied address**, the standard
contact-form abuse vector. Current mitigations: a hidden `company_website`
honeypot and a 3-second `MIN_FILL_MS` floor (both return a fake `200` so a bot
cannot tell it was caught), plus the required attachment. Vercel BotID is the
escalation if spam appears.

`describeSendError()` exists because usesend-js mistypes its failure shape — the
API returns `{ error: { code, message } }` and the SDK hands it back unwrapped,
so reading `error.code` logs "undefined undefined" for every real failure. It
also pulls only those two fields so a provider echoing the request back cannot
drag applicant data into a log line.

### Legal text

`lib/authorization-text.ts` is the single source for the authorization the
applicant signs; `authorizationPlainText()` builds the email copy from the same
constants the form renders, so the two cannot drift. **Bump
`AUTHORIZATION_VERSION` whenever the wording changes** — the version is recorded
with every submission, so it is what says which text a given applicant agreed to.

The file is placeholder copy pending counsel review, with open items listed in
its header (clause 4 omits "brokers"; the "Reply STOP/HELP" line assumes the SMS
platform honors those keywords). `app/privacy/page.tsx` and `app/terms/page.tsx`
carry the same caveat.

Date parsing in the schema is deliberately hand-rolled: `new Date("2000-01-01")`
parses as UTC midnight, which is the previous day in every US timezone — enough
to flip the 18th-birthday check. Every `.refine()` is also null-safe on purpose,
because Zod 4 runs the whole chain even after an earlier check has failed.

### Design system

Tokens live in the `@theme` block in `app/globals.css` and are consumed as
Tailwind utilities. **Light mode only, by design.**

`accent` (`#B8935A`) reaches only 2.62:1 on the background and is reserved for
**decorative fills**. `accent-strong` (`#866B42`) is the same hue at 4.57:1 and
is used for every accent *text*, focus ring, and the slider. Do not swap one for
the other to "fix" a color — that is the WCAG AA line.

Photography is hotlinked from the Unsplash CDN (allowed via `remotePatterns` in
`next.config.ts`). Every photo is declared once in `lib/images.ts` and rendered
through `<EditorialImage />`; the shared grade lives in `.editorial-image-frame`
in `globals.css`. **Sections never reference a URL or style a photo directly.**
The sepia runs before the saturate on purpose — reversing it pushes skin tones
orange.

`components/ui/reveal.tsx` wraps the fade-and-rise pattern. Two deliberate
non-uses, both of which look like oversights and are not:

- The "Reach us directly" `<aside>` in `app/contact/page.tsx` is **not** wrapped.
  It is the second grid column beside a 2000px+ form, and Reveal's
  `amount: 0.2` means ~400px of it must be on screen or it never fades in — it
  was previously observed stuck at opacity 0.148 with the phone number invisible.
- Trust-bar figures are server-rendered at their final values, then count up on
  the client, so they are correct without JS and cause no layout shift.

`next.config.ts` pins `outputFileTracingRoot` to this directory: a stray
`package-lock.json` in a parent folder made Next pick the outermost root, which
risked `/api/apply` shipping without its dependencies.

## Deployment

Vercel project `michael-belenkiys-projects/miracle-advance`, GitHub-connected
(`mbelenkiy29/miracleadvance`) — pushing to `main` triggers a production deploy.
The README's "deployed with the CLI, no git repo" section is outdated.

**Vercel environment variables bake in at deploy time.** An existing deployment
never picks up a variable added afterward. Adding or changing one requires
`vercel redeploy`; skipping this has already cost one full debugging session
where the code was correct and the 503 persisted.

| Env var | Purpose |
|---|---|
| `USESEND_API_KEY` | **Required.** Without it the route returns 503 and the form tells the applicant to call. |
| `APPLICATION_TO_EMAIL` | Destination. Deliberately *unset* so it falls through to the code default and stays visible in the repo. |
| `APPLICATION_FROM_EMAIL` | Sender. Defaults to `applications@miracleadvancellc.com`. |
| `USESEND_URL` | Self-hosted useSend only; omit for the managed cloud. |

`USESEND_API_KEY` is a Vercel **Sensitive** variable, which cannot target the
Development environment and cannot be read back — `vercel env pull` will never
supply it. **The form returns 503 on localhost** unless it is added to
`.env.local` by hand.

**DNS for `miracleadvancellc.com` is authoritative at Vercel, not Squarespace.**
Nameservers are `ns1`/`ns2.vercel-dns.com`, so records go in with `vercel dns
add`. The domain still has a full set of mail records in a Squarespace panel and
**they are inert** — Squarespace says so in a banner most people scroll past.
Verify mail records with `dig`, never by reading a provider's UI.

## Known placeholders

- **The site is `noindex`.** `app/layout.tsx` sets `robots: { index: false }` for
  the review link. This is the one item with a silent failure mode — forget it at
  launch and the site is never indexed. `siteUrl` in the same file drives
  canonical, Open Graph, and JSON-LD `@id`, and must be updated with it.
- Phone `(786) 902-2025` and address `75 Wall Street` appear in
  `app/contact/page.tsx` and the JSON-LD in `app/layout.tsx` — unconfirmed.
- Testimonials are placeholder copy (marked with a TODO).
- No `app/opengraph-image.png`.
- The old Jotform form `262131030365039` is still live and can still accept
  submissions.
</content>
</invoke>
