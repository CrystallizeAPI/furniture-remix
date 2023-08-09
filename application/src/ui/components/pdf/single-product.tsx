import { Document, Page, Text, Image, View, Link } from '@react-pdf/renderer';
import { styles } from './styles';
import { ContentTransformer, NodeContent } from '@crystallize/reactjs-components';
import displayPriceFor from '~/use-cases/checkout/pricing';
import { Price } from './shared';
import type { Product as ProductType } from '~/use-cases/contracts/Product';

const overrides = {
    link: (props: any) => (
        <Link src={props.metadata.href}>
            <NodeContent {...props} />
        </Link>
    ),

    div: (props: any) => (
        <View>
            <NodeContent {...props} />
        </View>
    ),
    span: (props: any) => (
        <View>
            <NodeContent {...props} />
        </View>
    ),
    paragraph: (props: any) => (
        <Text style={{ fontSize: 12 }}>
            <NodeContent {...props} />
        </Text>
    ),
    quote: (props: any) => (
        <Text style={{ fontSize: 16, padding: 15 }}>
            "<NodeContent {...props} />
            ""
        </Text>
    ),
    'line-break': (props: any) => (
        <Text style={{ fontSize: 16, width: '100%', display: 'block', height: 10 }}>
            <NodeContent {...props} />
        </Text>
    ),
};

export const SingleProduct: React.FC<{ product: ProductType }> = ({ product }) => {
    const primaryVariant = product.defaultVariant;
    let description = primaryVariant.description || product.description;
    const currency = primaryVariant.priceVariants.default.currency;
    const price = displayPriceFor(
        primaryVariant,
        {
            default: 'default',
            discounted: 'sales',
        },
        currency.code,
    );

    return (
        <Document>
            <Page style={styles.productPage}>
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        borderRadius: 6,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: '#dfdfdf',
                        overflow: 'hidden',
                    }}
                >
                    <Image style={styles.image} src={product.defaultVariant.images[0].url} />
                </View>
                <View style={styles.productDescriptionContainer}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.productDescription}>
                        {!!description?.length &&
                            (description?.length < 152 ? description : `${description?.slice(0, 152)} ...`)}
                    </Text>

                    <Text style={styles.price}>
                        <Price currencyCode={currency.code}>{price.default}</Price>
                    </Text>
                </View>
            </Page>

            {product.story &&
                product.story.map((paragraph, storyIndex) => {
                    const images = paragraph.images;
                    return (
                        <Page style={{ height: '100%' }} key={`story-paragraph-#${storyIndex}`}>
                            <View style={{ flexDirection: 'row', height: '100%' }}>
                                {images && (
                                    <View
                                        style={{
                                            minWidth: '50%',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {images?.map((img, imgIndex) => (
                                            <Image
                                                key={`story-paragraph-#${storyIndex}-image-#${imgIndex}-${img.url}`}
                                                src={img.url}
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    maxHeight: `${100 / images.length}%`,
                                                    overflow: 'hidden',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ))}
                                    </View>
                                )}

                                <View style={{ padding: images ? 35 : 100, width: '100%' }}>
                                    <Text style={{ fontSize: 18, marginBottom: 15 }}>{paragraph.title}</Text>
                                    <Text style={{ fontSize: 14, lineHeight: 1.6 }}>
                                        <ContentTransformer json={paragraph.body?.json} overrides={overrides} />
                                    </Text>
                                </View>
                            </View>
                        </Page>
                    );
                })}
            <Page style={styles.tablePage}>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text
                            style={{
                                ...styles.tableHeaderName,
                                minWidth: '43%',
                                paddingLeft: 40,
                            }}
                        >
                            Name
                        </Text>
                        {Object.keys(product.defaultVariant.attributes).map((key) => (
                            <Text
                                key={`variants-attribute-header-${key}`}
                                style={{ ...styles.tableHeaderName, width: '20%' }}
                            >
                                {product.defaultVariant.attributes[key]}
                            </Text>
                        ))}
                        <Text
                            style={{
                                ...styles.tableHeaderName,
                                paddingLeft: '5%',
                            }}
                        >
                            Price
                        </Text>
                        <Text></Text>
                    </View>
                    {product.variants.map((variant, i) => {
                        const variantPrice = displayPriceFor(
                            variant,
                            {
                                default: 'default',
                                discounted: 'sales',
                            },
                            currency.code,
                        );

                        return (
                            <View
                                key={i}
                                style={{
                                    ...styles.tableRow,
                                    backgroundColor: `${i % 2 ? 'transparent' : '#f7f7f7'}`,
                                }}
                            >
                                <Image style={styles.tableCellImage} src={variant?.images![0]?.url} />
                                <View
                                    style={{
                                        ...styles.tableCellName,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Text style={{ fontSize: 8, display: 'block' }}>{variant?.name}</Text>
                                    <Text style={{ fontSize: 8, display: 'block' }}>{variant?.sku}</Text>
                                </View>

                                {Object.keys(variant.attributes).map((key) => (
                                    <Text
                                        key={`attribute-value-${variant.sku}-${key}`}
                                        style={{ fontSize: 10, color: '#000', width: '20%' }}
                                    >
                                        {variant.attributes[key]}
                                    </Text>
                                ))}

                                <View
                                    style={{
                                        marginTop: 5,
                                        width: '30%',
                                        textAlign: 'right',
                                        marginRight: 10,
                                    }}
                                >
                                    {variantPrice.discounted && variantPrice.discounted < variantPrice.default ? (
                                        <View>
                                            <Text style={{ fontSize: 10, fontWeight: 600 }}>
                                                <Price currencyCode={variantPrice.currency.code}>
                                                    {variantPrice.discounted}
                                                </Price>
                                            </Text>
                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 8,
                                                        textDecoration: 'line-through',
                                                    }}
                                                >
                                                    <Price currencyCode={variantPrice.currency.code}>
                                                        {variantPrice.default}
                                                    </Price>
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={{ fontSize: 10, fontWeight: 600 }}>
                                            <Price currencyCode={variantPrice.currency.code}>
                                                {variantPrice.default}
                                            </Price>
                                        </Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
};
