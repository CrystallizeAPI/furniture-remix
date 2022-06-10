export const DimensionsTable = ({ dimensions }: { dimensions: any }) => {
    return (
        <div className="my-20 lg:px-20 px-2">
            <h2 className="text-2xl font-bold">Dimensions</h2>
            <div>
                {dimensions?.map((dimension: any) => (
                    <div key={dimension?.id} className="flex justify-between mt-5 border-b pb-5 border-grey4">
                        <p className="font-bold">{dimension?.name}</p>
                        <p>
                            {dimension?.content?.number}
                            {dimension?.content?.unit}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
