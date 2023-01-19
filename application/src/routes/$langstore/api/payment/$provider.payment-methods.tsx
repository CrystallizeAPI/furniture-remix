import { LoaderFunction, json } from '@remix-run/node';
import fetchAvailableBanks from '~/use-cases/payments/montonio/fetchAvailableBanks';
import { storage } from '~/use-cases/services.server';

export const loader: LoaderFunction = async ({ params }) => {
    if (params.provider !== 'montonio') {
        return json({ error: 'Provider not supported' }, { status: 400 });
    }
    const cached = await storage.get('montonio-banks');
    if (cached) {
        return json(JSON.parse(cached));
    }
    const points = await fetchAvailableBanks();
    // AS per documentation we are going to cache this for 24 hours
    storage.set('montonio-banks', JSON.stringify(points), 86400);
    return json(points);
};
