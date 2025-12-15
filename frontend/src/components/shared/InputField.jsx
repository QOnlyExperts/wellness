import { useState } from 'react';
import './InputField.css';

import Button from './Button';

import CheckedIcon from '../icons/CheckedIcon'
import UncheckedIcon from '../icons/UncheckedIcon'


const InputField = ({ 
  disabled, id, name, label, type, value, maxvalue, onChange, onFocus, onBlur, errors = [], ...props 
}) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="inputContainer">
      <label className="label" htmlFor={name}>{label}</label>
      <input 
        autoComplete="off"
        id={id} 
        name={name}
        type={type === 'password' ? showPassword ? 'text' : 'password' : type} 
        value={type === 'number' && maxvalue ? Math.min(value, maxvalue) : value} 
        onChange={onChange} 
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder=" "
        disabled={!!disabled} 
        min={type === 'number' ? 0 : undefined} 
        max={type === 'number' && maxvalue ? maxvalue : undefined}
        aria-invalid={errors.some(err => err.path === name)} 
        {...props}
      />

      {
        type === 'password' &&
        <Button
          style={{
            color: '#ffffff',
            marginTop: '5px'
          }}
          text='Mostrar contraseña' 
          className='btn-icon' 

          onClick={() => {
            if(showPassword){
              setShowPassword(false)
            }else{
              setShowPassword(true);
            }
          }}
        >
          {
            showPassword ? 
              <CheckedIcon color='#ffffff' />
            : 
              <UncheckedIcon color='#ffffff' />
          }
        </Button>
      }

      {Array.isArray(errors) && errors.map((err, i) => (
        err.path === name ? 
          <span key={i} style={{ color: 'red', fontSize: '.7rem' }}>{err.message}</span> 
        : null
      ))}
    </div>
  );
};

export default InputField;
