
import "./Button.css"

const Button = ({style, text, className, onClick, children, type = 'button'}) => {


  return(
    <button
      style={style}
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