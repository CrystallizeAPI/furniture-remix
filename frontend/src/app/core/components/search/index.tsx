import { useEffect, useRef, useState } from 'react';
import SearchIcon from '~/assets/searchIcon.svg';
import { DebounceInput } from 'react-debounce-input';
import { Link } from '@remix-run/react';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { useStoreFront } from '~/core/storefront/provider';

export const SearchBar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(true);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const { apiClient: client } = useStoreFront();

    //close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShow(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            setShow(true);
        };
    }, [ref]);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        try {
            setSuggestions(await CrystallizeAPI.search(client, value));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-grey w-80 relative rounded-full">
            <div className="flex items-center justify-between bg-grey h-10 rounded-full">
                <DebounceInput
                    minLength={2}
                    placeholder="Names, skus, categories"
                    debounceTimeout={300}
                    onChange={handleChange}
                    className="bg-grey focus:border-textBlack outline-none px-6 w-full rounded-full placeholder:text-[14px] placeholder:italic"
                />
                <Link
                    to={`/search?q=${searchTerm}`}
                    className="w-10 p-4 h-full text-[#fff] flex justify-center items-center rounded-full"
                >
                    <img src={`${SearchIcon}`} alt="search icon" width="15" height="15" />
                </Link>
            </div>
            {suggestions.length > 0 && show ? (
                <div
                    ref={ref}
                    className="absolute z-20 top-10 w-80 h-[200px] left-0 overflow-y-scroll shadow-sm bg-[#fff]"
                >
                    {suggestions.map((suggestion: any, index: number) => (
                        <div key={index}>
                            <Link
                                to={suggestion?.node?.path}
                                onClick={() => {
                                    setSuggestions([]);
                                }}
                                prefetch="intent"
                            >
                                <div className="p-4 bg-[#fff] hover:bg-grey2 text-md">{suggestion?.node?.name}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};
