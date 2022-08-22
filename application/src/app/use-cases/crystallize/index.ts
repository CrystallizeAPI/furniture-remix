import { ClientInterface } from '@crystallize/js-api-client';
import fetchCampaignPage from './fetchCampaignPage';
import fetchDocument from './fetchDocument';
import fetchFolder from './fetchFolder';
import fetchNavigation from './fetchNavigation';
import fetchPriceRangeAndAttributes from './fetchPriceRangeAndAttributes';
import fetchProduct from './fetchProduct';
import fetchProducts from './fetchProducts';
import fetchTenantConfig from './fetchTenantConfig';
import fetchTopicNavigation from './fetchTopicNavigation';
import search from './search';
import searchByTopic from './searchByTopic';
import searchFilteredByPriceRange from './searchFilteredByPriceRange';
import searchOrderBy from './searchOrderBy';
import searchOrderByPriceRange from './searchOrderByPriceRange';

export const CrystallizeAPI = (apiClient: ClientInterface, language: string, previewMode: boolean = false) => {
    const version = previewMode ? 'draft' : 'published';
    return {
        fetchTenantConfig: (tenantIdentifier: string) => fetchTenantConfig(apiClient, tenantIdentifier),
        fetchNavigation: (path: string) => fetchNavigation(apiClient, path, language),
        fetchTopicNavigation: (path: string) => fetchTopicNavigation(apiClient, path, language),
        fetchProducts: (path: string) => fetchProducts(apiClient, path, language),
        fetchCampaignPage: (path: string) => fetchCampaignPage(apiClient, path, version, language),
        fetchDocument: (path: string) => fetchDocument(apiClient, path, version, language),
        fetchProduct: (path: string) => fetchProduct(apiClient, path, version, language),
        fetchFolder: (path: string) => fetchFolder(apiClient, path, version, language),
        fetchPriceRangeAndAttributes: (path: string) => fetchPriceRangeAndAttributes(apiClient, path),
        search: (value: string) => search(apiClient, value, language),
        searchOrderBy: (path: string, orderBy?: any, fitlers?: any, attributes?: any) => searchOrderBy(apiClient, path, orderBy, fitlers, attributes),
        searchOrderByPriceRange: (path: string) => searchOrderByPriceRange(apiClient, path),
        searchFilteredByPriceRange: (path: string, min: string, max: string) =>
            searchFilteredByPriceRange(apiClient, path, min, max),
        searchByTopic: (value: string) => searchByTopic(apiClient, value, language),
    };
};
