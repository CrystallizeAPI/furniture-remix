import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';
import { TileViewComponentProps } from '~/lib/grid-tile/types';

export const Banner: React.FC<TileViewComponentProps> = ({ tile }) => {
    const { title, description, ctas, isFullWidth, content } = tile;
    const { images } = content;
    return (
        <div
            className={`pl-10 flex md:flex-row flex-col container 2xl w-full mx-auto  ${
                isFullWidth ? 'items-center' : 'pt-20'
            }`}
        >
            <div
                className={`${
                    !images?.length ? 'py-20' : ''
                } items-center flex-column pr-8 md:w-4/12 w-full relative z-10`}
            >
                {title && <h1 className={`${title.length < 16 ? 'text-9xl' : 'text-3xl'} font-bold mb-3`}>{title}</h1>}
                {description && <p className={`mt-5 mb-5 leading-[1.6em]`}>{description}</p>}
                {ctas &&
                    ctas.map((cta) => (
                        <button className="bg-[#000] text-[#fff] px-8 py-4 rounded font-medium" key={cta.link}>
                            <Link to={cta.link} prefetch="intent">
                                {cta.text}
                            </Link>
                        </button>
                    ))}
            </div>
            {images && images.length > 0 && (
                <div className="self-end md:w-8/12 w-full img-container img-contain">
                    <Image
                        {...images[0]}
                        sizes="(max-width: 500px) 300px, 700px"
                        loading="lazy"
                        className="max-w-none w-full"
                    />
                </div>
            )}
        </div>
    );
};
