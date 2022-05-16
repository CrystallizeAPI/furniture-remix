export const RelatedDocument = ({ document }: { document: any }) => {
    let title = document.components.find((component: any) => component.name === 'Title')?.content?.text;
    let media = document.components.find((component: any) => component.name === 'Media')?.content?.selectedComponent
        ?.content;

    return (
        <div className="w-[300px] shadow-md pb-5">
            <div>
                <img src={media?.images?.[0]?.variants?.[8]?.url} />
            </div>
            <h4 className="text-center font-semibold mt-5">{title}</h4>
        </div>
    );
};
