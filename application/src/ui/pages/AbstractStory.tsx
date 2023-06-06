'use client';
import { CuratedStory as CuratedStoryType, Story as StoryType } from '~/use-cases/contracts/Story';
import CuratedStory from './CuratedStory';
import Story from './Story';

export default ({ data: story }: { data: CuratedStoryType | StoryType }) => {
    if (story.type === 'curated-product-story') {
        return <CuratedStory data={story} />;
    }
    if (story.type === 'story') {
        return <Story data={story} />;
    }
    return <div> No renderer for type</div>;
};
