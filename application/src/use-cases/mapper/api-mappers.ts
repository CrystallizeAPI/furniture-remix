import { Image } from '@crystallize/js-api-client';

export function stringForSingleLineComponentWithId(components: any[], id: string): string | undefined {
    return components.find((component) => component.id === id)?.content?.text;
}

export function stringForRichTextComponentWithId(components: any[], id: string): string | undefined {
    return components?.find((component) => component.id === id)?.content?.plainText.join('\n');
}

type RichText = {
    json?: any;
    html?: string[];
    plainText?: string[];
};

export type Paragraph = {
    title?: {
        text?: string;
    };
    body?: RichText;
    images?: Image[];
    videos?: any[];
};

export function paragraphsForParagraphCollectionComponentWithId(
    components: any[],
    id: string,
): Paragraph[] | undefined {
    return components.find((component: any) => component.id === id)?.content?.paragraphs;
}

export type Section = {
    title?: string;
    properties: Record<string, string>;
};

export function sectionsForPropertyTableComponentWithId(components: any[], id: string): Section[] | undefined {
    const component = components.find((component: any) => component.id === id)?.content;
    if (!component) {
        return undefined;
    }
    return component.sections.map((section: any) => {
        return {
            title: section.title,
            properties: section.properties.reduce((memo: Record<string, string>, property: any) => {
                return {
                    ...memo,
                    [property.key]: property.value,
                };
            }, {}),
        };
    });
}

export type Chunk = {
    id?: string;
    type?: string;
    name?: string;
    content?: any;
};

export function chunksForChunkComponentWithId(components: any[], id: string): Chunk[][] | undefined {
    const component = components.find((component: any) => component.id === id)?.content;
    if (!component) {
        return undefined;
    }
    return component?.chunks.map((chunk: any) => {
        return chunk.map((data: any) => {
            return {
                id: data.id,
                name: data.name,
                content: data.content,
                type: data.type,
            };
        });
    });
}

export function itemsForItemRelationComponentWithId(components: any[], id: string): any[] | undefined {
    return components.find((component: any) => component.id === id)?.content?.items;
}

export function choiceComponentWithId(
    components: any[],
    id: string,
):
    | {
          id: string;
          content: any;
      }
    | undefined {
    const component = components.find((component: any) => component.id === id)?.content?.selectedComponent;
    if (!component) {
        return undefined;
    }

    return {
        id: component.id,
        content: component.content,
    };
}

export function numericValueForComponentWithId(components: any[], id: string): number | undefined {
    const component = components.find((component: any) => component.id === id)?.content?.number;

    return component;
}

export function flattenRichText(richText?: RichText): {
    html?: string;
    plainText?: string;
    json?: any;
} {
    return {
        plainText: richText?.plainText?.join(''),
        json: richText?.json,
        html: richText?.html?.join(''),
    };
}
