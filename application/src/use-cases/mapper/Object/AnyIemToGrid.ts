import { Grid } from '../../contracts/Grid';

export default (items: any[]): Grid => {
    if (items.length === 0) {
        return {
            id: '',
            rows: [],
        };
    }
    return {
        id: '',
        rows: items.map((item, index) => {
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
