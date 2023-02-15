import { CartItem } from '@crystallize/node-service-api-request-handlers';
import displayPriceFor, { DisplayPrice } from '~/use-cases/checkout/pricing';
import { Price as CrystallizePrice } from '../lib/pricing/pricing-component';
import { DataMapper } from '~/use-cases/mapper';
import { useAppContext } from '../app-context/provider';
import { ProductVariant } from '~/use-cases/contracts/ProductVariant';

export const DiscountedPrice: React.FC<{
    price: DisplayPrice;
    size?: string;
}> = ({ price, size = 'medium' }) => {
    const priceSize = {
        small: {
            default: 'text-md font-semibold',
            previous: 'line-through font-semibold pt-1 text-xs',
            discount: 'text-md font-semibold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-medium',
        },
        medium: {
            default: 'text-2xl font-bold',
            previous: 'line-through font-semibold pt-1 text-sm',
            discount: 'text-2xl font-bold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-bold',
        },
    };
    let {
        default: defaultPrice,
        discounted: discountPrice,
        percent: discountPercentage,
        currency,
        marketPrice,
    } = price;

    const { _t } = useAppContext();

    return (
        <div>
            {discountPrice && discountPrice < defaultPrice ? (
                <div className="flex flex-wrap  flex-col">
                    <div className={priceSize[size as keyof typeof priceSize].previous}>
                        <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className={priceSize[size as keyof typeof priceSize].discount}>
                            <CrystallizePrice currencyCode={currency.code}>{discountPrice}</CrystallizePrice>
                        </div>
                        <div className={priceSize[size as keyof typeof priceSize].percentage}>
                            -{discountPercentage}%
                        </div>
                    </div>
                    {marketPrice && marketPrice < defaultPrice && (
                        <p className={`${priceSize[size as keyof typeof priceSize].percentage} w-fit mt-2`}>
                            {_t('marketPriceLabel')}
                        </p>
                    )}
                </div>
            ) : (
                <div className="">
                    <CrystallizePrice
                        currencyCode={currency.code}
                        className={priceSize[size as keyof typeof priceSize].default}
                    >
                        {defaultPrice}
                    </CrystallizePrice>
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

export const CartItemPrice: React.FC<{
    item: CartItem;
    saving: any;
    size?: string;
}> = ({ item, saving, size = 'small' }) => {
    const mapper = DataMapper();
    const { state, _t } = useAppContext();
    return (
        <>
            <Price variant={mapper.API.Object.APIProductVariantToProductVariant(item.variant)} size={size} />
            <div>
                {_t('total')}:{' '}
                <CrystallizePrice currencyCode={state.currency.code}>{item.price.gross}</CrystallizePrice>
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
            </div>
        </>
    );
};
