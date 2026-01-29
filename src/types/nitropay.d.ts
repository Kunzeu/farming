// Declaraciones de tipos para NitroPay
declare global {
  interface Window {
    nitroAds?: {
      createAd: (config: NitroPayAdConfig) => Promise<void>;
      addUserToken: (token: string) => void;
      queue: Array<[string, unknown[], (value?: unknown) => void]>;
    };
  }
}

export interface NitroPayAdConfig {
  format: string;
  media: string;
  sizes?: string | string[];
  container?: string;
  refresh?: number;
  refreshLimit?: number;
  targeting?: Record<string, string>;
  renderVisibleOnly?: boolean;
}

export {};

