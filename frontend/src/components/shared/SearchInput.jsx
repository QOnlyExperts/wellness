import "./SearchInput.css";
import SearchIcon from "../icons/SearchIcon";

const SearchInput = ({ value, onChange, onKeyDown }) => {
  return (
    <div className="search-input-container">
      <SearchIcon className="search-icon" />

      <input
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
