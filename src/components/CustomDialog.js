import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const CustomDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  fields,
  onChange,
  isLoading,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field, index) => (
          <TextField
            key={index}
            autoFocus
            margin="dense"
            label={field.label}
            type={field.type || "text"}
            fullWidth
            value={field.value}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
