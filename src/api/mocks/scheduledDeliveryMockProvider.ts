import type { ScheduledDeliveriesResponse, ScheduledDeliveryDownload } from '@/api/types/scheduledDelivery';

const deliveries: ScheduledDeliveriesResponse = {
  deliveries: [
    { id: 'delivery-1001', reportId: 'rpt-1001', reportName: 'Loan Portfolio Summary', fileName: 'loan-portfolio-summary-2026-08-25.pdf', format: 'PDF', generatedAt: '2026-08-25T09:00:00Z', status: 'READY' },
    { id: 'delivery-1002', reportId: 'rpt-1002', reportName: 'Collections Performance', fileName: 'collections-performance-2026-08-24.xlsx', format: 'XLSX', generatedAt: '2026-08-24T19:30:00Z', status: 'READY' },
  ],
};

const files: Record<string, { content: string; type: string }> = {
  'delivery-1001': { content: '%PDF-1.4\n% ReportIQ mock PDF\n', type: 'application/pdf' },
  'delivery-1002': { content: 'ReportIQ mock spreadsheet\nCollections Performance\n', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
};

export const scheduledDeliveryMockProvider = {
  getScheduledDeliveries: async () => deliveries,
  downloadScheduledDelivery: async (deliveryId: string): Promise<ScheduledDeliveryDownload> => {
    const delivery = deliveries.deliveries.find((item) => item.id === deliveryId);
    const file = files[deliveryId];
    if (!delivery || !file) throw new Error(`Scheduled delivery not found: ${deliveryId}`);
    return { blob: new Blob([file.content], { type: file.type }), fileName: delivery.fileName, contentType: file.type };
  },
};
