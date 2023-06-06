'use client';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import { TileViewComponentProps } from '../../../lib/grid-tile/types';
import { ProductFromCell } from '../../item/product';
import { DocumentFromCell } from '../../item/document';
import { LinkRenderer } from '../../../lib/grid-tile/linkRenderer';
import { ContentTransformer } from '@crystallize/reactjs-components';

const itemMapping = {
    product: ProductFromCell,
    document: DocumentFromCell,
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
        <div className={`${isFullWidth ? 'px-8 lg:px-10 max-w-[1650px] w-full mx-auto' : 'w-full'}`}>
            <div className={`pb-10  pt-20 ${setInnerPadding()}`}>
                {title && <h2 className={`${colspan > 2 ? 'text-3xl' : 'text-2xl'} mb-3 font-bold`}>{title}</h2>}
                {description && (
                    <div className={`embed-text ${colspan > 2 ? 'w-2/4' : 'w-5/5'}`}>
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

            <div className={setInnerPadding()}>
                <Splide
                    options={{
                        rewind: true,
                        perPage: spansOverAllColumns ? 5 : 2,
                        breakpoints: {
                            1200: {
                                perPage: 4,
                            },
                            940: {
                                perPage: 3,
                            },
                            480: {
                                perPage: 2,
                            },
                        },
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
