
import "./Button.css"

const Button = ({style, disabled, text, className, onClick, children, type = 'button'}) => {

  return(
    <button
    style={style}
      disabled={disabled}
      className={className}
      onClick={onClick}
      type={type}
    >
      {children}
      {text}
    </button>
  )
}

export default Button;