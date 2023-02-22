import { ChangeEventHandler } from 'react';

export const Input: React.FC<{
    placeholder: string;
    defaultValue?: string;
    value?: string;
    name: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    label: string;
    required?: any;
    disabled?: boolean;
    type?: string;
}> = ({ placeholder, defaultValue, value, name, onChange, label, required, disabled = false, type = 'text' }) => {
    return (
        <label htmlFor={name} className="flex flex-col frntr-input">
            <span>
                {label}
                {required && '*'}
            </span>
            <input
                defaultValue={defaultValue}
                type={type}
                id={name}
                placeholder={placeholder}
                name={name}
                onChange={onChange}
                required={required}
                className="bg-grey"
                disabled={disabled}
                value={value}
            />
        </label>
    );
};
