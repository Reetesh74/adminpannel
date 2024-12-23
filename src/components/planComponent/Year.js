import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import deleteIcon from "../../assets/images/delete-icon.svg";
import hideTrue from "../../assets/images/hide-true-icon.svg";
import hideFalse from "../../assets/images/hide-icon-false.svg";
import Dropdown from "../Dropdown";
import CustomDialog from "../CustomDialog";
import { getYearData, createYeardata } from "../../utils/api";

const Year = ({ onYearChange }) => {
  const [yearData, setYearData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [yearName, setYearName] = useState("");
  const [edintingYearId, setEditingYearId] = useState(null);

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const data = await getYearData();
        // const options = data[0]?.content.map((item) => ({
        //   interval: Number(item.value),
        //   name: item.name,
        // }));
        const options = data
          .map((item) => item.content)
          .flat()
          .map((item) => ({
            id: item.value,
            value: Number(item.value),
            name: item.name,
            isActive: item.isActive,
          }));
        setYearData(options);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
    // }, [yearData]);
  }, []);

  const handleDropdownChange = (event, selectedValues) => {
    setSelectedYear(selectedValues);
    if (selectedValues && selectedValues.isActive) {
      console.log("parent compont", selectedValues.value);
      onYearChange(selectedValues.value);
    }
  };

  const handleToggleIsActive = async (id) => {
    const updatedContent = yearData.map((year) => {
      if (year.id === id) {
        return {
          ...year,
          isActive: !year.isActive,
        };
      }
      return year;
    });

    console.log("Updated Content: ", updatedContent);

    try {
      const response = await createYeardata({
        _id: "6761c3769ef98140e9be607f",
        type: "yearCrud",
        content: updatedContent.map(({ id, name, isActive }) => ({
          name,
          value: id,
          isActive,
        })),
      });

      console.log("response datav ", response);

      // if (response) {
      //   setYearData(updatedContent);
      // } else {
      //   console.error("Error updating year data:", response.message);
      // }
    } catch (error) {
      console.error("Error toggling isActive:", error);
    }
  };

  const handleAddOption = async () => {
    const newYear = {
      name: yearName,
      value: yearName.match(/\d+/)[0],
      isActive: true,
    };

    console.log("newYearchabge ", newYear);

    try {
      const updatedContent = [...yearData, { ...newYear, id: newYear.value }];
      const response = await createYeardata({
        _id: "6761c3769ef98140e9be607f",
        type: "yearCrud",
        content: updatedContent.map(({ id, name, isActive }) => ({
          name,
          value: id,
          isActive,
        })),
      });

      if (response.success) {
        setYearData(updatedContent);
        setIsYearDialogOpen(false);
        setYearName("");
      } else {
        console.error("Error updating year data:", response.message);
      }
    } catch (error) {
      console.error("Error adding year:", error);
    }
  };

  // const inactiveYears = yearData.filter((year) => year.isActive === true);

  return (
    <div>
      <label htmlFor="">Select Year</label>
      <Dropdown
        options={yearData}
        value={selectedYear}
        onChange={(event, value) => {
          if (value?.id === "add-option") {
            setIsYearDialogOpen(true);
          } else {
            handleDropdownChange(event, value);
          }
        }}
        placeholder="Select Year"
        addButtonText="Year"
        onAddOption={handleAddOption}
        getOptionLabel={(option) => option.name || ""}
        customRenderOption={(props, option) => {
          const { key, onClose, ...restProps } = props;

          return (
            <Box
              key={key}
              {...restProps}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              padding="8px"
              style={{
                cursor: option.isActive ? "pointer" : "not-allowed",
                opacity: option.isActive ? 1 : 0.3,
              }}
              onClick={(e) => {
                if (option.isActive) {
                  e.stopPropagation();
                  handleDropdownChange(null, option);
                  if (onClose) onClose(); // Ensure this triggers only when an active option is selected
                } else {
                  console.warn("Inactive options cannot be selected.");
                }
              }}
            >
              <Typography>{option.name}</Typography>
              <Box>
                <Button
                  color="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleIsActive(option.id);
                  }}
                >
                  <img
                    src={option.isActive ? hideFalse : hideTrue}
                    className="icon"
                    alt={option.isActive ? "Hide True Icon" : "Hide False Icon"}
                  />
                </Button>
              </Box>
            </Box>
          );
        }}
      />

      <CustomDialog
        open={isYearDialogOpen}
        onClose={() => {
          setIsYearDialogOpen(false);
          setYearName("");
        }}
        onSubmit={() => {
          handleAddOption();
          setIsYearDialogOpen(false);
          setYearName("");
        }}
        title={"Add New year"}
        fields={[
          {
            label: "Year Name",
            name: "name",
            value: yearName,
          },
        ]}
        onChange={(fieldName, value) => {
          if (fieldName === "name") {
            setYearName(value);
          }
        }}
      />
    </div>
  );
};

export default Year;
