import ProductPage, { fetchData as ProductFetchData, PDF as ProductPDF, Product } from './Product';
import CategoryPage, { fetchData as CategoryFetchData, PDF as CategoryPDF } from './Category';
import TopicPage, { fetchData as TopicFetchData, PDF as TopicPDF } from './Topic';
import CuratedStoryPage, { fetchData as CuratedStoryFetchData, PDF as CuratedStoryPDF } from './CuratedStory';
import StoryPage, { fetchData as StoryFetchData, PDF as StoryPDF } from './Story';
import AbstractStoryPage, { fetchData as AbstractFetchData, PDF as AbstractPDF } from './AbstractStory';
import LandingPagePage, { fetchData as LandingPageFetchData, PDF as LandingPagePDF } from './LandingPage';

export type PageRenderer<T> = {
    component: React.FunctionComponent<{ data: T }>;
    PdfComponent: React.FunctionComponent<{ data: T }>;
    fetchData: (path: string, request: any, params: any) => Promise<T>;
};

const buildRenderer = <T>(
    component: React.FunctionComponent<{ data: T }>,
    PdfComponent: React.FunctionComponent<{ data: T }>,
    fetchData: (path: string, request: any, params: any) => Promise<T>,
): PageRenderer<T> => {
    return {
        component,
        PdfComponent,
        fetchData,
    };
};

const createPageRenderer = () => {
    return {
        resolve: (shapeIdentifier: string, request?: any, params?: any) => {
            switch (shapeIdentifier) {
                case 'product':
                    return buildRenderer<Product>(ProductPage, ProductPDF, ProductFetchData);
                case 'category':
                    return buildRenderer<any>(CategoryPage, CategoryPDF, CategoryFetchData);
                case 'story':
                    return buildRenderer<any>(StoryPage, StoryPDF, StoryFetchData);
                case 'curated-product-story':
                    return buildRenderer<any>(CuratedStoryPage, CuratedStoryPDF, CuratedStoryFetchData);
                case 'abstract-story':
                    return buildRenderer<any>(AbstractStoryPage, AbstractPDF, AbstractFetchData);
                case '_topic':
                    return buildRenderer<any>(TopicPage, TopicPDF, TopicFetchData);
                case 'landing-page':
                    return buildRenderer<any>(LandingPagePage, LandingPagePDF, LandingPageFetchData);
            }
            console.log(request?.url);
            throw new Error(`No page renderer found for shape ${shapeIdentifier}`);
        },
    };
};

export default createPageRenderer();
