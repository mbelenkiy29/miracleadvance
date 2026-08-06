// Placeholder legal copy for a financial services company. Must be reviewed by
// counsel familiar with commercial finance and merchant cash advance regulation
// before publishing. See also app/privacy/page.tsx and app/terms/page.tsx, which
// carry the same caveat.
//
// Open items for counsel, carried over from when this was drafted:
//   - Clause 4 omits "brokers" from the list of recipients, for consistency with
//     the site's positioning. If deals are placed through brokers, add it back —
//     an accurate disclosure matters more than the framing.
//   - The "Reply STOP / HELP" sentence in the contact consent belongs there only
//     if the SMS platform actually honors those keywords. Remove it if texts are
//     sent by hand.
//   - NY's Commercial Finance Disclosure Law governs disclosures made when an
//     offer is extended, not at application, so it does not change this text —
//     but it is adjacent compliance for a NY funder.

/**
 * Bump whenever the wording below changes. The route handler records this with
 * each submission, so a stored application always says which version of the
 * authorization that applicant actually agreed to.
 */
export const AUTHORIZATION_VERSION = "2026-08-06";

export type AuthorizationClause = {
  heading: string;
  /** Rendered as a paragraph. `link` marks the one clause that needs anchors. */
  body: string;
};

/** Short label beside the required checkbox. */
export const AUTHORIZATION_LABEL =
  "I authorize Miracle Advance to review my information and obtain credit reports as described below.";

export const AUTHORIZATION_PREAMBLE =
  "By checking the box above and typing my name as my electronic signature, I certify, acknowledge, and agree that:";

export const AUTHORIZATION_CLAUSES: AuthorizationClause[] = [
  {
    heading: "1. Accuracy and authority.",
    body: "All information I have provided in this application, including the bank statements attached, is true, complete, and accurate. I am an owner, officer, or authorized representative of the business named above and have authority to submit this application and these authorizations on its behalf and on my own behalf individually.",
  },
  {
    heading: "2. Consumer and business credit reports.",
    body: "I authorize Miracle Advance LLC, its affiliates, and its funding partners to obtain consumer credit reports about me personally and business credit reports about the business named above from one or more consumer reporting agencies, and to use them to evaluate this application. I understand this is my written authorization under the Fair Credit Reporting Act, 15 U.S.C. § 1681b. I further authorize these reports to be obtained again in connection with any update, renewal, extension, review, or collection of financing arising from this application.",
  },
  {
    heading: "3. Verification.",
    body: "I authorize Miracle Advance and its funding partners to verify any information in this application by any lawful means, including contacting my bank and other financial institutions, verifying deposits and account activity, obtaining bank verification reports, contacting business and trade references, and reviewing public records.",
  },
  {
    heading: "4. Sharing with funding partners.",
    body: "I understand that Miracle Advance connects businesses with financing across a network of funding sources. I authorize Miracle Advance to share this application and the information and documents submitted with it — including my Social Security number and the bank statements attached — with third-party funders, lenders, servicers, and service providers for the purpose of obtaining and servicing financing for my business.",
  },
  {
    heading: "5. No commitment.",
    body: "Submitting this application does not obligate Miracle Advance or any funding partner to extend financing and does not create a commitment, offer, or agreement to fund. All financing is subject to underwriting review, verification, and execution of separate written agreements.",
  },
  {
    heading: "6. Electronic signature and records.",
    body: "I agree that typing my full legal name constitutes my electronic signature under the federal E-SIGN Act (15 U.S.C. ch. 96) and applicable state law, and that it is legally binding and enforceable to the same extent as a handwritten signature. I consent to receive this authorization and other records relating to this application in electronic form.",
  },
];

/**
 * Clause 7 is separate because it is the only one containing links, and inlining
 * anchors in a plain string would mean rendering raw HTML.
 */
export const AUTHORIZATION_PRIVACY_CLAUSE = {
  heading: "7. Privacy.",
  before: "I have read and understand the ",
  after:
    ", which describe how my information is collected, used, and disclosed.",
};

/** Short label beside the optional checkbox. */
export const CONTACT_CONSENT_LABEL =
  "I agree to receive calls and text messages from Miracle Advance about my application at the number I provided.";

export const CONTACT_CONSENT_BODY =
  "I authorize Miracle Advance LLC and its funding partners to contact me at the phone number and email address I provided, including by automatic telephone dialing system, artificial or prerecorded voice, and SMS text message, regarding this application and financing offers — even if the number is listed on a state or federal Do Not Call registry. Message and data rates may apply and message frequency varies. Reply STOP to opt out of texts or HELP for help.";

/**
 * Kept out of CONTACT_CONSENT_BODY so the form can weight it. Under the TCPA the
 * "not a condition" statement is the part that has to be conspicuous.
 */
export const CONTACT_CONSENT_EMPHASIS =
  "Consent is not a condition of receiving funding.";

export const CONTACT_CONSENT_WITHDRAWAL =
  "I may withdraw consent at any time by contacting deals@miracleadvancellc.com.";

/**
 * Flat text of the whole authorization, for the record kept in each submission
 * email. Built from the same constants the form renders, so the two cannot drift.
 */
export function authorizationPlainText() {
  const clauses = AUTHORIZATION_CLAUSES.map(
    (clause) => `${clause.heading} ${clause.body}`
  );

  const privacy = `${AUTHORIZATION_PRIVACY_CLAUSE.heading} ${AUTHORIZATION_PRIVACY_CLAUSE.before}Privacy Policy and Terms of Service${AUTHORIZATION_PRIVACY_CLAUSE.after}`;

  // join already supplies the blank line between blocks.
  return [AUTHORIZATION_PREAMBLE, ...clauses, privacy].join("\n\n");
}
