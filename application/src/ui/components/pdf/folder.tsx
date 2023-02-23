import { Document, Page, Text, Image, View } from '@react-pdf/renderer';
import { styles } from './styles';
import displayPriceFor from '~/use-cases/checkout/pricing';
import { Price } from './shared';
import { Category } from '~/use-cases/contracts/Category';
import { ProductSlim } from '~/use-cases/contracts/Product';

export const Folder: React.FC<{ category: Category; products: ProductSlim[] }> = ({ category, products }) => {
    return (
        <Document>
            <Page style={{ ...styles.productPage, alignItems: 'center', justifyContent: 'center' }}>
                <View
                    style={{
                        backgroundColor: '#000',
                        borderRadius: 2,
                        maxWidth: '50%',
                        padding: 35,
                    }}
                >
                    <Text style={{ color: '#fff', marginBottom: 15 }}>{category.title}</Text>
                    <Text style={{ color: '#fff', fontSize: 12, lineHeight: 1.4 }}>{category.description}</Text>
                </View>
            </Page>
            <Page style={{ ...styles.productPage }}>
                <View
                    style={{
                        flexWrap: 'wrap',
                        paddingVertical: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#dfdfdf',
                        borderStyle: 'solid',
                    }}
                >
                    {products.map((product, index) => {
                        if (!product) return null;
                        const variant = product.variant;
                        const name = variant.name;
                        const image = variant.images?.[0]?.url;
                        const sku = variant.sku;
                        const defaultPriceCurrency = variant.priceVariants.default.currency;

                        const price = displayPriceFor(
                            variant,
                            {
                                default: 'default',
                                discounted: 'sales',
                            },
                            defaultPriceCurrency.code,
                        );

                        return (
                            <View
                                wrap={false}
                                key={`${sku}`}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    padding: 10,
                                    paddingHorizontal: 20,

                                    overflow: 'hidden',
                                    flexDirection: 'row',
                                    borderTopWidth: 1,
                                    borderColor: '#dfdfdf',
                                    borderStyle: 'solid',
                                    backgroundColor: `${index % 2 ? '#f7f7f7' : 'transparent'}`,
                                }}
                            >
                                <View
                                    style={{
                                        borderRadius: 4,
                                        minWidth: '102px',
                                        maxWidth: '102px',
                                        height: '135px',
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                        borderWidth: 1,
                                        borderColor: '#dfdfdf',
                                        borderStyle: 'solid',
                                    }}
                                >
                                    {image && (
                                        <Image
                                            src={image}
                                            style={{
                                                borderRadius: 4,
                                                minWidth: '100px',
                                                maxWidth: '100px',
                                                height: '125px',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    )}
                                </View>

                                <View
                                    style={{
                                        marginLeft: 20,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <View style={{ width: '70%' }}>
                                        <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>{name}</Text>
                                        <Text style={{ marginTop: 5, fontSize: 10 }}>{sku}</Text>
                                        <View style={{ flexDirection: 'column', marginTop: 10 }}>
                                            {Object.keys(variant.attributes).map((key) => (
                                                <Text key={`${sku}-${key}`} style={{ fontSize: 10, marginTop: 5 }}>
                                                    {key}: {variant.attributes[key]}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 5, width: '30%', textAlign: 'right' }}>
                                        {price.discounted && price.discounted < price.default ? (
                                            <View style={{ marginRight: 15 }}>
                                                <Text style={{ fontSize: 14, fontWeight: 600 }}>
                                                    <Price currencyCode={price.currency.code}>{price.discounted}</Price>
                                                </Text>
                                                <View>
                                                    <Text style={{ fontSize: 10, textDecoration: 'line-through' }}>
                                                        <Price currencyCode={price.currency.code}>
                                                            {price.default}
                                                        </Price>
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <Text style={{ fontSize: 14, fontWeight: 600 }}>
                                                <Price currencyCode={price.currency.code}>{price.default}</Price>
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
};
