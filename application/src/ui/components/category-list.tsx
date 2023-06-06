'use client';

import { Product } from '../components/item/product';
import { ProductSlim } from '~/use-cases/contracts/Product';
import { Splide, SplideSlide } from '@splidejs/react-splide';

export const CategoryList: React.FC<{ products: ProductSlim[] }> = ({ products }) => {
    return (
        <div className="my-10 w-full">
            <div className="w-full">
                <Splide
                    options={{
                        rewind: true,
                        perPage: 5,
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
                    {products?.slice(0, 12)?.map((product) => {
                        return (
                            <SplideSlide key={`${product.name}-${product.path}`} className="slide items-stretch pb-10">
                                <Product item={product} />
                            </SplideSlide>
                        );
                    })}
                </Splide>
            </div>
        </div>
    );
};
