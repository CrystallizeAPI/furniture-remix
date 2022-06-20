import { Product } from '~/core/components/item/product';

export const CategoryList = ({ category }: { category: any }) => {
    let title = category?.components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = category?.components?.find((component: any) => component.type === 'richText')?.content
        ?.plainText?.[0];

    return (
        <div className="my-10 w-max">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="w-3/5 mb-3 mt-2">{description}</p>
            <div className="gap-6 w-full flex">
                {category?.children?.slice(0, 5)?.map((child: any) => {
                    return <Product item={child} key={`${category.name}-${child.path}`} />;
                })}
            </div>
        </div>
    );
};
