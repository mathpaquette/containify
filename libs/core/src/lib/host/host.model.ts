export interface HostEvent {
  appId: string;
  baseAppUrl: string;
  remoteUrl: string;
  url: string;
}

export interface ContainifyApp {
  appId: string;
  remoteApp: any;
}

export interface RemoteApp {
  id: string;
  name: string;
  url: string;
}
