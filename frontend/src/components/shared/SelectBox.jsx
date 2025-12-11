


const SelectBox = ({handleOptionClick, handleSelectOptionClick, listCities, selects, errors}) => {


  return (
    <div className="select-box" id="select-box-city">
      <div
        className="select-option"
        id="select-option-city"
        onClick={() => handleSelectOptionClick("select-box-city")}
      >
        <InputField
          id={"idCity"}
          name={"idCity"}
          label={"Ciudad"}
          type={"text"}
          value={selects.city}
          errors={errors}
        />
      </div>

      <div className="content">
        <ul className="options" id="optionsCity">
          {listCities.map((city) => (
            <li
              key={city.idCity}
              onClick={() =>
                handleOptionClick("city", city.Location, city.idCity)
              }
            >
              {city.Location}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}