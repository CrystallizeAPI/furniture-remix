import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '~/assets/searchIcon.svg';
import { useSearchInput } from '~/core/hooks/useSearchInput';
import { DebounceInput } from 'react-debounce-input';

export const SearchBar = ({}) => {
    const { value, setValue, suggestions, setSuggestions, onChange } = useSearchInput('');
    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(true);

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

    return (
        <div className="bg-grey w-60 p-2 relative">
            <div className="flex gap-2">
                <img src={`${SearchIcon}`} />
                <DebounceInput
                    minLength={2}
                    debounceTimeout={300}
                    defaultValue={value}
                    onChange={onChange}
                    className="bg-grey focus:border-textBlack outline-none"
                />
            </div>
            {suggestions?.length > 0 && show ? (
                <div ref={ref} className="absolute top-10 w-60 h-[200px] left-0 overflow-y-scroll shadow-sm">
                    {suggestions?.map((suggestion: any, index: number) => (
                        <div key={index}>
                            <Link
                                to={suggestion?.node?.path}
                                onClick={() => {
                                    setValue('');
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
