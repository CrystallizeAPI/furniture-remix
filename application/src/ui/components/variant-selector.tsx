import { Image } from '@crystallize/reactjs-components';
import { ProductVariant } from '~/use-cases/contracts/ProductVariant';

function reduceAttributes(variants: ProductVariant[]) {
    return variants.reduce((acc: Record<string, string[]>, variant: ProductVariant) => {
        Object.keys(variant.attributes).forEach((key) => {
            const value = variant.attributes[key];
            if (!acc[key]) {
                acc[key] = [];
            }
            if (!acc[key].includes(value)) {
                acc[key].push(value);
            }
        });
        return acc;
    }, {});
}

function findMostSuitableVariant(variants: ProductVariant[], attributes: Record<string, string>) {
    return variants.find((variant) => {
        return Object.keys(attributes).every((key) => {
            return variant.attributes[key] === attributes[key];
        });
    });
}

export const VariantSelector: React.FC<{
    variants: ProductVariant[];
    selectedVariant: ProductVariant;
    onVariantChange: Function;
    renderingType: string;
}> = ({ variants, selectedVariant, onVariantChange, renderingType = 'default' }) => {
    const attributes = reduceAttributes(variants);

    function onAttributeSelect(key: string, value: string) {
        let variant = findMostSuitableVariant(variants, {
            ...selectedVariant.attributes,
            [key]: value,
        });

        if (!variant) {
            variant = variants.find((variant) =>
                Object.keys(variant.attributes).some((vkey) => vkey === key && variant.attributes[vkey] === value),
            );
        }

        if (!variant) {
            variant = variants.find((variant) => Object.keys(variant.attributes).some((vkey) => vkey === key));
        }
        onVariantChange(variant);
    }

    const renderingTypes = {
        default: (
            <div>
                {Object.keys(attributes).map((key) => {
                    const values = attributes[key];
                    return (
                        <div key={key} className="border-[#dfdfdf]">
                            <p className="mt-2 text-sm  font-semibold">{key}</p>
                            <div className="flex mb-5 flex-nowrap md:flex-wrap gap-2 overflow-x-scroll py-2 px-1">
                                {values.map((value) => {
                                    const mostSuitableVariant = findMostSuitableVariant(variants, {
                                        ...selectedVariant.attributes,
                                        [key]: value,
                                    });
                                    return (
                                        <button
                                            key={value}
                                            onClick={(e) => onAttributeSelect(key, value)}
                                            type="button"
                                            className="w-2/6 md:w-1/6 md:py-2 py-4 rounded-lg text-text flex flex-col items-center text-xs font-medium overflow-hidden variant-option"
                                            style={{
                                                opacity: !mostSuitableVariant ? 0.2 : 1,
                                                border:
                                                    value === selectedVariant.attributes[key]
                                                        ? '1px solid #000'
                                                        : '1px solid #efefef',
                                            }}
                                        >
                                            <div className="img-container p-3 w-[80px] img-contain">
                                                {mostSuitableVariant?.images?.[0] && (
                                                    <Image
                                                        {...mostSuitableVariant.images[0]}
                                                        sizes="100px"
                                                        fallbackAlt={mostSuitableVariant.name}
                                                    />
                                                )}
                                            </div>
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        ),
        dropdown: (
            <>
                {Object.keys(attributes).map((key) => {
                    const values = attributes[key];
                    return (
                        <label key={key} className="block">
                            <select
                                onChange={(e) => onAttributeSelect(key, e.target.value)}
                                className="py-2 min-w-full w-full px-4 bg-[#efefef] grow-0  text-sm rounded-md min-w-[150px] "
                            >
                                <optgroup label={key}>
                                    {values.map((value: any) => {
                                        const mostSuitableVariant = findMostSuitableVariant(variants, {
                                            ...selectedVariant.attributes,
                                            [key]: value,
                                        });
                                        return (
                                            <option key={value} disabled={!mostSuitableVariant} value={value}>
                                                {value}
                                            </option>
                                        );
                                    })}
                                </optgroup>
                            </select>
                        </label>
                    );
                })}
            </>
        ),
    };

    return renderingTypes[renderingType as keyof typeof renderingTypes] || null;
};
