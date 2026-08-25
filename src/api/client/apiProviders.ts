import { reportMockProvider } from '@/api/mocks/reportMockProvider';
import { widgetMockProvider } from '@/api/mocks/widgetMockProvider';
import { scheduledDeliveryMockProvider } from '@/api/mocks/scheduledDeliveryMockProvider';

export type ApiRequestContext = {
  params: Record<string, string>;
  body?: unknown;
};

export type MockProvider = (context: ApiRequestContext) => Promise<unknown>;

export const mockProviderRegistry: Record<string, MockProvider> = {
  widgets: ({ params }) => widgetMockProvider.getWidgets(params.scope as import('@/api/types/widget').WidgetScope, params),
  homeWidgets: () => widgetMockProvider.getHomeWidgets(),
  widgetData: ({ params }) => widgetMockProvider.getWidgetData(params.widgetId),
  widgetMutations: ({ params, body }) =>
    body && (body as { action?: string }).action === 'REMOVE'
      ? widgetMockProvider.removeWidgetFromHome(params.widgetId)
      : widgetMockProvider.addWidgetToHome(params.widgetId),
  pinnedReports: () => reportMockProvider.getPinnedReports(),
  widgetRecommendations: () => widgetMockProvider.getWidgetRecommendations(),
  scheduledDeliveries: () => scheduledDeliveryMockProvider.getScheduledDeliveries(),
  scheduledDeliveryDownload: ({ params }) => scheduledDeliveryMockProvider.downloadScheduledDelivery(params.deliveryId),
};
