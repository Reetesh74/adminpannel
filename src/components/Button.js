import React from "react";

const Button = ({ onClick, children, variant = "default", style = {} }) => {
  const baseStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease, color 0.3s ease",
    ...style,
  };

  return (
    <button style={baseStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
