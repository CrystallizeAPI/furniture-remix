import { ClientInterface } from '@crystallize/js-api-client';

export type TStoreFrontConfig = {
    identifier: string;
    tenantIdentifier: string;
    language: string;
    storefront: string;
    logo: string;
    theme: string;
    configuration: Record<string, string>;
};

export type TStoreFrontAdapter = {
    config: (withSecrets: boolean) => Promise<TStoreFrontConfig>;
};

export type TStoreFront = {
    config: TStoreFrontConfig;
    apiClient: ClientInterface;
};

export type Action = {};
export type Actions = {};
export type Dispatch = (action: Action) => void;

export type State = {
    config: TStoreFrontConfig;
};
