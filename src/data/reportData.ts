export type ProductRow = {
  product: string;
  rate: number;
  flagged: boolean;
};

export const reportRows: ProductRow[] = [
  { product: 'Mortgage loans-APR', rate: 914.95, flagged: true },
  { product: 'Vehicle loans-APR', rate: 245.14, flagged: true },
  { product: 'Personal loans-APR', rate: 239.05, flagged: false },
  { product: 'Staff loan-APR', rate: 183.49, flagged: false },
  { product: 'Cheque/invoice discounting-APR', rate: 174.66, flagged: false },
];

export const followUps = ['+ Last 12 months', 'Visualize', '+ By region', '+ Approval volume'];

export const answerSummary =
  'Mortgage loans-APR leads at 914.95%, followed by vehicle and personal loans.';

export const dataAlert =
  'Two rows show approval rates above 100% — values exceed the valid range and should be reviewed before publishing.';

export const meta = {
  timestamp: '17 Aug 2026, 09:42 GST',
  source: 'Core Banking · LMS_PROD',
  responseTime: '21.4s',
  integrity: 'Verified · 100%',
};

export const sqlQuery = `SELECT product_name AS product,
       ROUND(approval_rate, 2) AS approval_rate
FROM   lms.product_approval_summary
WHERE  reporting_period = '2026-08'
ORDER  BY approval_rate DESC
LIMIT  5;`;
