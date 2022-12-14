import { Chunk } from '../../mapper/api-mappers';

export default (chunk?: Chunk[]) => {
    return !chunk
        ? {
              title: '',
          }
        : (chunk.reduce(
              (memo: Record<string, string>, data: any) => {
                  let value = undefined;
                  switch (data.type) {
                      case 'singleLine':
                          value = data.content?.text || '';
                          break;
                      case 'richText':
                          value = data.content?.plainText?.join(' ');
                          break;
                      case 'images':
                          value = data.content?.images?.[0]?.url;
                          if (!value) {
                              value = data.content?.firstImage?.url;
                          }
                          break;
                  }
                  return {
                      ...memo,
                      [data.id]: value,
                  };
              },
              {
                  title: '',
              },
          ) as { title: string });
};
