import { Document } from '../components/item/document';
import { CategoryWithChildren } from '~/use-cases/contracts/Category';
import { Product } from '../components/item/product';

export default ({ folder }: { folder: CategoryWithChildren }) => {
    return (
        <div className="container 2xl md:px-6 mx-auto w-full p-10">
            <h1 className="text-6xl font-bold mt-10 mb-4">{folder.title}</h1>
            <div className="flex gap-5">{folder.description}</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10 grid-flow-row flex flex-wrap">
                {folder.children.map((child) => {
                    // kind of a hack here as know that ProductSlim does not have a type
                    if ('type' in child) {
                        return <Document item={child} key={child.name} />;
                    }
                    return <Product item={child} key={child.name} />;
                })}
            </div>
        </div>
    );
};
