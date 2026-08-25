export type ScheduledDelivery = {
  id: string;
  reportId: string;
  reportName: string;
  fileName: string;
  format: 'PDF' | 'XLSX';
  generatedAt: string;
  status: 'READY' | 'FAILED' | 'PROCESSING';
};

export type ScheduledDeliveriesResponse = { deliveries: ScheduledDelivery[] };
export type ScheduledDeliveryDownload = { blob: Blob; fileName: string; contentType: string };
