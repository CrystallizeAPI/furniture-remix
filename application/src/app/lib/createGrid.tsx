export const createGrid = (items: any) => {
    return {
        rows: items?.map((item: any, index: number) => {
            return {
                columns: [
                    {
                        layout: {
                            rowspan: 1,
                            colspan: 3,
                            colIndex: 0,
                            rowIndex: index,
                        },
                        item: item,
                    },
                ],
            };
        }),
    };
};
