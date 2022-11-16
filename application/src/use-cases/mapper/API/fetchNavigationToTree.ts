import { Tree } from '../../contracts/Tree';

export const recursiveMap = (level: any, defaultType: string): Tree => {
    return {
        id: level.id,
        name: level.name,
        path: level.path,
        type: level.__typename ?? defaultType,
        children: level.children?.map((child: any) => recursiveMap(child, defaultType)) ?? [],
    };
};

export default (
    navigation: any,
): {
    folders: Tree[];
    topics: Tree[];
} => {
    return {
        folders: navigation.folders.tree.children.map((tree: any) => recursiveMap(tree, 'folder')),
        topics: navigation.topics.tree.map((tree: any) => recursiveMap(tree, '_topic')),
    };
};
