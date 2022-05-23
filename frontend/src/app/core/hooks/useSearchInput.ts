import { useState } from 'react';

export const useSearchInput = (initialValue: string) => {
    const [value, setValue] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        try {
            const response = await fetch('https://api.crystallize.com/frntr/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
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
                    variables: {
                        searchTerm: value,
                    },
                }),
            });
            const data = await response.json();
            setSuggestions(data.data.search.edges);
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
