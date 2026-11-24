import type { ConnectivityGroup } from './ConnectivityDialog';

/** The Figma sample (Connectivity Dialog, 3483:17589) */
export const sampleConnectivity: ConnectivityGroup[] = [
  {
    title: 'iScribe Backend',
    hosts: [
      { host: 'api.iscribehealthwebapi.com', status: 'ok', ms: 1616 },
      { host: 'iscribeensprod.azurewebsites.net', status: 'ok', ms: 249 },
      { host: 'iscribestore.blob.core.windows.net', status: 'ok', ms: 278 },
      { host: 'iscribestorage.blob.core.windows.net', status: 'ok', ms: 303 },
      { host: 'api.deepgram.com', status: 'ok', ms: 481 },
    ],
  },
  {
    title: 'Authentication',
    hosts: [
      { host: 'auth.iscribehealth.com', status: 'checking' },
      { host: 'cdn.auth0.com', status: 'ok', ms: 204 },
      { host: 'cdn.prod.website-files.com', status: 'ok', ms: 288 },
      { host: 'app-site-association.cdn-apple.com', status: 'ok', ms: 611 },
    ],
  },
  {
    title: 'Analytics / Error Tracking',
    hosts: [
      { host: 'api2.amplitude.com', status: 'checking' },
      { host: 'api.amplitude.com', status: 'error' },
      { host: 'sr-client-cfg.amplitude.com', status: 'error' },
      { host: 'o4507347301302272.ingest.us.sentry.io', status: 'error' },
      { host: 'log-analytics-ingestion-prod-hlw8.eastus-1.ingest.monitor.azure.com', status: 'ok', ms: 611 },
    ],
  },
  {
    title: 'Customer Support — Intercom',
    hosts: [
      { host: 'mcs2wpll-ios.mobile-messenger.intercom.com', status: 'ok', ms: 1616 },
      { host: 'nexus-websocket-a.intercom.io', status: 'ok', ms: 249 },
      { host: 'nexus-websocket-b.intercom.io', status: 'ok', ms: 278 },
      { host: 'uploads.intercomcdn.com', status: 'ok', ms: 303 },
      { host: 'downloads.intercomcdn.com', status: 'ok', ms: 481 },
      { host: 'static.intercomassets.com', status: 'ok', ms: 481 },
    ],
  },
  {
    title: 'In-App Web Views',
    hosts: [
      { host: 'vss.iscribehealth.com', status: 'ok', ms: 1616 },
      { host: 'www.iscribehealth.com', status: 'ok', ms: 249 },
    ],
  },
];
