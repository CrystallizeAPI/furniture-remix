import { TStoreFrontAdapter, TStoreFrontConfig } from '../types';

export const createMemoryAdapter = (config: TStoreFrontConfig): TStoreFrontAdapter => {
    return {
        config: async (withSecrets: boolean): Promise<TStoreFrontConfig> => config,
    };
};
