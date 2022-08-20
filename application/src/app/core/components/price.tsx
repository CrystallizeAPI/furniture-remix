import { ProductVariant } from '@crystallize/js-api-client';
import { CartItem } from '@crystallize/node-service-api-request-handlers';
import displayPriceFor, { DisplayPrice } from '~/lib/pricing/pricing';
import { Price as CrystallizePrice } from '~/lib/pricing/pricing-component';
import { useAppContext } from '../app-context/provider';

export const DiscountedPrice: React.FC<{ price: DisplayPrice; size?: string }> = ({ price, size = 'medium' }) => {
    const priceSize = {
        small: {
            default: 'text-md font-semibold',
            previous: 'line-through font-semibold pt-1 text-xs',
            discount: 'text-md font-semibold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-medium',
        },
        medium: {
            default: 'text-4xl font-bold',
            previous: 'line-through font-semibold pt-1 text-sm',
            discount: 'text-4xl font-bold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-bold',
        },
    };
    const { default: defaultPrice, discounted: discountPrice, percent: discountPercentage, currency } = price;

    return (
        <div>
            {discountPrice && (
                <div className="flex flex-wrap  flex-col">
                    <div className={priceSize[size as keyof typeof priceSize].previous}>
                        <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <div className={priceSize[size as keyof typeof priceSize].discount}>
                            <CrystallizePrice currencyCode={currency.code}>{discountPrice}</CrystallizePrice>
                        </div>
                        <div className={priceSize[size as keyof typeof priceSize].percentage}>
                            -{discountPercentage}%
                        </div>
                    </div>
                </div>
            )}
            {!discountPrice && (
                <div className={priceSize[size as keyof typeof priceSize].default}>
                    <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                </div>
            )}
        </div>
    );
};

export const Price: React.FC<{ variant: ProductVariant; size?: string }> = ({ variant, size = 'medium' }) => {
    const { state } = useAppContext();
    const price = displayPriceFor(
        variant,
        {
            default: 'default',
            discounted: 'sales',
        },
        state.currency.code,
    );
    return <DiscountedPrice price={price} size={size} />;
};

export const CartItemPrice: React.FC<{ item: CartItem; saving: any; size?: string }> = ({
    item,
    saving,
    size = 'small',
}) => {
    const { state } = useAppContext();
    return (
        <>
            <Price variant={item.variant} size={size} />
            <p>
                Total: <CrystallizePrice currencyCode={state.currency.code}>{item.price.gross}</CrystallizePrice>
                {saving && (
                    <>
                        <del className="text-red mx-2">
                            <CrystallizePrice currencyCode={state.currency.code}>
                                {item.price.net + saving.amount}
                            </CrystallizePrice>
                        </del>
                        <small>({saving.quantity} for free!)</small>
                    </>
                )}
            </p>
        </>
    );
};
