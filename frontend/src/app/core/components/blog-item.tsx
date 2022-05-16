import { Link } from '@remix-run/react'
import { Image } from '@crystallize/reactjs-components/dist/image'

export const BlogItem = ({ item }: { item: any }) => {
    let title = item.components.find(
        (component: any) => component.id === 'title'
    )?.content?.text
    let description = item.components.find(
        (component: any) => component.id === 'description'
    )?.content?.plainText?.[0]
    let media = item?.components.find(
        (component: any) => component.id === 'media'
    )?.content?.selectedComponent?.content
    
    return (
        <div className="w-1/3 shadow-md rounded-lg overflow-hidden">
            <Link to={item.path}>
                <div className="document-media-container h-[250px] overflow-hidden">
                    <img src={media?.images?.[0]?.variants?.[8]?.url} />
                </div>
                <div className="px-10 pt-7 pb-10">
                    <h2 className="font-bold text-lg">{title}</h2>
                    <p className="embed-text text-sm">{description}</p>
                </div>
            </Link>
        </div>
    )
}
