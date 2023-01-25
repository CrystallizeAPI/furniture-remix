import { Image } from '@crystallize/reactjs-components';
import Link from '~/bridge/ui/Link';
import { useAppContext } from '../../app-context/provider';
import { CuratedStorySlim } from '~/use-cases/contracts/Story';

export const CuratedProduct: React.FC<{ item: CuratedStorySlim }> = ({ item }) => {
    const { state: contextState, path } = useAppContext();

    const title = item.title;
    const description = item.description.plainText;
    const shoppableImage = item.medias.images?.[0];
    let merchandising = item.merchandising;

    return (
        <Link
            to={path(item.path)}
            prefetch="intent"
            className="grid min-h-[100%] w-full bg-[#F5F5F5] relative rounded-md border border-[#f5f5f5] hover:border-[#000]"
        >
            <div className="flex flex-col justify-between items-stretch h-full w-full">
                <div className="px-10 pt-20 pb-6 ">
                    {title && <h2 className="text-2xl font-bold mb-3">{title}</h2>}
                    {description && <p className="embed-text">{description}</p>}
                </div>
                <div className="img-container w-full lg:col-span-3 self-start rounded-tl-lg relative">
                    <div className="absolute h-full w-full frntr-hotspot frntr-hotspot-microformat">
                        {merchandising.map((merch, i) => (
                            <span
                                key={`hotspot-${merch.x}-${merch.y}`}
                                style={{ left: merch.x + `%`, top: merch.y + '%' }}
                            >
                                <div className="rounded-sm shadow-sm px-2 pt-2 ">
                                    {merch.products.map((product) => (
                                        <div className="flex items-center gap-2 pb-2" key={product.id}>
                                            <div className="img-container img-cover w-[30px] h-[40px]">
                                                <Image
                                                    {...product.variant.images?.[0]}
                                                    sizes="100px"
                                                    loading="lazy"
                                                    fallbackAlt={product.name}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs">{product.name}</div>
                                                <div className="text-xs font-bold">
                                                    {contextState.currency.code}{' '}
                                                    {product.variant.priceVariants.default.value}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </span>
                        ))}
                    </div>
                    <Image {...shoppableImage} sizes="50vw" fallbackAlt={title} />
                </div>
            </div>
        </Link>
    );
};
