import { useEffect, useRef, useState } from 'react';
import SearchIcon from '~/assets/searchIcon.svg';
import { DebounceInput } from 'react-debounce-input';
import { Link } from '@remix-run/react';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { Image } from '@crystallize/reactjs-components';
import { useAppContext } from '~/core/app-context/provider';
import { createClient } from '@crystallize/js-api-client';

export const SearchBar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(true);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const { state: appContextState, path, _t } = useAppContext();
    const api = CrystallizeAPI({
        apiClient: createClient({ tenantIdentifier: appContextState.crystallize.tenantIdentifier }),
        language: appContextState.language,
    });

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
            setSuggestions(await api.search(value));
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code == 'Enter') {
            window.location.replace(path(`/search?q=${searchTerm}`));
        }
    };

    return (
        <div className="xl:w-[340px] md:px-4 relative 270px">
            <div className="relative z-30 flex items-center justify-between bg-grey h-10 rounded-full overflow-hidden focus-within:border">
                <DebounceInput
                    minLength={2}
                    placeholder={_t('search.placeholder')}
                    debounceTimeout={200}
                    onChange={handleChange}
                    className="bg-grey rounded-full overflow-hidden focus:border-textBlack outline-none px-6 w-full placeholder:text-[14px] placeholder:italic "
                    onKeyDown={handleKeyPress}
                />
                <Link
                    to={path(`/search?q=${searchTerm}`)}
                    className="w-10 p-4 h-full text-[#fff] flex justify-center items-center rounded-full"
                >
                    <img src={`${SearchIcon}`} alt="search icon" width="15" height="15" />
                </Link>
            </div>
            {suggestions.length > 0 && show ? (
                <div
                    ref={ref}
                    className="absolute rounded-xl bg-[#fff] -top-5 w-full pt-20 pb-2 border border-[#dfdfdf] left-0 overflow-y-scroll shadow-sm z-20"
                >
                    <div className="max-h-[400px] overflow-y-scroll">
                        {suggestions?.map((suggestion: any, index: number) => (
                            <div key={index}>
                                <Link
                                    to={path(suggestion?.node?.path)}
                                    onClick={() => {
                                        setSuggestions([]);
                                    }}
                                    prefetch="intent"
                                >
                                    <div className="py-1 px-4 bg-[#fff] flex gap-2 items-center hover:bg-grey2">
                                        <div className="w-[25px] h-[35px] img-container rounded-sm img-cover border border-[#dfdfdf]">
                                            <Image {...suggestion?.node?.matchingVariant?.images?.[0]} sizes="100px" />
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <span className="text-sm ">{suggestion?.node?.name}</span>
                                            <span className="text-sm font-bold">
                                                {appContextState.currency.code}{' '}
                                                {suggestion?.node?.matchingVariant?.price}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
