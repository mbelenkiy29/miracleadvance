# Miracle Advance LLC — Homepage

Marketing homepage for Miracle Advance LLC, a nationwide commercial financing company.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Radix Slider · Lucide React

---

## Local development

Requires Node 18.18+ (built and tested on Node 22.20).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npx eslint .     # lint
```

> **Note for this machine:** Node was installed to `~/.local/node` rather than
> system-wide. Add it to your shell so `node` / `npm` resolve:
>
> ```bash
> echo 'export PATH="$HOME/.local/node/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
> ```

## Project structure

```
app/
  layout.tsx     fonts, metadata, Open Graph, JSON-LD (FinancialService + LocalBusiness)
  page.tsx       homepage — composes the sections in order
  globals.css    Tailwind import + design tokens
  favicon.ico    brand mark, multi-size
  icon.png       brand mark, 512×512
components/
  sections/      one file per homepage section
  ui/            button, slider, reveal, editorial-image
lib/utils.ts     cn() class merge helper
lib/images.ts    photography registry — src, alt, dimensions, blur placeholder
public/logo.png  horizontal lockup (1121×439), used in the nav and footer
```

## Photography

Photos are hotlinked from the Unsplash CDN (`images.unsplash.com`, allowed via
`remotePatterns` in `next.config.ts`). Every photo is declared once in
`lib/images.ts` and rendered through `<EditorialImage />` — sections never
reference a URL or style a photo directly, so swapping a source is a one-object
edit.

Images appear in four places: the hero backdrop, a full-bleed break between the
trust bar and the qualifier, one per testimonial, and a single anchor above the
Why Miracle Advance pillars. **Products, Qualifier, and the trust bar stay type-only by
design**, as does the closing CTA band.

The shared grade lives in `.editorial-image-frame` (globals.css):
`sepia(0.14) saturate(0.85) contrast(1.02)` plus a 1px border ring and a soft
inner shadow. The sepia runs *before* the saturate so the desaturation acts on
already-warmed pixels — reversing the order pushes skin tones orange. Change the
grade there, not per image.

Notes:

- `credit.photographer` is `null` on every entry. Unsplash does not require
  attribution for hotlinked images and the names aren't resolvable from CDN URLs
  without an API key. Populate them if you want visible credits.
- The hero backdrop is `decorative` — empty alt and `aria-hidden`. It sits at 40%
  opacity behind the headline and would only add noise to a screen reader. Every
  other photo has descriptive alt text.
- The hero backdrop is hidden below `lg`; its `sizes` ends in `0px` so phones
  fetch the smallest candidate rather than a full-width image.

## Logo

`public/logo.png` is the trimmed horizontal lockup — green mark plus black
"Miracle Advance" wordmark. It is statically imported in `Nav.tsx` and
`Footer.tsx` so Next emits intrinsic dimensions and reserves the box (no layout
shift). The favicon and `app/icon.png` are the mark alone, padded to a square.

The mark's green is `#15994E`. It is deliberately **not** in the token set — the
palette stays gold, and the green is contained to the logo. Supply an SVG to
replace the PNG if you want crisper edges at small sizes; the imports do not
need to change.

## Design tokens

All tokens live in the `@theme` block in `app/globals.css` and are consumed as
Tailwind utilities (`bg-background`, `text-muted-foreground`, `font-serif`, …).
Light mode only — there is no dark mode variant.

| Token | Value | Notes |
| --- | --- | --- |
| `background` | `#F7F5F0` | warm off-white |
| `foreground` | `#0A0E1A` | near-black navy |
| `muted` | `#6B6B6B` | 4.89:1 on background |
| `muted-foreground` | `#4A4A4A` | 8.13:1 on background |
| `accent` | `#B8935A` | **decorative fills only** — 2.62:1 |
| `accent-strong` | `#866B42` | same hue at 73%, 4.57:1 — used for all accent *text*, focus rings, and the slider |
| `border` | `#E5E1D8` | hairline |
| `surface` | `#FFFFFF` | elevated cards (qualifier only) |

