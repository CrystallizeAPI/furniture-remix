import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';
import { TileViewComponentProps } from '~/lib/grid-tile/types';

export const Slider: React.FC<TileViewComponentProps> = ({ tile, options }) => {
    console.log(tile);
    let colspan = options?.colspan;
    const { title, description, content, ctas, styling } = tile;
    return (
        <>
            <div className={`${styling?.background.color ? 'px-20 pt-20 h-1/3' : 'px-0 pt-20'}`}>
                {title && <h2 className={`${colspan > 2 ? 'text-3xl' : 'text-2xl'} mb-3 font-bold`}>{title}</h2>}
                {description && <p className={`embed-text ${colspan > 2 ? 'w-2/4' : 'w-5/5'}`}>{description}</p>}
                {ctas &&
                    ctas.map((cta) => (
                        <button className="bg-ctaBlue px-8 py-4 rounded font-medium" key={cta.link}>
                            <Link to={cta.link} prefetch="intent">
                                {cta.text}
                            </Link>
                        </button>
                    ))}
            </div>

            <div className={`${colspan > 2 ? 'pt-10' : 'px-10'}`}>
                <Splide
                    options={{
                        rewind: true,
                        perPage: colspan >= 3 ? 4 : 2,
                        pagination: false,
                        gap: 10,
                    }}
                    className="splide "
                >
                    {content.items &&
                        content.items.map((item: any) => {
                            return (
                                <SplideSlide key={item.name} className="slide ">
                                    <Link to={item.path} prefetch="intent">
                                        <div className="flex flex-col gap-0">
                                            <div className="max-w-full img-container img-cover rounded-lg overflow-hidden">
                                                <Image
                                                    {...item.defaultVariant.firstImage}
                                                    sizes="200px"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <p className="font-bold leading-1 mb-0 p-0">${item.defaultVariant.price}</p>
                                            <p className="text-sm leading-1">{item.name}</p>
                                        </div>
                                    </Link>
                                </SplideSlide>
                            );
                        })}
                </Splide>
            </div>
        </>
    );
};
