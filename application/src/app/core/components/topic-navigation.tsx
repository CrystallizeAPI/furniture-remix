import { Link } from '@remix-run/react';

export const TopicNavigation: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <>
            {navigation?.tree?.map((topic: any) => {
                const numberOfTopics = topic.children.length;
                // console.log(columns);
                const calculateColumns = numberOfTopics / 8;
                const numberOfCols = calculateColumns <= 1 ? 1 : Math.round(calculateColumns);
                return (
                    <span className="nav-anchor " key={topic.path}>
                        <span className="text-lg lg:text-[16px] block hover:underline">{topic.name}</span>
                        <span className="hidden lg:flex text-[0.6em] caret">▼</span>
                        <ul className="nav-dropdown" style={{ gridTemplateColumns: `repeat(${numberOfCols}, 1fr)` }}>
                            {topic.children?.map((child: any) => (
                                <Link to={child.path} key={child.path}>
                                    <li className="hover:bg-grey text h-full text-sm w-full">{child.name}</li>
                                </Link>
                            ))}
                        </ul>
                    </span>
                );
            })}
        </>
    );
};
