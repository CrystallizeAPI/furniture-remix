import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Product } from '~/core/components/item/product';

export const CategoryList = ({ category }: { category: any }) => {
    let title = category?.components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = category?.components?.find((component: any) => component.type === 'richText')?.content
        ?.plainText?.[0];

    return (
        <div className="my-10 w-full">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="w-3/5 mb-3 mt-2">{description}</p>
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
                    {category?.children?.slice(0, 12)?.map((child: any) => {
                        return (
                            <SplideSlide key={`${category.name}-${child.path}`} className="slide items-stretch pb-10">
                                <Product item={child} />
                            </SplideSlide>
                        );
                    })}
                </Splide>
            </div>
        </div>
    );
};
