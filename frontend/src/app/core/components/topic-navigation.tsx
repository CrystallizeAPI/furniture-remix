import { Link } from '@remix-run/react';

export const TopicNavigation: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <>
            {navigation?.tree?.map((topic: any) => (
                <span className="nav-anchor" key={topic.path}>
                    <span>{topic.name}</span> <span className="text-[0.6em] caret">▼</span>
                    <ul className="nav-dropdown">
                        {topic.children?.map((child: any) => (
                            <Link to={child.path} prefetch="intent" key={child.path}>
                                <li className="hover:bg-grey text ">{child.name}</li>
                            </Link>
                        ))}
                    </ul>
                </span>
            ))}
        </>
    );
};
