import { ClientInterface } from '@crystallize/js-api-client';
import { Product } from '~/core/contracts/Product';
import mapFetchProductToProduct from '../mapper/mapFetchProductToProduct';
import mapFetchDocumentToStory from '../mapper/mapFetchDocumentToStory';
import fetchLandingPage from './fetchLandingPage';
import fetchDocument from './fetchDocument';
import fetchFolder from './fetchFolder';
import fetchHierarchy from './fetchHierarchy';
import fetchNavigation from './fetchNavigation';
import fetchPriceRangeAndAttributes from './fetchPriceRangeAndAttributes';
import fetchProduct from './fetchProduct';
import fetchTenantConfig from './fetchTenantConfig';
import fetchTreeMap from './fetchTreeMap';
import fetchFooter from './fetchFooter';
import search from './search';
import searchByTopic from './searchByTopic';
import searchFilteredByPriceRange from './searchFilteredByPriceRange';
import searchOrderBy from './searchOrderBy';
import searchOrderByPriceRange from './searchOrderByPriceRange';
import mapFetchLandingPageToLandingPage from '../mapper/mapFetchLandingPageToLandingPage';
import mapSearchByTopicProductToProductSlim from '../mapper/mapSearchByTopicProductToProductSlim';
import mapSearchProductToProductSlim from '../mapper/mapSearchProductToProductSlim';
import mapNavigationToTree from '../mapper/mapNavigationToTree';
import mapFetchShopToShop from '../mapper/mapFetchShopToShop';
import mapFetchFolderToCategory from '../mapper/mapFetchFolderToCategory';
import fetchFolderWithChildren from './fetchFolderWithChildren';
import mapFetchFolderWithChildrenToCategoryWithChildren from '../mapper/mapFetchFolderWithChildrenToCategoryWithChildren';
import mapAPIFooterToFooter from '../mapper/mapAPIFooterToFooter';

export type CrystallizeAPIContext = {
    apiClient: ClientInterface;
    locale?: string;
    isPreview?: boolean;
    language: string;
};

export const CrystallizeAPI = ({
    apiClient,
    language,
    locale = language,
    isPreview = false,
}: CrystallizeAPIContext) => {
    const version = isPreview ? 'draft' : 'published';
    return {
        fetchTenantConfig: (tenantIdentifier: string) => fetchTenantConfig(apiClient, tenantIdentifier),
        fetchNavigation: (path: string) => fetchNavigation(apiClient, path, language).then(mapNavigationToTree),
        fetchTreeMap: () => fetchTreeMap(apiClient, language),
        fetchLandingPage: (path: string) =>
            fetchLandingPage(apiClient, path, version, language).then(mapFetchLandingPageToLandingPage),
        fetchDocument: (path: string) =>
            fetchDocument(apiClient, path, version, language).then(mapFetchDocumentToStory),
        fetchProduct: (path: string): Promise<Product> =>
            fetchProduct(apiClient, path, version, language).then(mapFetchProductToProduct),
        fetchFolder: (path: string) => fetchFolder(apiClient, path, version, language).then(mapFetchFolderToCategory),
        fetchFolderWithChildren: (path: string) =>
            fetchFolderWithChildren(apiClient, path, version, language).then(
                mapFetchFolderWithChildrenToCategoryWithChildren,
            ),
        fetchShop: (path: string) =>
            Promise.all([
                fetchFolder(apiClient, path, version, language),
                fetchHierarchy(apiClient, path, language),
            ]).then(mapFetchShopToShop),
        fetchFooter: (path: string) => fetchFooter(apiClient, path, version, language).then(mapAPIFooterToFooter),
        fetchPriceRangeAndAttributes: (path: string) => fetchPriceRangeAndAttributes(apiClient, path),
        search: (value: string) => search(apiClient, value, language).then(mapSearchProductToProductSlim),
        searchOrderBy: (path: string, orderBy?: any, fitlers?: any, attributes?: any) =>
            searchOrderBy(apiClient, path, language, orderBy, fitlers, attributes).then(mapSearchProductToProductSlim),
        searchOrderByPriceRange: (path: string) =>
            searchOrderByPriceRange(apiClient, path, language).then(mapSearchProductToProductSlim),
        searchFilteredByPriceRange: (path: string, min: string, max: string) =>
            searchFilteredByPriceRange(apiClient, path, language, min, max).then(mapSearchProductToProductSlim),
        searchByTopic: (value: string) =>
            searchByTopic(apiClient, value, language).then(mapSearchByTopicProductToProductSlim),
    };
};
