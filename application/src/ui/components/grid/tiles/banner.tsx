import { Image } from '@crystallize/reactjs-components';
import { TileViewComponentProps } from '../../../lib/grid-tile/types';
import { LinkRenderer } from '../../../lib/grid-tile/linkRenderer';
import { ContentTransformer, Video } from '@crystallize/reactjs-components';

export const Banner: React.FC<TileViewComponentProps> = ({ tile }) => {
    const { title, description, ctas, isFullWidth, content, styling } = tile;
    const { images, videos } = content;
    const { font, button } = styling || {};

    return (
        <div
            className={` flex md:flex-row flex-col  w-full mx-auto ${
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
                        className={`text-[1em] leading-[1em] font-bold mb-3`}
                        style={{ fontSize: font ? font.size : '2rem' }}
                    >
                        {title}
                    </h1>
                )}
                {description && (
                    <div className={`mt-2 mb-5 max-w-[400px] leading-[1.6em]`}>
                        <ContentTransformer json={description} />
                    </div>
                )}
                {ctas &&
                    ctas.map((cta) => (
                        <button
                            className="px-8 py-4 rounded font-medium mr-2 mb-8"
                            key={cta.text}
                            style={{
                                color: button?.color ? button.color : '#fff',
                                backgroundColor: button?.['background color'] ? button['background color'] : '#000',
                                fontSize: button?.['font size'] ? button['font size'] : '1rem',
                            }}
                        >
                            {cta.link ? <LinkRenderer link={cta.link} text={cta.text} /> : cta.text}
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
            {videos && videos.length > 0 && (
                <div className="md:w-8/12 w-full img-container img-contain md:py-0">
                    <Video {...videos[0]} thumbnailProps={{ sizes: '(max-width: 700px) 90vw, 700px' }} />
                </div>
            )}
        </div>
    );
};
