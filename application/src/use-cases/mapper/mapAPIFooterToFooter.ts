import { Footer } from '~/core/contracts/Footer';
import {
    chunksForChunkComponentWithId,
    stringForRichTextComponentWithId,
    stringForSingleLineComponentWithId,
} from '~/lib/api-mappers';
import typedImages from '~/use-cases/mapper/mapAPIImageToImage';

export default (data: any): Footer => {
    const socialLinks = chunksForChunkComponentWithId(data.components, 'social');
    const promotionCards = chunksForChunkComponentWithId(data.components, 'promotion-cards');

    const dto: any = {
        copyright: stringForSingleLineComponentWithId(data.components, 'copyright'),
        contact: data.components.find((c: any) => c.id === 'contact-information')?.content,
        links: data.components.find((c: any) => c.id === 'links')?.content,
        socialLinks: socialLinks?.map((socialLink: any) => {
            const logo = socialLink.find((c: any) => c.id === 'logo')?.content;
            return {
                logo: typedImages(logo.images),
                url: stringForSingleLineComponentWithId(socialLink, 'url'),
            };
        }),
        promotions: {
            heading: stringForSingleLineComponentWithId(data.components, 'promotion-section-heading'),
            cards: promotionCards?.map((card: any) => {
                const image = card.find((c: any) => c.id === 'image')?.content;
                return {
                    title: stringForSingleLineComponentWithId(card, 'title'),
                    link: stringForSingleLineComponentWithId(card, 'link'),
                    image: typedImages(image.images) || image.url,
                };
            }),
        },
    };

    return dto;
};
