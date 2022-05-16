import { Image } from "@crystallize/reactjs-components/dist/image";

export const Embed = ({ cell }: { cell: any }) => {
  let embedItem = cell.item.components.find(
    (component: any) => component.id === "media"
  )?.content?.selectedComponent?.content?.items[0];

  let title = embedItem?.components.find(
    (component: any) => component.id === "title"
  )?.content?.text;

  let description = embedItem?.components.find(
    (component: any) => component.id === "description"
  )?.content?.plainText?.[0];

  let color = `#${
    cell.item?.components.find(
      (component: any) => component.id === "background"
    )?.content?.selectedComponent?.content?.text
  }`;

  let media = embedItem?.components.find(
    (component: any) => component.id === "media"
  )?.content?.selectedComponent?.content

  return (
    <div
      className="h-[470px] flex flex-col justify-between overflow-hidden"
      style={{ background: color }}
    >
      <div className="px-10 pt-10">
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="embed-text">{description}</p>
      </div>
      <div>
        <Image {...media?.firstImage} sizes="100vw" />
      </div>
    </div>
  );
};
