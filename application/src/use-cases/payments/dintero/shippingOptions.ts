export default async () => {
    return {
        shipping_options: [
            {
                id: 'bring-pick-up-00001',
                line_id: 'bring-pick-up-00001-location-0a1f6b',
                countries: ['NO'],
                amount: 3900,
                vat_amount: 975,
                vat: 25,
                title: 'Standard',
                description: 'Pick up at your nearest postal office',
                delivery_method: 'pick_up',
                operator: 'Bring',
                operator_product_id: 'pick-up-00001-location-0a1f6b',
                eta: {
                    starts_at: '2024-01-14T19:00:00Z',
                    ends_at: '2025-10-14T20:00:00Z',
                },
                time_slot: {
                    starts_at: '2023-10-14T19:00:00Z',
                    ends_at: '2029-10-14T20:00:00Z',
                },
                metadata: {
                    operator_dest: 'XAB1239',
                    number_x: 1921,
                },
                environmental_data: {
                    description: 'Fossil free',
                    details: [
                        {
                            label: 'Carbon offset',
                            value: '1KG CO2',
                        },
                    ],
                },
                fee_split: {
                    type: 'proportional',
                    destinations: ['string'],
                },
            },
        ],
    };
};
