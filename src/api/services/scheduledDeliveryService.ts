import { request } from '@/api/client/apiClient';
import type { ScheduledDeliveriesResponse, ScheduledDeliveryDownload } from '@/api/types/scheduledDelivery';

export const getScheduledDeliveries = () => request<ScheduledDeliveriesResponse>('scheduledDeliveries');
export const downloadScheduledDelivery = (deliveryId: string) =>
  request<ScheduledDeliveryDownload>('scheduledDeliveryDownload', { deliveryId }, { responseType: 'file' });