**Why two accents:** the specified `#B8935A` reaches only 2.62:1 against the
background, which fails WCAG AA for text (4.5:1) *and* the 3:1 floor for focus
indicators and UI boundaries. `accent-strong` is the same hue darkened until it
clears 4.5:1. If brand consistency outweighs AA here, change every
`accent-strong` utility back to `accent` — it is a single find/replace.

Type is Instrument Serif for display, Geist Sans for body/UI, and Geist Mono for
numeric meta values, all self-hosted via `next/font/google`.

## Motion

`components/ui/reveal.tsx` wraps the fade-and-rise pattern (opacity 0→1,
translateY 12px→0, 600ms, fires once on scroll into view). Trust-bar figures
count up from zero the first time they enter the viewport. Everything respects
`prefers-reduced-motion`, which also disables smooth scrolling.

## Contact form

`/contact` renders a native application form. It replaced a Jotform embed (form
ID `262131030365039`), which had itself replaced a placeholder React form.

Three files:

| File | Role |
|---|---|
| `lib/application-schema.ts` | zod schema + file rules — imported by **both** sides |
| `components/sections/ApplicationForm.tsx` | the client form and success animation |
| `app/api/apply/route.ts` | validates, then emails the application via useSend |

The schema lives in one file on purpose: the route handler re-parses with the
same object the browser used, so a rule relaxed on the client cannot bypass the
server. Files are the one exception — `validateStatements()` is a plain function
next to the schema, called from both places, because `File` does not belong in a
type shared with client-side inference.

**Fields.** Legal business name, EIN, DBA (optional), business start date; owner
first and last name, date of birth, SSN, email, phone; last three months of bank
statements (PDF/JPG/PNG, ≤6 files, ≤10MB total); an authorization checkbox; and a
typed-name electronic signature. The signature must contain the first and last
name entered above — token matching, not string equality, so a middle name or
initial still signs.

**The EIN is required, with one escape hatch.** An "I'm a sole proprietor and
don't have an EIN" checkbox waives it, because sole proprietors and single-member
LLCs frequently have none and apply on their SSN alone — a hard requirement would
turn them away at the form. Ticking it clears and disables the EIN input, so a
half-typed number cannot linger and contradict the waiver, and the underwriting
email reads `None (sole proprietor, per applicant)` rather than showing a blank.
"per applicant" is deliberate: the waiver is an unverified claim.

Validation is structural only — nine digits, no `00` prefix, no repeated-digit
junk. It deliberately does **not** check the two-digit prefix against the IRS
campus list: that list tracks campuses *currently issuing*, while an EIN issued
under a since-retired prefix stays valid forever, so checking it would reject
real, older businesses. Nothing verifies the number against the IRS or any
registry.

### Handling of sensitive data

This form collects SSN, date of birth, and bank statements. The Jotform setup
existed *specifically* so that data never touched this server, and going native
reverses that. The route handler carries a privacy contract in its header
comment — read it before editing:

1. **Nothing is logged.** No parsed field, no raw `FormData`, no file contents.
   Only an outcome line and, on failure, the mail provider's error.
2. **Nothing is persisted.** No Blob, no database, no temp files. Attachment
   buffers live for the request and are dropped.
3. **Nothing is echoed.** Validation failures return a field name and a static
   message, never the value that failed.

The route pins `runtime = "nodejs"` (Buffer/base64 for attachments) and
`dynamic = "force-dynamic"` (a funding application is never cacheable).

### Email delivery

