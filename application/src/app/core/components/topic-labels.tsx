import { Link } from '@remix-run/react';

export const TopicLabels = ({ labels }: { labels: any }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {labels.map((label: any) => (
                <Link to={label.path} key={label.name}>
                    <div className="rounded-md bg-[#efefef] border border-[transparent] hover:border-[#000] px-3 py-1">
                        <p className="text-xs font-bold">{label.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};
