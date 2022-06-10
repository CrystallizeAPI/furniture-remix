import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';
import { TileViewComponentProps } from '~/lib/grid-tile/types';

export const Banner: React.FC<TileViewComponentProps> = ({ tile, options, cell }) => {
    const { title, description, ctas, isFullWidth, content } = tile;
    const { images } = content;
    console.log({ options });
    return (
        <div
            style={{
                gridColumn: isFullWidth ? '1 / span 5' : '2 / span 3',
            }}
        >
            <div className={`pl-20 flex container 2xl mx-auto  ${isFullWidth ? 'items-center' : 'pt-20'}`}>
                <div className="items-center flex-column pr-8 justify-items-center	w-4/12">
                    {title && (
                        <h1 className={`${title.length < 10 ? 'text-9xl' : 'text-3xl'} font-bold mb-3`}>{title}</h1>
                    )}
                    {description && <p className={`mt-5 mb-5 leading-[1.6em]`}>{description}</p>}
                    {ctas &&
                        ctas.map((cta) => (
                            <button className="bg-ctaBlue px-8 py-4 rounded font-medium" key={cta.link}>
                                <Link to={cta.link} prefetch="intent">
                                    {cta.text}
                                </Link>
                            </button>
                        ))}
                </div>
                {images && images.length > 0 && (
                    <div className="self-end w-8/12 img-container">
                        <Image
                            {...images[0]}
                            sizes="(max-width: 500px) 300px, 700px"
                            loading="lazy"
                            className="max-w-none w-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
