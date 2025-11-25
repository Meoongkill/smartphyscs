const TextArea = ({ value, onChange, placeholder }) => {
    return (
      <textarea
        className="form-control"
        value={value}
        rows={4}
        onChange={onChange}
        placeholder={placeholder}
      ></textarea>
    );
  };

  export default TextArea;
