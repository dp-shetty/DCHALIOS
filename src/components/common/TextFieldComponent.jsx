import React, { useEffect, useState } from "react";
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
  children,
  onBlur,
  error,
  touched,
  fontSize = "1em",
  selectFontSize = "1em",
  className,
  tailwindClass,
  width = "5rem",
  ipBorderColor,
  ipLabelColor,
  disable,
  textColor,
}) => {
  const [textfieldBorderColor, setTextfieldBorderColor] =
    useState(ipBorderColor);
  const [labelColor, setLabelColor] = useState(ipLabelColor);
  const [iconColor, setIconColor] = useState("#ffb400");
  const [requiredColor, setRequiredColor] = useState("red");
  // const [textColorIp, setTextColor] = useState(textColor);

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
      disabled={disable}
      sx={{
        width: width,
        // color:textColor,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: borderColor,
          },
          "&:hover fieldset": {
            borderColor: borderColor,
          },
          "&.Mui-focused fieldset": {
            borderColor: borderColor,
          },
          "& input": {
            color: textColor,
            fontSize: fontSize,
          },
        },
        "& .MuiInputLabel-root": {
          color: labelErrorColor,
          fontSize: fontSize,
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: labelErrorColor,
        },
        "& .MuiInputLabel-asterisk": {
          color: requiredColor,
        },
        "& .MuiSelect-icon": {
          color: iconColor,
        },
      }}
      className={`${tailwindClass} ${className} ${width}`} // Combine Tailwind and additional classes
    >
      {children}
    </TextField>
  );
};
