import { createClient, createNavigationFetcher } from '@crystallize/js-api-client';
import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { useSuperFast } from 'src/lib/superfast/SuperFastProvider/Provider';
import HamburgerIcon from '~/assets/hamburgerIcon.svg';
import CloseIcon from '~/assets/closeIcon.svg';

export const TopicNavigation = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { state: superFastState } = useSuperFast();
    const client = createClient({ tenantIdentifier: superFastState.config.tenantIdentifier });
    const [navigation, setNavigation] = useState<any>();
    const fetch = createNavigationFetcher(client).byTopics;
    const [showNavigation, setShowNaviagtion] = useState(false);

    let fetchTopics = async () => {
        const response = await fetch('/', 'en', 2);
        setNavigation(response);
        return response;
    };

    //close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowNaviagtion(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            setShowNaviagtion(true);
        };
    }, [ref]);

    useEffect(() => {
        fetchTopics();
    }, []);

    function handleClick() {
        setShowNaviagtion(!showNavigation);
    }

    return (
        <div className="relative pl-2">
            <img
                src={`${HamburgerIcon}`}
                onClick={handleClick}
                className="hover:cursor-pointer"
                width="24"
                height="18"
                alt="Menu icon"
            />
            {showNavigation && (
                <div ref={ref} className="absolute w-80  p-5  bg-[#fff] shadow-sm -top-6 -right-5 rounded-md border">
                    <img
                        src={`${CloseIcon}`}
                        onClick={handleClick}
                        className="hover:cursor-pointer my-5 absolute right-5 top-0"
                    />
                    {navigation?.tree?.map((topic: any) => (
                        <div className="text mt-5">
                            <div className="font-bold">{topic.name}</div>
                            <div>
                                {topic.children?.map((child: any) => (
                                    <Link to={child.path} onClick={() => setShowNaviagtion(false)} prefetch="intent">
                                        <div className="mt-3 hover:bg-grey py-2">{child.name}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
