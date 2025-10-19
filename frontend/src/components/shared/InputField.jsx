import './InputField.css';

const InputField = ({ 
  disabled, id, name, label, type, value, maxvalue, onChange, onFocus, onBlur, errors = [], ...props 
}) => {
  return (
    <div className="inputContainer">
      <label className="label" htmlFor={name}>{label}</label>
      <input 
        autoComplete="off"
        id={id} 
        name={name}
        type={type} 
        value={type === 'number' && maxvalue ? Math.min(value, maxvalue) : value} 
        onChange={onChange} 
        onFocus={onFocus}
        onBlur={onBlur}
        // placeholder={label} 
        placeholder=" " 
        disabled={!!disabled} 
        min={type === 'number' ? 0 : undefined} 
        max={type === 'number' && maxvalue ? maxvalue : undefined}
        aria-invalid={errors.some(err => err.path === name)} 
        {...props}
      />
      {Array.isArray(errors) && errors.map((err, i) => (
        err.path === name ? 
          <span key={i} style={{ color: 'red', fontSize: '.7rem' }}>{err.message}</span> 
        : null
      ))}
    </div>
  );
};

export default InputField;
