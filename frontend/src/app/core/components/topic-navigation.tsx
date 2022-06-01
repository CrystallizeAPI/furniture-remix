import { createClient, createNavigationFetcher } from '@crystallize/js-api-client';
import { Link } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { useSuperFast } from 'src/lib/superfast/SuperFastProvider/Provider';

export const TopicNavigation = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { state: superFastState } = useSuperFast();
    const client = createClient({ tenantIdentifier: superFastState.config.tenantIdentifier });
    const [navigation, setNavigation] = useState<any>();
    const fetch = createNavigationFetcher(client).byTopics;

    let fetchTopics = async () => {
        const response = await fetch('/', 'en', 2);
        setNavigation(response);
        return response;
    };
    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <>
            {navigation?.tree?.map((topic: any) => (
                <span className="nav-anchor">
                    <span>{topic.name}</span> <span className="text-[0.6em] caret">▼</span>
                    <ul className="nav-dropdown">
                        {topic.children?.map((child: any) => (
                            <Link to={child.path} prefetch="intent">
                                <li className="hover:bg-grey text ">{child.name}</li>
                            </Link>
                        ))}
                    </ul>
                </span>
            ))}
        </>
    );
};
