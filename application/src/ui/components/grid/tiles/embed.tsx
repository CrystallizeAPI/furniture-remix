import { Image } from '@crystallize/reactjs-components';
import { TileViewComponentProps } from '../../../lib/grid-tile/types';
import { LinkRenderer } from '../../../lib/grid-tile/linkRenderer';
import { useAppContext } from '../../../app-context/provider';
import Link from '~/bridge/ui/Link';
import { ContentTransformer } from '@crystallize/reactjs-components';

export const Embed: React.FC<TileViewComponentProps> = ({ tile }) => {
    const { path } = useAppContext();
    const { title, description, content, ctas } = tile;
    if (!content.items || content.items.length === 0) {
        return <p>Nothing has been embedded.</p>;
    }
    const firstItem = content.items[0];
    const firstItemImage = firstItem.components.find((component: any) => component.id === 'media')?.content
        ?.selectedComponent?.content;

    return (
        <Link to={path(firstItem.path)} prefetch="intent" className="grid min-h-[100%]">
            <div className="flex flex-col justify-between items-stretch h-full overflow-hidden w-full">
                <div className="px-10 pt-20 md:h-1/3 ">
                    {title && <h2 className="text-2xl font-bold mb-3">{title}</h2>}
                    {description && (
                        <div className="embed-text">
                            <ContentTransformer json={description} />
                        </div>
                    )}
                    {ctas &&
                        ctas.map((cta) => (
                            <button className="bg-ctaBlue px-8 py-4 rounded font-medium" key={cta.link}>
                                {cta.link ? <LinkRenderer link={cta.link} text={cta.text} /> : cta.text}
                            </button>
                        ))}
                </div>
                <div className="pl-10 pt-10 max-w-full h-full img-container overflow-hidden rounded-t-l-md img-cover grow">
                    <Image
                        {...firstItemImage?.firstImage}
                        sizes="300px"
                        loading="lazy"
                        className="overflow-hidden rounded-tl-md "
                    />
                </div>
            </div>
        </Link>
    );
};
