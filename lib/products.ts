export type Product = {
  name: string;
  description: string;
  range: string;
  speed: string;
  term: string;
};

export type ProductCategory = {
  category: string;
  products: Product[];
};

/**
 * Single source of truth for the product catalogue.
 *
 * Rendered on the homepage with full meta (range, speed, term) and on
 * /services with that meta suppressed via the Products `hideMeta` prop. The
 * data itself is never filtered or mutated per page, so the two views cannot
 * drift apart.
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    category: "Growth Capital",
    products: [
      {
        name: "SBA Loans",
        description:
          "Government-backed financing with competitive rates and longer terms. Well suited for established businesses opening new locations, acquiring competitors, or refinancing higher-cost debt.",
        range: "Up to $5M",
        speed: "Structured timeline",
        term: "Up to 25 years",
      },
      {
        name: "Installment Loans",
        description:
          "Predictable fixed payments over a set term. Structured like a traditional bank loan, funded on a modern timeline.",
        range: "$5K to $1M+",
        speed: "As fast as same-day",
        term: "6 to 18+ months",
      },
      {
        name: "Line of Credit",
        description:
          "Draw what you need when you need it. Pay interest only on the amount used. Refills as you repay.",
        range: "$5K to $1M+",
        speed: "As fast as same-day",
        term: "Revolving",
      },
    ],
  },
  {
    category: "Fast Business Funding",
    products: [
      {
        name: "Merchant Cash Advance",
        description:
          "Growth capital repaid as a percentage of daily card sales. Payments scale with revenue, so slow days cost less.",
        range: "$5K to $1M+",
        speed: "As fast as same-day",
        term: "3 to 18+ months",
      },
      {
        name: "Working Capital",
        description:
          "Cover payroll, inventory, seasonal gaps, or the build-out of a new location without disrupting operations. Flexible structure, minimal documentation.",
        range: "$5K to $1M+",
        speed: "As fast as same-day",
        term: "3 to 18+ months",
      },
      {
        name: "Revenue-Based Financing",
        description:
          "Capital repaid as a fixed percentage of monthly revenue. Payments flex with your cash flow.",
        range: "$5K to $1M+",
        speed: "As fast as same-day",
        term: "6 to 24 months",
      },
      {
        name: "Invoice Factoring",
        description:
          "Turn outstanding invoices into immediate cash. Sell receivables at a discount and get funded quickly.",
        range: "$5K to $1M+",
        speed: "As fast as same-day",
        term: "Per invoice cycle",
      },
    ],
  },
  {
    category: "Specialty Financing",
    products: [
      {
        name: "Equipment Financing",
        description:
          "Purchase or lease the equipment your business needs. The equipment itself secures the financing, which keeps rates competitive.",
        range: "$5K to $1M+",
        speed: "As fast as same-day",
        term: "12 to 60 months",
      },
      {
        name: "Payday Loans",
        description:
          "Short-term consumer financing for personal cash flow gaps. Fast approval, minimal paperwork, licensed nationwide.",
        range: "$100 to $5K",
        speed: "Same day",
        term: "14 to 30 days",
      },
    ],
  },
];
