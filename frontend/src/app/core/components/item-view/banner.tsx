import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';

export const Banner = ({ layout, item }: { layout: any; item: any }) => {
    let components = item?.components;
    let title = components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = components?.find((component: any) => component.type === 'richText')?.content?.plainText?.[0];
    let image = components?.find((component: any) => component.id === 'media')?.content?.selectedComponent?.content
        ?.images?.[0];
    console.log({ components });
    let cta = components?.find((component: any) => component.id === 'cta')?.content?.chunks?.[0];
    let color = `#${
        components?.find((component: any) => component.id === 'background')?.content?.selectedComponent?.content?.text
    }`;
    let isFullWidth = components?.find((component: any) => component.id === 'fullwidth-tile')?.content?.value;

    return (
        <>
            <div className={`pl-20 flex container 2xl mx-auto  ${isFullWidth ? 'items-center' : 'pt-20'}`}>
                <div className="items-center flex-column pr-8 justify-items-center	w-4/12">
                    <h1 className={`${title.length < 10 ? 'text-9xl' : 'text-3xl'} font-bold mb-3`}>{title}</h1>
                    <p className={`mt-5 mb-5 leading-[1.6em]`}>{description}</p>
                    {cta ? (
                        <button className="bg-ctaBlue px-8 py-4 rounded font-medium">
                            <Link to={cta?.[0]?.content?.text} prefetch="intent">
                                {cta[1]?.content?.text}
                            </Link>
                        </button>
                    ) : null}
                </div>
                <div className="self-end w-8/12 img-container">
                    <Image {...image} sizes="100w" className="max-w-none w-full" />
                </div>
            </div>
        </>
    );
};
