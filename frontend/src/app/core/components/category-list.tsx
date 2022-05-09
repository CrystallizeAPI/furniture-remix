import { Image } from "@crystallize/reactjs-components/dist/image";

export const CategoryList = ({ category }: { category: any }) => {
  let title = category.components.find(
    (component: any) => component.type === "singleLine"
  )?.content?.text;
  let description = category.components.find(
    (component: any) => component.type === "richText"
  )?.content?.plainText?.[0];

  return (
    <div className="my-20">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="w-3/5 mb-5 mt-2">{description}</p>
      <div className="flex">
        {category?.children.map((child: any) => (
          <div
            className="flex-1"
            key={child.name}
          >
            <Image {...child.defaultVariant.firstImage} sizes="500px" />
            <p className="mt-3">${child.defaultVariant.price}</p>
            <p className="text-sm">{child.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
