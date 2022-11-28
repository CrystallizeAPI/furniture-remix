import { Footer } from '../../contracts/Footer';
import {
    chunksForChunkComponentWithId,
    flattenRichText,
    stringForSingleLineComponentWithId,
} from '../../mapper/api-mappers';
import { DataMapper } from '..';

export default (data: any): Footer => {
    const mapper = DataMapper();
    if (data === null) {
        return {
            copyright: '',
            contact: {
                plainText: '',
                html: '',
            },
            links: {
                plainText: '',
                html: '',
            },
            socialLinks: [],
            promotions: {
                heading: '',
                cards: [],
            },
        };
    }

    const socialLinks = chunksForChunkComponentWithId(data.components, 'social');
    const promotionCards = chunksForChunkComponentWithId(data.components, 'promotion-cards');

    const dto: Footer = {
        copyright: stringForSingleLineComponentWithId(data.components, 'copyright') || '',
        contact: flattenRichText(data.components.find((c: any) => c.id === 'contact-information')?.content),
        links: data.components.find((c: any) => c.id === 'links')?.content,
        socialLinks:
            socialLinks?.map((socialLink: any) => {
                const logo = socialLink.find((c: any) => c.id === 'logo')?.content;
                return {
                    logo: mapper.API.Object.APIImageToImage(logo.images),
                    link: stringForSingleLineComponentWithId(socialLink, 'link') || '',
                };
            }) || [],
        promotions: {
            heading: stringForSingleLineComponentWithId(data.components, 'promotion-section-heading') || '',
            cards:
                promotionCards?.map((card: any) => {
                    const image = card.find((c: any) => c.id === 'image')?.content;
                    return {
                        title: stringForSingleLineComponentWithId(card, 'title') || '',
                        link: stringForSingleLineComponentWithId(card, 'link') || '',
                        image: mapper.API.Object.APIImageToImage(image.images),
                    };
                }) || [],
        },
    };

    return dto;
};
