import React, { useState } from "react";
import { TextField } from "@mui/material";

export const TextFieldComponent = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  select = false,
  multiline = false,
  required,
  rows,
  onBlur,
  error,
  touched,
  fontSize = "1em",
  className,
  tailwindClass,
  width = "5rem",
  ipBorderColor,
  ipLabelColor = "black", // Default label color
  disable,
  textColor,
  inputBorderColor,
}) => {
  const [textfieldBorderColor, setTextfieldBorderColor] = useState(ipBorderColor);
  const [labelColor, setLabelColor] = useState(ipLabelColor);
  
  const borderColor = touched && error ? "red" : textfieldBorderColor;
  const labelErrorColor = touched && error ? "red" : labelColor;

  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      select={select}
      onBlur={onBlur}
      multiline={multiline}
      rows={rows}
      autoComplete="off"
      margin="normal"
      required={required}
      disabled={disable} // Prop to control disabled state
      InputLabelProps={{
        shrink: Boolean(value) || disable, // Force label to shrink when there's a value or field is disabled
      }}
      sx={{
        width: width,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: inputBorderColor,
          },
          "&:hover fieldset": {
            borderColor: borderColor,
          },
          "&.Mui-focused fieldset": {
            borderColor: inputBorderColor,
          },
          "& input": {
            color: textColor,
            fontSize: fontSize,
          },
        },
        "& .MuiInputLabel-root": {
          color: labelErrorColor, // Change color based on error state
          fontSize: fontSize,
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: labelErrorColor, // Keep focused label color consistent
        },
        "& .MuiInputLabel-root.Mui-disabled": {
          color: "gray", // Optional: Customize disabled label color if needed
        },
      }}
      className={`${tailwindClass} ${className} ${width}`} // Combine Tailwind and additional classes
    />
  );
};
