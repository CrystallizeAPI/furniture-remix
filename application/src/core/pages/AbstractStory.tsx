import { RequestContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';

import CuratedStory from './CuratedStory';
import { DocumentType, Story as typedStory } from '../contracts/Documents';
import { CuratedStory as typedCuratedStory } from '../contracts/Documents';
import Story from './Story';

export const fetchData = async (
    path: string,
    request: RequestContext,
    params: any,
): Promise<{
    document: DocumentType;
}> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    const document = await api.fetchDocument(path);
    if (!document) {
        throw new Response('Story Mot Found', {
            status: 404,
            statusText: 'Story Not Found',
        });
    }
    return { document };
};

export default ({ data }: { data: Awaited<ReturnType<typeof fetchData>> }) => {
    const { document } = data;

    if (document.shape === 'curated-product-story') {
        return <CuratedStory data={document} />;
    }
    if (document.shape === 'story') {
        return <Story data={document} />;
    }
    return <div> No renderer for type</div>;
};
