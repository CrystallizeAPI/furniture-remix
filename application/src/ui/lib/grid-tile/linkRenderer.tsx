import Link from '~/bridge/ui/Link';

export const LinkRenderer: React.FC<{
    link: string;
    text: string;
}> = ({ link, text }) => {
    return link.startsWith('http') ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    ) : (
        <Link to={link}>{text}</Link>
    );
};
