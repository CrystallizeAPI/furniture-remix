import { Item } from './Item';

export type Tree = Item & {
    id: string;
    type: string;
    children: Tree[];
};
