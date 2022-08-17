import { ChangeEventHandler } from 'react';

export const Input: React.FC<{
    placeholder: string;
    defaultValue: any;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    label: string;
    required: any;
    disabled?: boolean;
}> = ({ placeholder, defaultValue, name, onChange, label, required, disabled = false }) => {
    return (
        <label htmlFor={name} className="flex flex-col frntr-input">
            <span>
                {label}
                {required && '*'}
            </span>
            <input
                defaultValue={defaultValue}
                type={'text'}
                id={name}
                placeholder={placeholder}
                name={name}
                onChange={onChange}
                required={required}
                className="bg-grey"
                disabled={disabled}
            />
        </label>
    );
};
