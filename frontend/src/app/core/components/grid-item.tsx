import { Banner } from "./banner";
import { Embed } from "./embed";
import { Slider } from "./slider";

export const GridItem = ({ cell }: { cell: any }) => {
  let view = cell.item.components.find(
    (component: any) => component.id === "view"
  )?.content?.options?.[0]?.value;

  return (
    <div>
      {view === "banner" && <Banner cell={cell} />}
      {view === "slider" && <Slider cell={cell} />}
      {view === "embed" && <Embed cell={cell} />}
    </div>
  );
};
