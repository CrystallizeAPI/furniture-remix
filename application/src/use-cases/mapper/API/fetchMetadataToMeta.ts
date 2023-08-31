import { SEO } from '../../contracts/SEO';
import { stringForRichTextComponentWithId, stringForSingleLineComponentWithId } from '../api-mappers';

export default (data: any): SEO => {
    const meta = data?.component?.content?.chunks?.[0];

    return {
        title: stringForSingleLineComponentWithId(meta, 'title') || '',
        description: stringForRichTextComponentWithId(meta, 'description') || '',
        image: meta?.find((c: any) => c.id === 'image')?.content?.firstImage?.url || '',
    };
};
