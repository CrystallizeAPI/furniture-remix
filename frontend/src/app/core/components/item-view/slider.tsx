import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';

export const Slider = ({ layout, item }: { layout: any; item: any }) => {
    let colspan = layout?.colspan;
    let components = item?.components;
    let title = components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = components?.find((component: any) => component.type === 'richText')?.content?.plainText?.[0];
    let items = components?.find((component: any) => component.id === 'media')?.content?.selectedComponent?.content
        ?.items;
    let color = `#${
        components?.find((component: any) => component.id === 'background')?.content?.selectedComponent?.content?.text
    }`;
    let isFullWidth = components?.find((component: any) => component.id === 'fullwidth-tile')?.content?.value;

    return (
        <div className={`h-[470px] p-10 ${colspan === 3 ? 'mt-10 mb-40' : ''} `} style={{ background: color }}>
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className={`my-5 ${colspan === 3 ? 'w-3/4' : 'w-5/5'}`}>{description}</p>
            </div>

            <div className="">
                <Splide
                    options={{
                        rewind: true,
                        perPage: colspan === 3 ? 4 : 2,
                        pagination: false,
                        gap: '10px',
                    }}
                    className="splide"
                >
                    {items &&
                        items?.map((item: any) => {
                            return (
                                <SplideSlide key={item.name} className="slide">
                                    <Link to={item.path} prefetch="intent">
                                        <div className="flex flex-col gap-2">
                                            <Image {...item.defaultVariant.firstImage} sizes="100vw" />
                                            <p>${item.defaultVariant.price}</p>
                                            <p className="text-sm">{item.name}</p>
                                        </div>
                                    </Link>
                                </SplideSlide>
                            );
                        })}
                </Splide>
            </div>
        </div>
    );
};
