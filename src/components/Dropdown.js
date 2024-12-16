import React from "react";
import { Autocomplete, TextField, Typography, Button } from "@mui/material";

const Dropdown = ({
  options = [],
  value = [],
  onChange,
  onAddOption,
  getOptionLabel = (option) => option.label || option.name || "",
  placeholder = "Select Option",
  addButtonText = "Add",
  customRenderOption,
  isMultiple = false,
}) => {
  return (
    <Autocomplete
      multiple={isMultiple} // Enable multiple selection
      options={[
        ...options,
        onAddOption ? { id: "add-option", name: `+ ${addButtonText}` } : null,
      ].filter(Boolean)}
      value={value} // Correctly handle the array of selected options
      onChange={(event, selectedValues) => {
        if (Array.isArray(selectedValues)) {
          // Check if the "Add" option is selected
          const addOptionSelected = selectedValues.some(
            (item) => item.id === "add-option"
          );
          if (addOptionSelected) {
            // Call the add option function if provided
            onAddOption && onAddOption();
            // Remove the "Add" option from the selection
            onChange &&
              onChange(
                event,
                selectedValues.filter((item) => item.id !== "add-option")
              );
          } else {
            onChange && onChange(event, selectedValues);
          }
        } else {
          onChange && onChange(event, selectedValues);
        }
      }}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F8FAFC !important",
              borderRadius: "8px",
              width: "20vw",
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        // Destructure 'key' and pass it explicitly
        const { key, ...rest } = props;

        return option.id === "add-option" ? (
          <Typography key={key} {...rest} color="primary" fontWeight="bold">
            {option.name}
          </Typography>
        ) : customRenderOption ? (
          customRenderOption(props, option)
        ) : (
          <div key={key} {...rest}>
            {getOptionLabel(option)}
          </div>
        );
      }}
      isOptionEqualToValue={(option, value) =>
        option.id === value?.id || option.id === value
      }
    />
  );
};

export default Dropdown;