import ProductPage, { fetchData as ProductFetchData, Product } from './Product';
import CategoryPage, { fetchData as CategoryFetchData } from './Category';
import TopicPage, { fetchData as TopicFetchData } from './Topic';
import CuratedStoryPage, { fetchData as CuratedStoryFetchData } from './CuratedStory';
import StoryPage, { fetchData as StoryFetchData } from './Story';
import AbstractStoryPage, { fetchData as AbstractFetchData } from './AbstractStory';
import LandingPagePage, { fetchData as LandingPageFetchData } from './LandingPage';

export type PageRenderer<T> = {
    component: React.FunctionComponent<{ data: T }>;
    fetchData: (path: string, request: any, params: any) => Promise<T>;
};

const buildRenderer = <T>(
    component: React.FunctionComponent<{ data: T }>,
    fetchData: (path: string, request: any, params: any) => Promise<T>,
): PageRenderer<T> => {
    return {
        component,
        fetchData,
    };
};

const createPageRenderer = () => {
    return {
        resolve: (shapeIdentifier: string, request?: any, params?: any) => {
            switch (shapeIdentifier) {
                case 'product':
                    return buildRenderer<Product>(ProductPage, ProductFetchData);
                case 'category':
                    return buildRenderer<any>(CategoryPage, CategoryFetchData);
                case 'story':
                    return buildRenderer<any>(StoryPage, StoryFetchData);
                case 'curated-product-story':
                    return buildRenderer<any>(CuratedStoryPage, CuratedStoryFetchData);
                case 'abstract-story':
                    return buildRenderer<any>(AbstractStoryPage, AbstractFetchData);
                case '_topic':
                    return buildRenderer<any>(TopicPage, TopicFetchData);
                case 'landing-page':
                    return buildRenderer<any>(LandingPagePage, LandingPageFetchData);
            }
            console.log(request?.url);
            throw new Error(`No page renderer found for shape ${shapeIdentifier}`);
        },
    };
};

export default createPageRenderer();
