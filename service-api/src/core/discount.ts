import { CartItem } from '@crystallize/node-service-api-request-handlers';

export type Discount = {
    treshold: number;
    pack: number;
    extra: number;
    identifier: string;
};

export type DiscountLot = {
    items: Record<string, TDItem>;
    appliedOn: Record<string, number>;
    discount: Discount;
};

export type TDItem = {
    price: number;
    sku: string;
    quantity: number;
};

export type Savings = Record<string, { quantity: number; amount: number }>;

const XforYRegexp = /^([0-9]){1,} for ([0-9]){1,}$/i;

const indexProductsPerDiscount = (items: CartItem[]): Record<string, TDItem[]> => {
    const candidates: Record<string, TDItem[]> = {};
    items.forEach((item) => {
        const discounts = (item.product.topics?.filter((topic) => topic.name.match(XforYRegexp)) || []).map(
            (topic) => topic.name,
        );
        discounts.forEach((discount) => {
            if (item.quantity > 0) {
                if (!candidates[discount]) {
                    candidates[discount] = [];
                }
                for (let i = 0; i < item.quantity; i++) {
                    candidates[discount].push({
                        price: item.variantPrice.price || 0,
                        sku: item.variant.sku,
                        quantity: 1,
                    });
                }
            }
        });
    });
    return candidates;
};

export const extractDisountLotFromItemsBasedOnXForYTopic = (cartItems: CartItem[]): DiscountLot[] => {
    let lots: DiscountLot[] = [];
    let lot = extractFirstDisountLotFromItemsBasedOnXForYTopic(cartItems);
    let remainingItems = cartItems;
    let memorySafety = 0;
    while (lot !== null && memorySafety < 100) {
        lots.push(lot);
        remainingItems = remainingItems.map((item: CartItem) => {
            if (lot!.appliedOn[item.variant.sku]) {
                return {
                    ...item,
                    quantity: Math.max(0, item.quantity - lot!.appliedOn[item.variant.sku]),
                };
            }
            return {
                ...item,
            };
        });
        lot = extractFirstDisountLotFromItemsBasedOnXForYTopic(remainingItems);
        memorySafety++;
    }
    if (memorySafety >= 100) {
        console.error('Memory safety triggered');
    }
    return lots;
};

export const extractFirstDisountLotFromItemsBasedOnXForYTopic = (cartItems: CartItem[]): DiscountLot | null => {
    const discountProductIndex = indexProductsPerDiscount(cartItems);
    // Parse, sort and remove non matching discounts
    const discounts: Discount[] = Object.keys(discountProductIndex)
        .map((discount: string) => {
            const results = XforYRegexp.exec(discount)!;
            return {
                treshold: parseInt(results[2]),
                pack: parseInt(results[1]),
                extra: parseInt(results[1]) - parseInt(results[2]),
                identifier: discount,
            };
        })
        .sort((a: Discount, b: Discount) => {
            return a.treshold - b.treshold;
        })
        .filter((discount) => discountProductIndex[discount.identifier].length >= discount.pack);

    if (discounts.length === 0) {
        return null;
    }
    // we actually want to run on 1 discount only
    const discount = discounts[0];
    const sortedProducts = discountProductIndex[discount.identifier].sort(
        (a: { price: number }, b: { price: number }) => a.price - b.price,
    );
    const discountedProducts = sortedProducts.slice(0, discount.extra);
    const discountedProductsAggregate = discountedProducts.reduce(
        (accumulator: Record<string, TDItem>, item: TDItem) => {
            accumulator[item.sku] = {
                ...item,
                quantity: (accumulator[item.sku]?.quantity || 0) + item.quantity,
            };
            return accumulator;
        },
        {},
    );
    const discountedProductLot = sortedProducts.slice(0, discount.pack);
    const discountedProductLotAggregate = discountedProductLot.reduce(
        (accumulator: Record<string, number>, item: TDItem) => {
            accumulator[item.sku] = (accumulator[item.sku] || 0) + item.quantity;
            return accumulator;
        },
        {},
    );
    return {
        appliedOn: discountedProductLotAggregate,
        items: discountedProductsAggregate,
        discount,
    };
};

export const groupSavingsPerSkus = (lots: DiscountLot[]): Savings => {
    return lots.reduce((accumulator: Savings, lot: DiscountLot) => {
        Object.keys(lot.items).forEach((sku: string) => {
            const item = lot.items[sku];
            accumulator[sku] = {
                quantity: (accumulator[sku]?.quantity || 0) + item.quantity,
                amount: (accumulator[sku]?.amount || 0) + item.price,
            };
        });
        return accumulator;
    }, {});
};
