import isEqual from 'lodash/isEqual';

function reduceAttributes(variants: any) {
    return variants.reduce((acc: any, variant: any) => {
        const attrs = acc;
        variant.attributes.forEach(({ attribute, value }: { attribute: string; value: string }) => {
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
}: {
    variants: any;
    selectedVariant: any;
    onVariantChange: Function;
}) => {
    const attributes = reduceAttributes(variants);

    function onAttributeSelect({ attribute, value }: { attribute: string; value: string }) {
        const selectedAttributes = attributesToObject(selectedVariant);

        selectedAttributes[attribute] = value;
        // Get the most suitable variant
        let variant = variants.find((variant: any) => {
            if (isEqual(selectedAttributes, attributesToObject(variant))) {
                return true;
            }
            return false;
        });

        if (variant) {
            onVariantChange(variant);
        }
    }

    return (
        <div>
            {Object.keys(attributes).map((attribute) => {
                const attr = attributes[attribute];
                const selectedAttr = selectedVariant.attributes.find((a: any) => a.attribute === attribute);

                if (!selectedAttr) {
                    return null;
                }

                return (
                    <div key={attribute} className="w-40">
                        <p className="my-3 text-text font-semibold">{attribute}</p>
                        <div className="flex justify-between mb-5">
                            {attr.map((value: string) => (
                                <button
                                    key={value}
                                    onClick={(e) => onAttributeSelect({ attribute, value })}
                                    type="button"
                                    className="shadow-sm w-30 px-3 py-2 rounded-sm text-text font-semibold"
                                    style={{
                                        border:
                                            value === selectedAttr.value ? '2px solid #000' : '3px solid transparent',
                                    }}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
