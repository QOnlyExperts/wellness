
import "./Button.css"

const Button = ({style, text, className, onClick, children}) => {


  return(
    <button
      style={style}
      className={className}
      onClick={onClick}
    >
      {children}
      {text}
    </button>
  )
}

export default Button;