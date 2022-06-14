import isEqual from 'lodash/isEqual';
import { Image } from '@crystallize/reactjs-components/dist/image';
function reduceAttributes(variants: any) {
    return variants.reduce((acc: any, variant: any) => {
        const attrs = acc;
        variant?.attributes?.forEach(({ attribute, value }: { attribute: string; value: string }) => {
            const currentAttribute = attrs[attribute];
            if (!currentAttribute) {
                attrs[attribute] = [value];
                return;
            }

            const valueExists = currentAttribute.find((str: string) => str === value);
            if (!valueExists) {
                attrs[attribute].push(value);
            }
        });

        return attrs;
    }, {});
}

function attributesToObject({ attributes }: { attributes: any }) {
    return Object.assign(
        {},
        ...attributes.map(({ attribute, value }: { attribute: string; value: string }) => ({ [attribute]: value })),
    );
}

export const VariantSelector = ({
    variants,
    selectedVariant,
    onVariantChange,
    renderingType = 'default',
}: {
    variants: any;
    selectedVariant: any;
    onVariantChange: Function;
    renderingType: string;
}) => {
    const attributes = reduceAttributes(variants);

    let imageKeysForFiltering = [] as any;
    variants.map((variant: any) => {
        imageKeysForFiltering.push(variant?.images?.[0].key);
    });
    const variantsHasUniqueImages = [...new Set(imageKeysForFiltering)]?.length > 1;

    function onAttributeSelect({ attribute, value }: { attribute: string; value: string }) {
        const selectedAttributes = attributesToObject(selectedVariant);

        selectedAttributes[attribute] = value;
        // Get the most suitable variant
        let variant = variants?.find((variant: any) => {
            if (isEqual(selectedAttributes, attributesToObject(variant))) {
                return true;
            }
            return false;
        });

        if (variant) {
            onVariantChange(variant);
        }
    }
    function handleSelectChange({ attribute, value }: { attribute: string; value: string }) {
        onAttributeSelect({ attribute, value });
    }
    const renderingTypes = {
        default: (
            <div>
                {Object.keys(attributes).map((attribute) => {
                    const attr = attributes[attribute];
                    const selectedAttr = selectedVariant.attributes?.find((a: any) => a.attribute === attribute);

                    if (!selectedAttr) {
                        return null;
                    }

                    return (
                        <div key={attribute} className="border-[#dfdfdf]">
                            <p className="my-3 text-sm  font-semibold">{attribute}</p>
                            <div className="flex mb-5 flex-wrap gap-2">
                                {attr.map((value: string) => {
                                    const selectedAttributes = attributesToObject(selectedVariant);
                                    selectedAttributes[attribute] = value;
                                    const mostSuitableVariant = variants.find((variant: any) =>
                                        isEqual(selectedAttributes, attributesToObject(variant)),
                                    );
                                    return (
                                        <button
                                            key={value}
                                            onClick={(e) => onAttributeSelect({ attribute, value })}
                                            type="button"
                                            className=" w-1/6   py-2 rounded-lg text-text flex flex-col items-center text-xs font-medium"
                                            disabled={!mostSuitableVariant}
                                            style={{
                                                opacity: !mostSuitableVariant ? 0.2 : 1,
                                                border:
                                                    value === selectedAttr.value
                                                        ? '1px solid #000'
                                                        : '1px solid #efefef',
                                            }}
                                        >
                                            {variantsHasUniqueImages && attribute.toLowerCase() !== 'size' && (
                                                <div className="img-container p-3 h-[80px] w-[80px] img-contain">
                                                    {mostSuitableVariant?.images?.[0] && (
                                                        <Image {...mostSuitableVariant.images[0]} sizes="100px" />
                                                    )}
                                                </div>
                                            )}
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
                {Object.keys(attributes).map((attribute) => {
                    const attr = attributes[attribute];
                    const selectedAttr = selectedVariant.attributes?.find((a: any) => a.attribute === attribute);

                    if (!selectedAttr) {
                        return null;
                    }

                    return (
                        <div className="">
                            <label>
                                <span className="block text-xs pb-1 font-medium">{attribute}</span>
                                <select
                                    onChange={(e) => handleSelectChange({ attribute, value: e.target.value })}
                                    className="py-2 px-4 bg-[#fff] text-sm rounded-md min-w-[150px] "
                                >
                                    {attr?.map((value: any) => {
                                        const selectedAttributes = attributesToObject(selectedVariant);
                                        selectedAttributes[attribute] = value;
                                        const mostSuitableVariant = variants.find((variant: any) =>
                                            isEqual(selectedAttributes, attributesToObject(variant)),
                                        );

                                        return (
                                            <option
                                                key={value}
                                                disabled={!mostSuitableVariant}
                                                value={value}
                                                // className="hover:bg-grey text "
                                            >
                                                {value}
                                            </option>
                                        );
                                    })}
                                </select>
                            </label>
                        </div>
                    );
                })}
            </>
        ),
    };

    return renderingTypes[renderingType] || null;
};
