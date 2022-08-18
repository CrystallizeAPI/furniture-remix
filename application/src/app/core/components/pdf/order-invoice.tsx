import { Document, Page, Text, Image, StyleSheet, View, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        lineHeight: 1.5,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    tablePage: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    image: {
        height: '70px',
        width: '70px',
    },
    title: {
        marginBottom: 15,
        fontWeight: 'bold',
        color: '#434343',
        fontSize: 20,
    },
    productDescription: {
        color: '#373567',
        width: '60%',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: '140%',
    },

    productName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    productPrice: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    table: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingTop: 80,
    },
    tableRow: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#434343',
        borderBottomWidth: 1,
        borderBottomColor: '#434343',
    },
    tableCell: {
        flexDirection: 'row',
    },
    tableCellImage: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    tableCellName: {
        color: '#434343',
        fontSize: 12,
        minWidth: '35%',
        paddingTop: 15,
        paddingBottom: 15,
    },
    tableHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 10,
    },
    tableHeaderName: {
        fontSize: 12,
        color: '#434343',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: '80px',
        paddingTop: 10,
    },
    address: {
        textAlign: 'right',
        fontSize: 12,
        color: '#434343',
    },
    lineContainer: {
        borderBottom: '1px solid black',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        width: '50%',
        paddingBottom: 10,
    },
    infoFields: {
        color: '#7D7D7D',
        fontWeight: 'bold',
    },
    infoDetails: {
        color: '#434343',
    },
    totals: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: 20,
        fontWeight: 'bold',
        paddingRight: 30,
    },
    priceInfo: {
        width: '200px',
    },
});

export const Invoice = (data: any) => {
    let order = data.data;
    const date = new Date(order.createdAt);
    let creationDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: order.total.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.lineContainer}>
                    <Text style={styles.title}>Receipt</Text>
                </View>
                <View style={styles.lineContainer}>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoFields}>
                            <Text>Order Number:</Text>
                            <Text>Date of Issue:</Text>
                            <Text>Due Date:</Text>
                            <Text>Email:</Text>
                        </View>
                        <View style={styles.infoDetails}>
                            <Text>{order.id}</Text>
                            <Text>{creationDate}</Text>
                            <Text>{creationDate}</Text>
                            <Text>{order?.customer?.identifier}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text
                            style={{
                                ...styles.tableHeaderName,
                                minWidth: '40%',
                            }}
                        >
                            Name
                        </Text>

                        <Text style={{ ...styles.tableHeaderName, width: '38%' }}>Quantity</Text>

                        <Text
                            style={{
                                ...styles.tableHeaderName,
                                paddingLeft: '5%',
                            }}
                        >
                            Price
                        </Text>
                    </View>
                    {order?.cart?.map((item: any, index: number) => (
                        <View
                            key={index}
                            style={{
                                ...styles.tableRow,
                                backgroundColor: `${index % 2 ? 'transparent' : '#fff'}`,
                            }}
                        >
                            <Text style={{ width: '40%' }}>{item?.name}</Text>

                            <Text style={{ width: '40%' }}>{item?.quantity}</Text>

                            <Text
                                style={{
                                    marginTop: 0,
                                    padding: 5,
                                    marginLeft: '3%',
                                }}
                            >
                                {formatter.format(item.price?.gross)}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={{ width: '100%' }}>
                    <View style={styles.totals}>
                        <View style={styles.priceInfo}>
                            <Text>Tax ({order.total.tax.percent}%)</Text>
                            <Text style={{ marginTop: 5 }}>Total:</Text>
                        </View>
                        <View>
                            <Text>{formatter.format(order.total.gross - order.total.net)}</Text>
                            <Text style={{ marginTop: 5 }}>{formatter.format(order.total.gross)}</Text>
                        </View>
                    </View>
                </View>
                <Text style={{ marginTop: 200, textAlign: 'center' }}>Thank you for your purchase!</Text>
            </Page>
        </Document>
    );
};
