import { Cart, CartHydraterArguments, CartItem, CartRequest } from "./types";
import { CrystallizeHydraterBySkus } from "@crystallize/js-api-client";
import type { ProductVariant, Product } from "@crystallize/js-api-client";
import Koa from 'koa';

export const handleCartRequest = async (request: CartRequest, context: Koa.Context, args?: CartHydraterArguments): Promise<Cart> => {
    const skus = request.items.map(item => item.sku);

    const hydraterParameters = {
        skus,
        locale: request.locale,
        ...args
    };

    const response = await CrystallizeHydraterBySkus(
        hydraterParameters.skus,
        hydraterParameters.locale,
        hydraterParameters.extraQuery,
        hydraterParameters.perProduct,
        (item: string, index: number) => {
            return {
                ...(hydraterParameters.perVariant !== undefined ? hydraterParameters.perVariant(item, index) : {}),
                ...((request.withImages === undefined || request.withImages === false) ? {} : {
                    images: {
                        url: true,
                        variants: {
                            url: true,
                            width: true,
                            height: true
                        }
                    }
                })
            }
        }
    );

    const products: Product[] = skus.map((sku: string, index: number) => response[`product${index}`]).filter(product => !!product);

    let totals = {
        gross: 0,
        currency: "USD",
        net: 0,
        taxAmount: 0,
    }

    const items: CartItem[] = request.items.map((item) => {
        let selectedVariant: ProductVariant | undefined;

        const product: Product | undefined = products.find(product => {
            selectedVariant = product.variants.find((variant: Pick<ProductVariant, "sku">) => variant.sku === item.sku) as ProductVariant;
            return (selectedVariant !== undefined) ? product : undefined;
        });

        if (product === undefined) {
            throw new Error(`Could not find Product with sku ${item.sku}`);
        }

        if (selectedVariant === undefined) {
            throw new Error(`Could not find variant with sku ${item.sku}`);
        }

        const selectedPrice = selectedVariant.priceVariants[0];
        const selectedCurrency = selectedVariant.priceVariants[0].currency;
        const grossAmount = selectedPrice.price * item.quantity;
        const taxAmount = grossAmount * product.vatType.percent / 100;
        const netAmount = grossAmount + taxAmount;

        totals.taxAmount += taxAmount;
        totals.gross += grossAmount;
        totals.net += netAmount;
        totals.currency = selectedCurrency;

        return {
            quantity: item.quantity,
            price: {
                gross: grossAmount,
                net: netAmount,
                currency: selectedCurrency,
                taxAmount
            },
            variant: selectedVariant,
            variantPrice: selectedPrice,
            product,
        }
    });

    const cart: Cart = {
        total: totals,
        cart: {
            items: items
        }
    }
    return cart;
}
