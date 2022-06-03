export const Input = ({
    placeholder,
    defaultValue,
    name,
    onChange,
    label,
    required,
}: {
    placeholder: string;
    defaultValue: any;
    name: string;
    onChange: Function;
    label: string;
    required: any;
}) => {
    return (
        <label htmlFor={name} className="flex flex-col frntr-input">
            <span>
                {label}
                {required && '*'}
            </span>
            <input
                defaultValue={defaultValue}
                type={name}
                id={name}
                placeholder={placeholder}
                name={name}
                onChange={onChange}
                required={required}
                className="bg-grey"
            />
        </label>
    );
};
