import { ClientInterface } from '@crystallize/js-api-client';

const PATH_PREFIX = '/vouchers/';

const QUERY_GET_VOUCHER = `#graphql
query GET_VOUCHER($path: String!, $language: String!, $version: VersionLabel) {
  catalogue(language: $language, path: $path, version: $version) {
    id
    name
    value: component(id: "discount") {
      content {
        ... on ComponentChoiceContent {
            selectedComponent {
            id
            name
            content {
              ... on NumericContent {
                number
                unit
              }
            }
          }
        }
      }
    }
    expires: component(id: "expiry-date") {
      content {
        ... on DatetimeContent {
          datetime
        }
      }
    }
  }
}`;

export default async (apiClient: ClientInterface, language: string, version: string, code: string): Promise<any> => {
    const path = `${PATH_PREFIX}${code.toLowerCase()}`;
    const result = await apiClient.catalogueApi(QUERY_GET_VOUCHER, {
        path,
        language,
        version,
    });
    return result.catalogue;
};
