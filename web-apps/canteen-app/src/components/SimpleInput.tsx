const SimpleInput: React.FC = () => {

  return (

    <div className="simple-input-container">
      <label htmlFor="simple-input" className="simple-input-label">Simple Input</label>
      <input
        readOnly
        type="text"
        title="Simple Input"
        value="simple input value"
        className="simple-input"
      />
    </div>
  );

}

export default SimpleInput;
