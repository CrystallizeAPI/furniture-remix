import { useEffect, useRef, useState } from 'react';
import SearchIcon from '~/assets/searchIcon.svg';
import { DebounceInput } from 'react-debounce-input';
import { useSuperFast } from 'src/lib/superfast/SuperFastProvider/Provider';
import { createClient } from '@crystallize/js-api-client';
import { Link } from '@remix-run/react';
import { search } from '~/core/UseCases';

export const SearchBar = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(true);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const { state: superFastState } = useSuperFast();

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
        const client = createClient({ tenantIdentifier: superFastState.config.tenantIdentifier });
        try {
            setSuggestions(await search(client, value));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-grey w-60 p-2 relative">
            <div className="flex gap-2">
                <img src={`${SearchIcon}`} />
                <DebounceInput
                    minLength={2}
                    debounceTimeout={300}
                    onChange={handleChange}
                    className="bg-grey focus:border-textBlack outline-none"
                />
            </div>
            {suggestions.length > 0 && show ? (
                <div ref={ref} className="absolute top-10 w-60 h-[200px] left-0 overflow-y-scroll shadow-sm">
                    {suggestions?.map((suggestion: any, index: number) => (
                        <div key={index}>
                            <Link
                                to={suggestion?.node?.path}
                                onClick={() => {
                                    setSuggestions([]);
                                }}
                            >
                                <div className="p-4 bg-[#fff] hover:bg-grey2">{suggestion?.node?.name}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};
