import React, { useState, useEffect } from "react";
import CustomDialog from "../CustomDialog";
import { addOrUpdateSubject } from "../../utils/api";

const AddSubject = ({
  isSubjectDialogOpen,
  handleDialogClose,
  handleAddOrUpdateSubject,
  subjects,
  setSubjects,
  selectedSubject,
  setSelectedSubject,
  editingSubjectId,
  editingSubject,
  classes,
}) => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newMinAmount, setNewMinAmount] = useState("");
  const [newMaxAmount, setNewMaxAmount] = useState("");
  const [selectedClass, setSelectedClass] = useState([]);
  console.log("class ", classes);

  useEffect(() => {
    if (editingSubject) {
      setNewSubjectName(editingSubject.name || "");
      setNewMinAmount(editingSubject.minAmount || "");
      setNewMaxAmount(editingSubject.maxAmount || "");
    } else {
      setNewSubjectName("");
      setNewMinAmount("");
      setNewMaxAmount("");
    }
  }, [editingSubject, isSubjectDialogOpen]);

  const handleDialogChange = (name, value) => {
    if (name === "subjectName") setNewSubjectName(value);
    if (name === "minAmount") setNewMinAmount(value);
    if (name === "maxAmount") setNewMaxAmount(value);
    if (name === "selectedClass") setSelectedClass(value);
  };
  console.log("selectedClass ", selectedClass);

  const handleAddNewSubject = async () => {
    if (!newSubjectName || !newMinAmount || !newMaxAmount) {
      alert("Please fill all fields.");
      return;
    }

    if (parseFloat(newMinAmount) > parseFloat(newMaxAmount)) {
      alert("Minimum Amount cannot be greater than Maximum Amount.");
      return;
    }
    const allowedStandards = selectedClass.map((classItem) => classItem._id);
    console.log("allowedStandards ", allowedStandards);
    try {
      const response = await addOrUpdateSubject({
        name: newSubjectName,
        minAmount: newMinAmount,
        maxAmount: newMaxAmount,
        allowedStandards,
      });

      if (response) {
        const newSubject = {
          _id: response.id || Date.now(),
          name: newSubjectName,
          allowedStandards,
        };

        setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
        setSelectedSubject(newSubject);

        setNewSubjectName("");
        setNewMinAmount("");
        setNewMaxAmount("");
        setSelectedClass([]);
        handleDialogClose(false);
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject. Please try again.");
    }
  };

  return (
    <>
      <CustomDialog
        open={isSubjectDialogOpen}
        onClose={() => {
          setNewSubjectName("");
          setNewMinAmount("");
          setNewMaxAmount("");
          setSelectedClass([]);
          handleDialogClose(false);
        }}
        onSubmit={() => {
          if (editingSubjectId) {
            handleAddOrUpdateSubject(
              newSubjectName,
              newMinAmount,
              newMaxAmount,
              editingSubjectId
            );
          } else {
            handleAddNewSubject();
          }
        }}
        title={editingSubject ? "Edit Subject" : "Add New Subject"}
        fields={[
          {
            label: "Subject Name",
            name: "subjectName",
            value: newSubjectName,
          },
          {
            label: "Minimum Amount",
            name: "minAmount",
            value: newMinAmount,
          },
          {
            label: "Maximum Amount",
            name: "maxAmount",
            value: newMaxAmount,
          },
          {
            // label: "Class",
            // name: "class",
            // value: "",
            // options: classes,
            label: "Select Class",
            name: "selectedClass",
            type: "autocomplete",
            value: selectedClass,
            options: classes,
          },
        ]}
        onChange={handleDialogChange}
      />
    </>
  );
};

export default AddSubject;