Sent through [useSend](https://docs.usesend.com) (`usesend-js`), an open-source
Resend alternative. **Two plain-text emails per submission:**

1. **The application**, to `APPLICATION_TO_EMAIL`, with the bank statements
   attached and `replyTo` set to the applicant so replying from the inbox reaches
   them directly.
2. **A confirmation to the applicant**, at the address they entered, with
   `replyTo` set to the team inbox. It carries a receipt (business name, file
   count, timestamp), an explicit "not an approval" line, and a copy of the
   authorization text they signed with its version — which is what makes clause 6
   of `lib/authorization-text.ts` true rather than decorative, since the applicant
   consents there to receiving these records electronically.

The confirmation is **best effort and deliberately non-fatal**: it is sent after
the application has already reached the team, and a failure is logged but never
converted into an error response. Returning a failure at that point would push the
applicant to resubmit and land the same deal in the inbox twice.

The confirmation never contains the SSN, EIN, date of birth, phone number, or
statement filenames — see rule 4 of the privacy contract at the top of
`app/api/apply/route.ts`. Adding a field there is a privacy decision, not a
formatting one. The EIN is excluded even though it is not personal data: it is
the primary identifier for business credit fraud, and that email goes to an
address nobody has verified.

Note this means the form emails an **applicant-supplied address**, the standard
abuse vector for contact forms. The honeypot, the 3-second `MIN_FILL_MS` floor,
and the required file attachment are the current mitigations; Vercel BotID is the
escalation if spam ever appears.

| Env var | Purpose |
|---|---|
| `USESEND_API_KEY` | **Required.** Without it the route returns 503 and the form tells the applicant to call. |
| `APPLICATION_TO_EMAIL` | Destination. Defaults to `deals@miracleadvancellc.com`. |
| `APPLICATION_FROM_EMAIL` | Sender. Defaults to `applications@miracleadvancellc.com`. |
| `USESEND_URL` | Only for a self-hosted useSend instance; omit for the managed cloud. |

**The sending domain must be verified in useSend before any mail leaves.** Add
the domain at `app.usesend.com/domains` and publish the DKIM/SPF records it
gives you. Until that is green, sends fail and applicants get the "call us"
fallback — the form itself will look like it is working right up to that point.

**DNS for `miracleadvancellc.com` is authoritative at Vercel, not Squarespace.**
The nameservers are `ns1`/`ns2.vercel-dns.com`, so records must be added with
`vercel dns add` (or the Vercel dashboard). The domain also has a Squarespace DNS
panel that still lists a full set of mail records; **it is inert** and Squarespace
says so in a banner most people scroll past:

> You're using custom nameservers. Your DNS records are managed with your
> third-party nameserver provider.

This cost a full debugging session once. The records looked right in Squarespace,
`dig` returned nothing, useSend reported the domain unverified, and mail to
`deals@` had no MX to land on. If you edit mail records, edit them at Vercel and
confirm with `dig`, not by reading a provider's UI.

Current records (`vercel dns ls miracleadvancellc.com`):

| Name | Type | Purpose |
|---|---|---|
| `@` | MX | `smtp.google.com` — Google Workspace inbound, makes `deals@` reachable |
| `mail` | MX | SES bounce/complaint endpoint for the useSend MAIL FROM subdomain |
| `@` | TXT | SPF for Google (`From:` on the apex) |
| `mail` | TXT | SPF for Amazon SES (the envelope sender useSend actually bounces through) |
| `usesend._domainkey` | TXT | useSend/SES DKIM |
| `_dmarc` | TXT | `p=none` — monitor only |

The two SPF records do not conflict: they cover different names on purpose.

### Spam

A hidden honeypot input plus a mount-to-submit timer; anything under 3 seconds
or with the honeypot filled gets a fake `200` so a bot cannot tell it was
caught. If real spam appears, Vercel BotID is the next step — it was not worth a
dependency up front.

### Motion

The "Reach us directly" `<aside>` is deliberately **not** wrapped in `<Reveal>`.
It is the second grid column beside a form well over 2000px tall, and Reveal's
`amount: 0.2` + `once: true` means ~400px of it must be on screen or it never
fades in — previously observed stuck at opacity 0.148 with the phone number
invisible. Do not re-wrap it.

The success panel draws its checkmark with framer-motion (`pathLength` 0→1) and
then rises the copy in on the same `[0.22, 1, 0.36, 1]` curve Reveal uses. Under
`prefers-reduced-motion` every element renders at its end state. Focus moves to
the success heading and the panel is `aria-live="polite"`, so the completion is
announced rather than only seen.

## Known placeholders

- **The site is `noindex`.** `app/layout.tsx` sets `robots: { index: false }` so
  the review URL stays out of search. This is the one item with a silent failure
  mode — forget it at launch and the site never gets indexed. See *Before going
  public* above.
- **Testimonials** are placeholder copy, marked `// TODO: replace with client-approved testimonials`.
- ~~The useSend sending domain is not verified.~~ **Resolved.** The domain is
  verified, DNS is published at Vercel, and a submission delivers end to end.
  `APPLICATION_TO_EMAIL` was deliberately *removed* from Vercel rather than set,
  so the destination falls through to the code default in `app/api/apply/route.ts`
  and stays visible in the repo.
- **`USESEND_API_KEY` is not available locally.** It is stored as a Vercel
  *Sensitive* variable, which cannot target the Development environment and
  cannot be read back — so `vercel env pull` will never supply it. Add it to
  `.env.local` by hand or the form returns 503 on localhost regardless of what
  production does.
- ~~`google._domainkey` is not published.~~ **Resolved** — Google Workspace DKIM
  is published at Vercel and resolving.
- **CTAs** point at `#qualifier` or `tel:+17869022025`; the qualifier's submit CTA dials the sales line rather than posting anywhere.
- **`siteUrl`** in `app/layout.tsx` is `https://miracleadvancellc.com`. Update it if the production domain differs — it drives canonical, Open Graph, and JSON-LD `@id` values.
- **Open Graph image** is not set. Drop an `app/opengraph-image.png` (1200×630) and Next will wire it up automatically.
- **Process section headline** ("Three steps, start to funded") was not in the brief; it was added so the heading hierarchy stays valid. Safe to delete.

## Deployment (Vercel)

**Live:** <https://miracle-advance.vercel.app> — Vercel project
`michael-belenkiys-projects/miracle-advance`, free Hobby tier.

The app is fully static — every route prerenders at build time, no server
runtime or environment variables required.

Deployed from this directory with the CLI rather than a GitHub import (there is
no git repo here; `vercel deploy` uploads the working directory directly). There
is no `.vercelignore`, so the CLI falls back to `.gitignore`.

```bash
npx --yes vercel@latest link --yes --project miracle-advance
npx --yes vercel@latest --prod --yes
```

`--prod` matters: preview deployments can sit behind Vercel Authentication,
which would make an outside visitor hit an SSO wall. Production on Hobby is
public.

### Before going public

The current deployment is a **client review link**, not a launch. To flip it:

1. `app/layout.tsx` — set `robots` back to `index: true, follow: true` (both the
   top-level block and `googleBot`). Leaving this as-is at launch makes the site
   invisible to search entirely.
2. `app/layout.tsx` — point `siteUrl` at the real domain; it drives canonical,
   Open Graph, and the JSON-LD `@id`s.
3. Add the domain under **Settings → Domains** and point DNS at Vercel.
4. Clear the placeholders listed below, and add `app/opengraph-image.png` so
   shared links unfurl with an image.

## Accessibility

- Sequential heading hierarchy (one `h1`, no skipped levels), verified in-page.
- Skip-to-content link, labelled nav landmarks, `aria-expanded` / `aria-controls`
  on the mobile menu trigger, Escape-to-close, and body scroll lock.
- The credit-profile segmented control uses native radio inputs, so arrow-key
  navigation works out of the box. The revenue slider is Radix, with an
  `aria-valuetext` that reads the formatted dollar amount.
- Global `:focus-visible` ring at 2px `accent-strong`.
- Trust-bar numbers are server-rendered at their final values, so they are
  correct without JavaScript and cause no layout shift.
