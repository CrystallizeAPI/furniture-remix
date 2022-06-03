import { createSuperFastAdapter } from 'src/lib/storefrontaware/adapters/superfast.server';
import { createStoreFront } from 'src/lib/storefrontaware/storefront.server';

export const getStoreFront = async (hostname: string) => {
    const adapter = createSuperFastAdapter(hostname);
    const [shared, secret] = await Promise.all([createStoreFront(adapter, false), createStoreFront(adapter, true)]);
    return { shared, secret };
};
