import Link from '~/bridge/ui/Link';
import { useAppContext } from '../../app-context/provider';
import { Topic } from '../../../use-cases/contracts/Topic';

export const TopicLabels: React.FC<{ topics: Topic[] }> = ({ topics }) => {
    const { path } = useAppContext();
    return (
        <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
                <Link to={path(topic.path)} key={topic.name}>
                    <div className="rounded-md bg-[#efefef] border border-[transparent] hover:border-[#000] px-3 py-1">
                        <p className="text-xs font-bold">{topic.name}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};
