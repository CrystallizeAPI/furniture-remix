import { Product } from '~/core/components/item/product';

export const CategoryList = ({ category }: { category: any }) => {
    let title = category?.components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = category?.components?.find((component: any) => component.type === 'richText')?.content
        ?.plainText?.[0];

    return (
        <div className="my-10">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="w-3/5 mb-3 mt-2">{description}</p>
            <div className="grid grid-cols-5 gap-6">
                {category?.children?.map((child: any) => {
                    return <Product item={child} key={`${category.name}-${child.path}`} />;
                })}
            </div>
        </div>
    );
};

{
    /* <Link to={child.path} prefetch="intent" key={child.name}>
<div className="img-container rounded-md overflow-hidden">
    <Image {...child.defaultVariant.firstImage} sizes="300px" loading="lazy" />
</div>
<p className="mt-3 ">{child.name}</p>
<p className="font-bold">€{child.defaultVariant.price}</p>
</Link>
); */
}
