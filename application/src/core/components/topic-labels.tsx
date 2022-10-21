import { Link } from '@remix-run/react';
import { useAppContext } from '../app-context/provider';

export const TopicLabels = ({ labels }: { labels: any }) => {
    const { path } = useAppContext();
    return (
        <div className="flex flex-wrap gap-2">
            {labels.map((label: any) => (
                <Link to={path(label.path)} key={label.name}>
                    <div className="rounded-md bg-[#efefef] border border-[transparent] hover:border-[#000] px-3 py-1">
                        <p className="text-xs font-bold">{label.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};
