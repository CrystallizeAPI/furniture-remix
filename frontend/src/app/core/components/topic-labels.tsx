import { Link } from '@remix-run/react';

export const TopicLabels = ({ labels }: { labels: any }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {labels.map((label: any) => (
                <Link to={label.path} key={label.name}>
                    <div className="rounded-md border-2 px-3 py-1">
                        <p className="font-labelText">{label.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};
