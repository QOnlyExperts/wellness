import LoaderIcon from "../icons/LoaderIcon";
import "./Button.css"

const Button = ({style, disabled, text, className, onClick, children, type = 'button', isLoading, colorIcon}) => {

  return(
    <button
      style={style}
      disabled={disabled}
      className={!isLoading ? className : 'btn-icon'}
      onClick={onClick}
      type={type}
    >

      {
        isLoading ? (
          <LoaderIcon size={20} color={colorIcon} />
        ) : (
          <>
            {children}
            {text}
          </>
        )
      }

    </button>
  )
}

export default Button;