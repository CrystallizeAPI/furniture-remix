import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';
import { useAppContext } from '~/core/app-context/provider';
import { ItemViewComponentProps } from '~/lib/grid-tile/types';

export const CuratedProduct: React.FC<ItemViewComponentProps> = ({ item }) => {
    const { state: contextState, path } = useAppContext();
    const getComponentContent = (components: any, id: string) => {
        let component = components.find((component: any) => component.id === id);
        return component?.content || null;
    };
    const title = getComponentContent(item?.components, 'title')?.text;
    const description = getComponentContent(item?.components, 'description')?.plainText;
    const shoppableImage = getComponentContent(item?.components, 'shoppable-image')?.images?.[0];
    let merchandising = getComponentContent(item?.components, 'merchandising')?.chunks?.map((merch: any) => {
        return {
            products: getComponentContent(merch, 'products')?.items,
            hotspotX: getComponentContent(merch, 'hotspot-x'),
            hotspotY: getComponentContent(merch, 'hotspot-y'),
        };
    });

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
                <div className="img-container pl-10 w-full lg:col-span-3 self-start rounded-tl-lg relative">
                    <div className="absolute h-full w-full frntr-hotspot frntr-hotspot-microformat">
                        {merchandising.map((merch: any, i: number) => (
                            <span
                                key={`hotspot-${merch?.hotspotX?.number}-${merch?.hotspotY?.number}`}
                                style={{ left: merch?.hotspotX?.number + `%`, top: merch?.hotspotY?.number + '%' }}
                            >
                                <div className="rounded-sm shadow-sm px-2 pt-2 ">
                                    {merch.products?.map((product: any) => (
                                        <div className="flex items-center gap-2 pb-2" key={product.id}>
                                            <div className="img-container img-cover w-[30px] h-[40px]">
                                                <Image
                                                    {...product?.defaultVariant?.firstImage}
                                                    sizes="100px"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs">{product.name}</div>
                                                <div className="text-xs font-bold">
                                                    {contextState.currency.code} {product.defaultVariant.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </span>
                        ))}
                    </div>
                    <Image {...shoppableImage} sizes="50vw" />
                </div>
            </div>
        </Link>
    );
};
