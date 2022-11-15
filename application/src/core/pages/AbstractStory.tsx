import { RequestContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';

import CuratedStory from './CuratedStory';
import { Story as StoryType, CuratedStory as CuratedStoryType } from '../../use-cases/contracts/Story';
import Story from './Story';

export const fetchData = async (
    path: string,
    request: RequestContext,
    params: any,
): Promise<StoryType | CuratedStoryType> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    const story = await api.fetchDocument(path);
    if (!story) {
        throw new Response('Story Mot Found', {
            status: 404,
            statusText: 'Story Not Found',
        });
    }
    return story;
};

export default ({ data: story }: { data: Awaited<ReturnType<typeof fetchData>> }) => {
    if (story.type === 'curated-product-story') {
        return <CuratedStory data={story} />;
    }
    if (story.type === 'story') {
        return <Story data={story} />;
    }
    return <div> No renderer for type</div>;
};
