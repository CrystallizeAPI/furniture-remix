import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';
import { TileViewComponentProps } from '~/lib/grid-tile/types';
import { LinkRenderer } from '~/lib/linkRenderer';

export const Banner: React.FC<TileViewComponentProps> = ({ tile }) => {
    const { title, description, ctas, isFullWidth, content, styling } = tile;
    const { images } = content;
    const { font } = styling;
    return (
        <div
            className={` flex md:flex-row flex-col  w-full mx-auto  ${
                isFullWidth ? 'px-8 lg:px-10 max-w-[1600px] w-full items-center pt-10  md:py-0 ' : 'pl-10 pt-20'
            }`}
        >
            <div
                className={`${
                    !images?.length ? 'py-40' : isFullWidth ? 'md:w-1/2' : 'md:w-2/5'
                } items-center pr-8 flex-column relative z-10 `}
            >
                {title && (
                    <h1
                        className={`text-[1em] leading-[1.2em] font-bold mb-3`}
                        style={{ fontSize: font.size || '2rem' }}
                    >
                        {title}
                    </h1>
                )}
                {description && <p className={`mt-2 mb-5 max-w-[400px] leading-[1.6em]`}>{description}</p>}
                {ctas &&
                    ctas.map((cta) => (
                        <button className="bg-[#000] text-[#fff] px-8 py-4 rounded font-medium" key={cta.link}>
                            <LinkRenderer link={cta.link} text={cta.text} />
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
