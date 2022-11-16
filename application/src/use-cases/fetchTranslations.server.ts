import { default as fsWithCallbacks } from 'fs';
const fs = fsWithCallbacks.promises;
import { BackendStorage } from './contracts/BackendStorage';

const toFlatPropertyMap = (obj: any, keySeparator = '.') => {
    const flattenRecursive = (obj: any, parentProperty?: string, propertyMap: Record<string, unknown> = {}) => {
        for (const [key, value] of Object.entries(obj)) {
            const property = parentProperty ? `${parentProperty}${keySeparator}${key}` : key;
            if (value && typeof value === 'object') {
                flattenRecursive(value, property, propertyMap);
            } else {
                propertyMap[property] = value;
            }
        }
        return propertyMap;
    };
    return flattenRecursive(obj);
};

// we saved that in the memory first, then redis if it's available then fs
export default async (storage: BackendStorage, memoryStorage: BackendStorage, language: string) => {
    const key = `translations-${language}`;
    const memoryCachedFlat = await memoryStorage.get(key);
    if (!memoryCachedFlat) {
        const cachedFlat = await storage.get(key);
        if (!cachedFlat) {
            const raw = await fs.readFile(`./src/translations/${language}.json`, { encoding: 'utf8' });
            const flat = toFlatPropertyMap(JSON.parse(raw));
            memoryStorage.set(key, JSON.stringify(flat), 3600 * 4);
            storage.set(key, JSON.stringify(flat), 3600 * 4);
            return flat;
        }
        memoryStorage.set(key, cachedFlat, 3600 * 4);
        return JSON.parse(cachedFlat);
    }
    return JSON.parse(memoryCachedFlat);
};
