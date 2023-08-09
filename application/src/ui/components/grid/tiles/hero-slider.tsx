'use client';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import { TileViewComponentProps } from '../../../lib/grid-tile/types';
import { Image } from '@crystallize/reactjs-components';

export const HeroSlider: React.FC<TileViewComponentProps> = ({ tile }) => {
    const { content } = tile;

    return (
        <div className="w-full hero-slider">
            <Splide
                options={{
                    perPage: 1,
                    autoplay: true,
                    interval: 4000,
                    pagination: true,
                    arrows: false,
                    gap: 0,
                }}
            >
                {content.images &&
                    content.images.map((image: any) => {
                        return (
                            <SplideSlide key={image.url} className="slide">
                                <Image
                                    {...image}
                                    loading="eager"
                                    sizes="(max-width: 500px) 300px, 700px"
                                    className="h-[300px] sm:h-[400px] lg:h-[700px] [&>picture>img]:w-full [&>picture>img]:h-full [&>picture>img]:object-cover"
                                />
                            </SplideSlide>
                        );
                    })}
            </Splide>
        </div>
    );
};
