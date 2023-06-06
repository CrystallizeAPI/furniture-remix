'use client';

import React from 'react';

import Form from '~/bridge/ui/Form';

export const Filter: React.FC<{ aggregations: any }> = ({ aggregations }) => {
    return (
        <div className="flex gap-5 mb-10 flex-wrap items-center justify-start">
            <Form aggregations={aggregations} />
        </div>
    );
};
