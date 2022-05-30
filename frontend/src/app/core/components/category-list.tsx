import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';

export const CategoryList = ({ category }: { category: any }) => {
    let title = category?.components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = category?.components?.find((component: any) => component.type === 'richText')?.content
        ?.plainText?.[0];

    return (
        <div className="my-10">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="w-3/5 mb-3 mt-2">{description}</p>
            <div className="flex gap-10">
                {category?.children?.map((child: any) => (
                    <Link to={child.path} prefetch="intent" key={child.name}>
                        <div className="category-container">
                            <Image {...child.defaultVariant.firstImage} sizes="300px" />
                        </div>
                        <p className="mt-3 ">{child.name}</p>
                        <p className="font-bold">€{child.defaultVariant.price}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
