import React, { useState } from "react";
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Checkbox,
  Button,
  Grid,
  Box,
} from "@mui/material";

const ManageCoupons = () => {
  const [formData, setFormData] = useState({
    discountType: "flat",
    flatDiscountAmount: "",
    percentageDiscount: "",
    maxDiscountAmount: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    lifetime: false,
    minOrderValue: 1,
    numberOFCoupon: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Manage Coupons
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Discount Type *</FormLabel>
            <RadioGroup
              row
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <FormControlLabel
                value="flat"
                control={<Radio />}
                label="Flat Discount"
              />
              <FormControlLabel
                value="percentage"
                control={<Radio />}
                label="Percentage Discount"
              />
            </RadioGroup>
          </FormControl>

          {formData.discountType === "flat" && (
            <TextField
              placeholder="Flat Discount Amount"
              type="text"
              name="flatDiscountAmount"
              value={formData.flatDiscountAmount}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )}

          {formData.discountType === "percentage" && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div className="maxdiCount">
                  <TextField
                    placeholder="Percentage Discount *"
                    type="text"
                    name="percentageDiscount"
                    value={formData.percentageDiscount}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <img
                    src="/icons/percentage-icon.svg"
                    alt="percentage Icon"
                    className="enrollmentIcon"
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="maxdiCount">
                  <img
                    src="/icons/ruppes-icon.svg"
                    alt="ruppes Icon"
                    className="enrollmentIcon"
                  />
                  <TextField
                    placeholder="Max Discount Amount *"
                    type="text"
                    name="maxDiscountAmount"
                    value={formData.maxDiscountAmount}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </div>
              </Grid>
            </Grid>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                placeholder="starting date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Time *"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date *"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={formData.lifetime}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Time *"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={formData.lifetime}
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                name="lifetime"
                checked={formData.lifetime}
                onChange={handleChange}
              />
            }
            label="Check if you want to set coupon validity to lifetime"
          />

          <TextField
            type="text"
            name="minOrderValue"
            placeholder="Minimum order"
            value={formData.minOrderValue}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            placeholder="Number of coupon"
            type="text"
            name="numberOFCoupon"
            value={formData.numberOFCoupon}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Next
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ManageCoupons;
