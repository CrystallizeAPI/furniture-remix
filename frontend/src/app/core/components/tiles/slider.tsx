import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Link } from '@remix-run/react';
import { TileViewComponentProps } from '~/lib/grid-tile/types';
import { Product } from '../item/product';
import { Document } from '../item/document';

const itemMapping = {
    product: Product,
    document: Document,
};

export const Slider: React.FC<TileViewComponentProps> = ({ tile, options }) => {
    const { dimensions, layout } = options;
    let colspan = layout.colspan;
    const { title, description, content, ctas, styling } = tile;
    const spansOverAllColumns = layout.colspan === dimensions.cols;
    const hasBackgroundColor = styling?.background.color;
    const isFullWidth = tile.isFullWidth;
    const setInnerPadding = () => {
        if (!spansOverAllColumns) {
            return 'pl-10';
        }
        if (spansOverAllColumns && !isFullWidth && hasBackgroundColor) {
            return 'px-10';
        }
    };
    return (
        <div className={`${isFullWidth ? 'max-w-[1789px] w-full mx-auto px-[70px]' : 'w-full'}`}>
            <div className={`pb-10  pt-20 ${setInnerPadding()}`}>
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

            <div className={setInnerPadding()}>
                <Splide
                    options={{
                        rewind: true,
                        perPage: spansOverAllColumns ? 5 : 2,
                        pagination: false,
                        gap: 10,
                    }}
                    className="splide "
                >
                    {content.items &&
                        content.items.map((item: any) => {
                            const Component = itemMapping[item.type as keyof typeof itemMapping];
                            return (
                                <SplideSlide key={item.name} className="slide items-stretch pb-10">
                                    <Component item={item} />
                                </SplideSlide>
                            );
                        })}
                </Splide>
            </div>
        </div>
    );
};
