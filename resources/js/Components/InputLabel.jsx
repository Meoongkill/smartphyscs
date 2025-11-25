export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block font-bold text-sm text-blac ` + className}>
            {value ? value : children}
        </label>
    );
}
