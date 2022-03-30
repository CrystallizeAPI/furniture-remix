import { z } from "zod";
import type { Image, Product, ProductVariant, ProductPriceVariant } from "@crystallize/js-api-client";

const cartItemRequest = z.object({
    sku: z.string(),
    quantity: z.number(),
});

export const cartRequest = z.object({
    locale: z.string(),
    withImages: z.boolean().optional(),
    items: z.array(cartItemRequest),
});

export type CartRequest = z.infer<typeof cartRequest>;
export type CartItemRequest = z.infer<typeof cartItemRequest>;

export interface Cart {
    cart: {
        items: CartItem[]
    }
    total: Price
}

export interface CartItem {
    quantity: number;
    price: Price;
    images?: Image[];
    product: Product;
    variant: ProductVariant;
    variantPrice: ProductPriceVariant;
}


export interface Price {
    gross: number;
    net: number;
    currency: string;
    taxAmount: number;
}

export type CartHydraterArguments = {
    extraQuery?: any,
    perProduct?: (item: string, index: number) => any,
    perVariant?: (item: string, index: number) => any
}
