import { TStoreFrontAdapter, TStoreFrontConfig } from '../types';
import fs from 'fs/promises';

export const createFilesystemAdapter = (filename: string): TStoreFrontAdapter => {
    return {
        config: async (withSecrets: boolean): Promise<TStoreFrontConfig> => {
            const data = await fs.readFile(filename, { encoding: 'utf8' });
            return JSON.parse(data);
        },
    };
};
