import { Link } from '@remix-run/react';
import { useAppContext } from '~/core/app-context/provider';

export const LinkRenderer: React.FC<{
    link: string;
    text: string;
}> = ({ link, text }) => {
    const { path } = useAppContext();
    return link.startsWith('http') ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    ) : (
        <Link to={path(link)} prefetch="intent">
            {text}
        </Link>
    );
};
