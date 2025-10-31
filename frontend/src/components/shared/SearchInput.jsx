import "./SearchInput.css";
import SearchIcon from "../icons/SearchIcon";

const SearchInput = ({ value, onChange, onKeyDown }) => {
  return (
    <div className="search-input-container">
      <SearchIcon className="search-icon" />

      <label className="label-search" htmlFor="search">Buscar por prefijo o nombre</label>
      <input
        id="search"
        name="search"
        type="search"
        placeholder="Buscar..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;
