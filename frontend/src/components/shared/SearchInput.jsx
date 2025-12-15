import "./SearchInput.css";
import SearchIcon from "../icons/SearchIcon";

const SearchInput = ({ value, onChange, onKeyDown, disabled, errors = [] }) => {
  return (
    <div className="search-input-container">
      <SearchIcon className="search-icon" />

      {/* <label className="label-search" htmlFor="search">Buscar</label> */}
      <input
        id="search"
        name="search"
        type="search"
        disabled={disabled}
        placeholder="Buscar..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="search-input"
      />
      {Array.isArray(errors) && errors.map((err, i) => (
        err.path === name ? 
          <span key={i} style={{ color: 'red', fontSize: '.7rem' }}>{err.message}</span> 
        : null
      ))}
    </div>
  );
};

export default SearchInput;
