function SelectBox({ options, onChange, ...props }) {
  return (
    <select onChange={onChange} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

export default SelectBox;
