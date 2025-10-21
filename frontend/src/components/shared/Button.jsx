
import "./Button.css"

const Button = ({text, className, onClick, children}) => {


  return(
    <button
      className={className}
      onClick={onClick}
    >
      {children}
      {text}
    </button>
  )
}

export default Button;