import { ClientInterface, createClient, CrystallizeClient } from '@crystallize/js-api-client';
import * as redis from 'redis';
import crypto from 'crypto';

export type SuperFastConfig = {
    identifier: string;
    tenantIdentifier: string;
    language: string;
    storefront: string;
    logo: string;
    theme: string;
    configuration: {
        [key: string]: string;
    };
};

export type SuperFastClient = {
    config: SuperFastConfig;
    apiClient: ClientInterface;
};

function createStorage(ttlInSeconds: number) {
    let redisDSN = `${process.env.REDIS_DSN || 'redis://127.0.0.1:6379'}`;
    const config = require('platformsh-config').config();
    if (config.isValidPlatform()) {
        const credentials = config.credentials('redis');
        redisDSN = `redis://${credentials.host}:${credentials.port}`;
    }
    const client = redis.createClient({ url: redisDSN });
    client.connect();
    return {
        get: async (key: string) => await client.get(`superfast-${key}`),
        set: async (key: string, value: any) => {
            await client.set(`superfast-${key}`, value);
            client.expireAt(`superfast-${key}`, Math.floor(Date.now() / 1000) + ttlInSeconds);
        },
    };
}

async function fetchSuperFastConfig(domainkey: string): Promise<SuperFastConfig> {
    const query = `query {
  catalogue(path:"/tenants/${domainkey}") {
    name
    components{
      id
      content {
        __typename
        ...on SingleLineContent{
          text
        }
        ...on RichTextContent {
          html
        }
        ...on SelectionContent {
          options {
            key
            value
          }
        }
        ...on BooleanContent {
         value
        }
        ...on ImageContent {
          firstImage{
            url
          }
        }
        ...on PropertiesTableContent {
          sections {
            title
            properties {
              key
              value
            }
          }
        }
      }
    }
  }
}`;

    const tenant = await CrystallizeClient.catalogueApi(query);
    const components = tenant.catalogue.components.reduce((result: any, component: any) => {
        function toString(component: any): string | boolean {
            switch (component?.content?.__typename) {
                case 'SingleLineContent':
                    return component.content.text;
                case 'RichTextContent':
                    return component.content.html.join('');
                case 'SelectionContent':
                    return component.content.options[0].key;
                case 'BooleanContent':
                    return component.content.value;
                case 'ImageContent':
                    return component.content.firstImage.url;
                case 'PropertiesTableContent':
                    return component.content.sections.reduce((result: any, section: any) => {
                        section.properties.forEach((property: any) => {
                            result[property.key] = property.value;
                        });
                        return result;
                    }, {});
                default:
                    return false;
            }
        }
        return {
            ...result,
            [component.id]: toString(component),
        };
    }, {});
    return {
        identifier: domainkey,
        tenantIdentifier: components['tenant-identifier'],
        language: 'en',
        storefront: components['storefront'],
        logo: components['logos'],
        theme: components['theme'],
        configuration: components['configuration'],
    };
}
const storageClient = createStorage(30);

export async function getSuperFast(hostname: string): Promise<SuperFastClient> {
    //@ts-ignore
    if (typeof window === 'object') {
        throw new Error('fetchSuperFastConfig MUST not be called in the browser');
    }
    const domainkey = hostname.split('.')[0];
    const hit = await storageClient.get(domainkey);
    let config: SuperFastConfig | undefined = undefined;

    if (!hit) {
        config = await fetchSuperFastConfig(domainkey);
        await storageClient.set(domainkey, JSON.stringify(config));
    } else {
        config = await JSON.parse(hit);
    }

    if (config !== undefined) {
        config.configuration = cypher(`${process.env.ENCRYPTED_PARAMS_SECRET}`).decryptMap(config.configuration);
        return {
            config: config,
            apiClient: createClient({
                tenantIdentifier: config.tenantIdentifier,
                accessTokenId: config.configuration.ACCESS_TOKEN_ID,
                accessTokenSecret: config.configuration.ACCESS_TOKEN_SECRET,
            }),
        };
    }
    throw new Error('Impossible to fetch SuperFast config');
}

const cypher = (
    secret: string,
): {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
    decryptMap: (map: { [key: string]: string }) => { [key: string]: string };
} => {
    const key = crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, 32);
    const algorithm = 'aes-256-cbc';
    function encrypt(value: string): string {
        const initVector = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, initVector);
        let encryptedData = cipher.update(value, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return `${initVector.toString('hex')}:${encryptedData}`;
    }

    function decrypt(value: string): string {
        const [initVector, encryptedData] = value.split(':');
        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(initVector, 'hex'));
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
        decryptedData += decipher.final('utf8');
        return decryptedData;
    }

    return {
        encrypt,
        decrypt,
        decryptMap: (map: { [key: string]: string }) => {
            let result = {};
            Object.keys(map).forEach((key: string) => {
                result = {
                    ...result,
                    [key]: decrypt(map[key]),
                };
            });
            return result;
        },
    };
};
