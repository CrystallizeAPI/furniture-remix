import { ClientInterface } from '@crystallize/js-api-client';
import { Product } from '../../contracts/Product';
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
import { DataMapper } from '../../mapper';
import fetchFolderWithChildren from './fetchFolderWithChildren';

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
    const mapper = DataMapper({ language, locale });
    return {
        fetchTenantConfig: (tenantIdentifier: string) => fetchTenantConfig(apiClient, tenantIdentifier),
        fetchNavigation: (path: string) =>
            fetchNavigation(apiClient, path, language).then(mapper.API.Call.fetchNavigationToTree),
        fetchTreeMap: () => fetchTreeMap(apiClient, language),
        fetchLandingPage: (path: string) =>
            fetchLandingPage(apiClient, path, version, language).then(mapper.API.Call.fetchLandingPageToLandingPage),
        fetchDocument: (path: string) =>
            fetchDocument(apiClient, path, version, language).then(mapper.API.Call.fetchDocumentToStory),
        fetchProduct: (path: string): Promise<Product> =>
            fetchProduct(apiClient, path, version, language).then(mapper.API.Call.fetchProductToProduct),
        fetchFolder: (path: string) =>
            fetchFolder(apiClient, path, version, language).then(mapper.API.Call.fetchFolderToCategory),
        fetchFolderWithChildren: (path: string) =>
            fetchFolderWithChildren(apiClient, path, version, language).then(
                mapper.API.Call.fetchFolderToCategory(true),
            ),
        fetchShop: (path: string) =>
            Promise.all([
                fetchFolder(apiClient, path, version, language),
                fetchHierarchy(apiClient, path, language),
            ]).then(mapper.API.Call.fetchShopToShop),
        fetchFooter: (path: string) =>
            fetchFooter(apiClient, path, version, language).then(mapper.API.Call.fetchFooterToFooter),
        fetchPriceRangeAndAttributes: (path: string) => fetchPriceRangeAndAttributes(apiClient, path),
        search: (value: string) => search(apiClient, value, language).then(mapper.API.Call.searchProductToProductSlim),
        searchOrderBy: (path: string, orderBy?: any, fitlers?: any, attributes?: any) =>
            searchOrderBy(apiClient, path, language, orderBy, fitlers, attributes).then(
                mapper.API.Call.searchProductToProductSlim,
            ),
        searchOrderByPriceRange: (path: string) =>
            searchOrderByPriceRange(apiClient, path, language).then(mapper.API.Call.searchProductToProductSlim),
        searchFilteredByPriceRange: (path: string, min: string, max: string) =>
            searchFilteredByPriceRange(apiClient, path, language, min, max).then(
                mapper.API.Call.searchProductToProductSlim,
            ),
        searchByTopic: (value: string) =>
            searchByTopic(apiClient, value, language).then(mapper.API.Call.searchByTopicProductToProductSlim),
    };
};
