import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';
import { TileViewComponentProps } from '~/lib/grid-tile/types';

export const Banner: React.FC<TileViewComponentProps> = ({ tile }) => {
    const { title, description, ctas, isFullWidth, content, styling } = tile;
    const { images } = content;
    return (
        <div
            className={` flex md:flex-row flex-col  w-full mx-auto  ${
                isFullWidth ? 'container items-center px-10 pt-10  md:py-0 ' : 'pl-10 pt-20'
            }`}
        >
            <div
                className={`${
                    !images?.length ? 'py-20' : ''
                } items-center pr-8 flex-column md:w-4/12 w-full relative z-10`}
            >
                {title && (
                    <h1
                        className={`${title.length < 10 ? 'text-5xl sm:text-[7vw]' : 'text-3xl'} font-bold mb-3`}
                        style={{ fontSize: `${styling?.font.size}` }}
                    >
                        {title}
                    </h1>
                )}
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
                <div className="self-end md:w-8/12 w-full pt-10 img-container img-contain md:py-0">
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
