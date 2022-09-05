import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    productPage: {
        // flexDirection: 'row',
        fontFamily: 'Helvetica',
    },
    tablePage: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    image: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    title: {
        marginBottom: 15,
        fontWeight: 700,
        color: '#fff',
        fontSize: 24,
    },
    productDescriptionContainer: {
        width: '50%',
        position: 'absolute',
        right: '0%',
        top: '50%',
        padding: 25,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        backgroundColor: '#000',
    },
    productDescription: {
        color: '#fff',
        fontSize: 10,
        lineHeight: 1.5,
    },
    price: {
        color: '#fff',
        marginTop: 15,
        fontStyle: 'bold',
        borderRadius: 8,
        fontSize: 16,
        textAlign: 'left',
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
        padding: '10%',
    },
    tableRow: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#dfdfdf',
    },
    tableCell: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 4,
    },
    tableCellImage: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    tableCellName: {
        color: '#000',
        fontSize: 10,
        minWidth: '35%',
        paddingTop: 15,
        paddingBottom: 15,
        fontWeight: 900,
    },
    tableHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 10,
    },
    tableHeaderName: {
        fontSize: 8,
        color: '#333',
    },
});
