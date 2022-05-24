import { createClient } from '@crystallize/js-api-client';
import { useState } from 'react';
import { useSuperFast } from 'src/lib/superfast/SuperFastProvider/Provider';

export const useSearchInput = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);
    const { state: superFastState } = useSuperFast();
    const client = createClient({ tenantIdentifier: superFastState.config.tenantIdentifier });

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('PLOP');
        setValue(event.target.value);
        try {
            const data = await client.searchApi(
                `
                    query Search ($searchTerm: String!){
                        search(language:"en", filter: { 
                            searchTerm: $searchTerm, 
                            type: PRODUCT, 
                            productVariants: { isDefault: true }}){
                          edges {
                            node {
                              name
                              path
                            }
                          }
                        }
                      }
            `,
                {
                    searchTerm: value,
                },
            );
            setSuggestions(data.search.edges);
        } catch (error) {
            console.error(error);
        }
    };

    return {
        value,
        setValue,
        suggestions,
        setSuggestions,
        onChange: handleChange,
    };
};
