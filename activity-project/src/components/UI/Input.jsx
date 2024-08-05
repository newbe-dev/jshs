import classes from "./Input.module.css";

function Input({
  label,
  textArea,
  full,
  half,
  third,
  children,
  className = "",
  ...props
}) {
  function resize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  let content;
  if (children) content = children;
  else if (textArea)
    content = <textarea onKeyDown={resize} {...props}></textarea>;
  else {
    if (props.type === "date") {
      let min = new Date().toISOString().substring(0, 10);
      content = <input min={min} {...props}></input>;
    } else {
      content = <input {...props}></input>;
    }
  }

  let ratio = "";
  if (full) ratio = classes.full;
  else if (half) ratio = classes.half;
  else if (third) ratio = classes.third;

  return (
    <p className={`${classes.input} ${ratio} ${className}`}>
      {label && <label className={classes.label}>{label}</label>}
      {content}
    </p>
  );
}

export default Input;
