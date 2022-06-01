import { Link } from '@remix-run/react';
import { Image } from '@crystallize/reactjs-components/dist/image';

export const RelatedDocument = ({ document }: { document: any }) => {
    let title = document.components.find((component: any) => component.name === 'Title')?.content?.text;
    let media = document.components.find((component: any) => component.name === 'Media')?.content?.selectedComponent
        ?.content;

    return (
        <div className="pb-5 img-cover-hover">
            <Link to={document.path} prefetch="intent">
                <div className="img-container img-cover rounded-md overflow-hidden">
                    <Image {...media?.images?.[0]} />
                </div>
                <h4 className="font-semibold mt-5">{title}</h4>
            </Link>
        </div>
    );
};
