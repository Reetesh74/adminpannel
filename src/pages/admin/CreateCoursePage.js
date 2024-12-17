import React, { useState, useEffect } from "react";
import Dropdown from "../../components/Dropdown";
import CustomDialog from "../../components/CustomDialog";
import Input from "../../components/Input";

import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
import "react-calendar/dist/Calendar.css";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import "../../styles/admin.css";
import {
  getStateData,
  getSubjectData,
  addOrUpdateSubject,
  createOrUpdatePlan,
  getClassData,
  createOrUpdateStandard,
  deleteStandard,
  deleteSubject,
  getCourseData,
  createCourse,
  createOrUpdateBoard,
  deleteBoard,
  deleteCourse,
  getBoardData,
} from "../../utils/api";

const SearchableDropdown = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [states, setStates] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newMinAmount, setNewMinAmount] = useState("");
  const [newMaxAmount, setNewMaxAmount] = useState("");
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourseSubtitle, setNewCourseSubtitle] = useState("");
  const [givenMinAmount, setgivenMinAmount] = useState(0);
  const [givenMaxAmount, setgivenMaxAmount] = useState(0);
  const [givenAmount, setGivenamount] = useState(0);
  const [planDetails, setPlanDetails] = useState({
    name: "PLAN-SUB-3",
    courseType: "",
    period: "yearly",
    currency: "INR",
    interval: 0,
    board: "",
    state: "",
    city: "",
    amount: 0,
    minAmount: 0,
    maxAmount: 0,
    standards: [],
    productIds: [],
    expiryDate: "2024-11-30T19:36:42.719+00:00",
    subtitle: "",
    coupon: 0,
  });

  const options = [
    { id: 1, name: "1 year" },
    { id: 2, name: "2 years" },
  ];
  const monthlyOption = [
    { id: 1, name: "Weekly" },
    { id: 2, name: "Monthly" },
  ];

  const handleIntervalChange = (event, value) => {
    setPlanDetails((prevState) => ({
      ...prevState,
      interval: value ? value.id : null,
    }));
  };

  // ------------------------------------------
  const handleDeleteClass = async (classId) => {
    try {
      const response = await deleteStandard(classId);
      if (response.status === 200) {
        alert("Class deleted successfully.");
        setClasses((prevClasses) => {
          const updatedClasses = prevClasses.filter(
            (cls) => cls._id !== classId
          );
          console.log("Updated classes after deletion:", updatedClasses);
          return updatedClasses;
        });
      } else {
        alert("Failed to delete the class. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting the class:", error.message);
      alert("An error occurred while deleting the class.");
    }
  };
  const handleDeleteBoard = async (boardId) => {
    try {
      const response = await deleteBoard(boardId);
      if (response.status === 200) {
        alert("Class deleted successfully.");
        setBoards((prevBoards) => {
          const updatedBoards = prevBoards.filter((c) => c.boardId !== boardId);
          console.log("Updated Board after deletion:", updatedBoards);
          return updatedBoards;
        });
      } else {
        alert("Failed to delete the class. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting the class:", error.message);
      alert("An error occurred while deleting the class.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      console.log("Deleting course with ID:", courseId);
      const response = await deleteCourse(courseId);

      if (response.status === 200) {
        alert("Course deleted successfully.");
        setCourses((prevCourses) => {
          console.log("Current courses before deletion:", prevCourses);
          const updatedCourses = prevCourses.filter(
            (cs) => cs.courseId !== courseId
          );
          console.log("Updated courses after deletion:", updatedCourses);
          return updatedCourses;
        });
      } else {
        alert("Failed to delete the class. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting the class:", error.message);
      alert("An error occurred while deleting the class.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stateData, classData, subjectData, courseData] =
          await Promise.all([
            getStateData("IN"),
            getClassData(),
            getSubjectData(),
            getCourseData(),
          ]);

        if (stateData && typeof stateData === "object") {
          const stateNames = Object.keys(stateData);
          setStates(stateNames);
        } else {
          console.error("State data not found or malformed response");
        }

        if (classData && Array.isArray(classData)) {
          setClasses(classData);
        } else {
          console.error("Class data is not in the expected format");
        }

        // Handle subject data
        if (subjectData && Array.isArray(subjectData)) {
          const normalizedSubjects = subjectData.map((subject) => ({
            _id: subject._id || Date.now(),
            name: subject.name || "Unnamed Subject",
            minAmount: subject.minAmount,
            maxAmount: subject.maxAmount,
          }));
          setSubjects(normalizedSubjects);
        } else {
          console.error("Subject data not found or malformed response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteSubject = async (subjectId) => {
    try {
      const stringId = String(subjectId);

      const response = await deleteSubject(stringId);
      if (response.status === 200) {
        setSubjects((prevSubjects) =>
          prevSubjects.filter((subject) => String(subject._id) !== stringId)
        );
      } else {
        alert("Failed to delete the subject. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while deleting the subject.");
    }
  };

  const handleStateChange = (event, value) => {
    setSelectedState(value);
    setPlanDetails((prevState) => ({
      ...prevState,
      state: value || "",
    }));

    if (value) {
      getStateData("IN")
        .then((stateData) => {
          const cityList = stateData[value] || [];
          setCities(cityList);
        })
        .catch((error) => {
          setCities([]);
        });
    } else {
      setCities([]);
    }
  };

  const handleAddStandard = async () => {
    const standardDetails = {
      name: newClassName,
      telecrmClassName: newClassName,
      parent: "classes",
      isDisabled: false,
      order: 11,
    };

    try {
      debugger;
      const response = await createOrUpdateStandard(standardDetails);
      if (response) {
        const classData = await getClassData();
        setClasses(classData);
        handleClassDialogClose();
      } else {
        console.error("Error creating/updating standard.");
      }
    } catch (error) {
      console.error("Error in calling createOrUpdateStandard:", error);
    }
  };

  const handleAddNewSubject = async () => {
    if (newSubjectName && newMinAmount && newMaxAmount) {
      try {
        const response = await addOrUpdateSubject({
          name: newSubjectName,
          minAmount: newMinAmount,
          maxAmount: newMaxAmount,
        });

        if (response) {
          const newSubject = {
            _id: response.id || Date.now(),
            name: newSubjectName,
          };

          setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
          setSelectedSubject(newSubject);
          handleDialogClose("subject");
        }
      } catch (error) {
        alert("Failed to add subject. Please try again.");
      }
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleAddPlan = async () => {
    if (!selectedCourse || !selectedCourse.courseName) {
      alert("Please select a course before submitting the plan.");
      return;
    }

    try {
      const courseName = selectedCourse.courseId;

      const boardName = selectedBoard.boardName;
      console.log("Amount ", typeof Number(givenAmount));
      console.log("givenMinAmount ", givenMinAmount);
      console.log("givenMaxAmount ", givenMaxAmount);
      const updatedPlanDetails = {
        ...planDetails,
        courseType: `${courseName}`,
        board: `${boardName}`,
        amount: Number(givenAmount),
        minAmount: Number(givenMinAmount),
        maxAmount: Number(givenMaxAmount),
      };

      await createOrUpdatePlan(updatedPlanDetails);
    } catch (error) {
      console.error("Error creating/updating the plan:", error);
    }
  };

  const handleClassDialogClose = () => {
    setIsClassDialogOpen(false);
    setNewClassName("");
  };

  const handleDialogClose = () => {
    setNewCourseName("");
    setNewCourseSubtitle("");
    setNewSubjectName("");
    setNewMinAmount("");
    setNewMaxAmount("");
    setNewClassName("");
    setIsCourseDialogOpen(false);
    setIsSubjectDialogOpen(false);
    setIsClassDialogOpen(false);
  };

  const handleDialogChange = (fieldName, value) => {
    switch (fieldName) {
      case "courseName":
        setNewCourseName(value);
        break;
      case "courseSubtitle":
        setNewCourseSubtitle(value);
        break;
      case "subjectName":
        setNewSubjectName(value);
        break;
      case "minAmount":
        setNewMinAmount(value);
        break;
      case "maxAmount":
        setNewMaxAmount(value);
        break;
      case "className":
        setNewClassName(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourseData();
        if (data && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          console.error("Courses data not found or malformed response");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getBoardData();
        if (data && Array.isArray(data.boards)) {
          console.log(data.boards);
          setBoards(data.boards);
        } else {
          console.error("Courses data not found or malformed response");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchBoard();
  }, []);

  const handleAddCourse = async () => {
    if (newCourseName.trim() && newCourseSubtitle.trim()) {
      try {
        const response = await createCourse({
          name: newCourseName,
          subtitle: newCourseSubtitle,
        });
        if (response) {
          setCourses((prevCourses) => [
            ...prevCourses,
            { courseId: response.id, courseName: newCourseName },
          ]);
          setNewCourseName("");
          setNewCourseSubtitle("");
          setIsCourseDialogOpen(false);
        }
      } catch (error) {
        alert("Failed to add course. Please try again.");
      }
    } else {
      alert("Course name and subtitle cannot be empty!");
    }
  };

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const periods = ["monthly", "yearly"];

  const handlePeriodChange = (event, value) => {
    setSelectedPeriod(value);
    setPlanDetails((prevDetails) => ({
      ...prevDetails,
      period: value || "",
    }));
  };

  const handleDateChange = (date) => {
    setPlanDetails((prev) => ({
      ...prev,
      expiryDate: date,
    }));
  };

  const handleAddClassDialogOpen = () => setIsClassDialogOpen(true);

  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const handleAddBoardDialogClose = () => {
    setIsBoardDialogOpen(false);
    setNewBoardName("");
  };

  const handleAddNewBoard = async () => {
    if (newBoardName.trim()) {
      try {
        const response = await createOrUpdateBoard({ name: newBoardName });
        if (response) {
          setBoards((prevBoards) => [...prevBoards, newBoardName]);
          setSelectedBoard(newBoardName);
          handleAddBoardDialogClose();
        }
      } catch (error) {
        console.error("Error adding board:", error);
        alert("Failed to add the board. Please try again.");
      }
    } else {
      alert("Board name cannot be empty!");
    }
  };

  // ---------------------------------------------udpatecode-----------------------
  const [isEditing, setIsEditing] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const handleUpdateBoard = async (boardId, updatedBoardName) => {
    try {
      const response = await createOrUpdateBoard({
        _id: boardId,
        name: updatedBoardName,
      });
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.boardId === boardId
            ? { ...board, boardName: updatedBoardName }
            : board
        )
      );
      console.log("Board updated successfully:", response);
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  // for subject
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const handleAddOrUpdateSubject = (
    newSubjectName,
    newMinAmount,
    newMaxAmount,
    editingSubjectId
  ) => {
    addOrUpdateSubject({
      _id: editingSubjectId,
      name: newSubjectName,
      minAmount: newMinAmount,
      maxAmount: newMaxAmount,
    });
    getSubjectData();
  };

  //for class update
  const [editingClassId, setEditingClassId] = useState(null);
  const handleAddOrUpdateClass = async (className, classId) => {
    const classDetails = {
      _id: classId,
      name: className,
      telecrmClassName: className,
      parent: "classes",
      isDisabled: false,
      order: 11,
    };

    try {
      const response = await createOrUpdateStandard(classDetails);
      if (response) {
        const classData = await getClassData();
        setClasses(classData);
        setEditingClassId(null);
        handleClassDialogClose();
      } else {
        console.error("Error creating/updating class.");
      }
    } catch (error) {
      console.error("Error in calling createOrUpdateStandard:", error);
    }
  };

  // update course
  const [editingCourseId, setEditingCourseId] = useState(null);
  const handleEditCourse = async () => {
    try {
      debugger;
      const updatedCourse = {
        _id: editingCourseId,
        name: newCourseName,
        subtitle: newCourseSubtitle,
      };

      const response = await createCourse(updatedCourse);
      if (response) {
        const data = await getCourseData();
        setCourses(data.courses);
        setNewCourseName("");
        setNewCourseSubtitle("");
        setIsCourseDialogOpen(false);
      }
    } catch (error) {
      alert("Failed to update course. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ margin: "80px" }}
    >
      <CustomDialog
        open={isBoardDialogOpen}
        onClose={() => {
          setIsBoardDialogOpen(false);
          setIsEditing(false);
          setNewBoardName("");
        }}
        onSubmit={() => {
          if (isEditing) {
            handleUpdateBoard(editingBoardId, newBoardName);
          } else {
            handleAddNewBoard(newBoardName);
          }
          setIsBoardDialogOpen(false);
          setIsEditing(false);
          setNewBoardName("");
        }}
        title={isEditing ? "Edit Board Name" : "Add New Board"}
        fields={[
          {
            label: "Board Name",
            name: "boardName",
            value: newBoardName,
          },
        ]}
        onChange={(fieldName, value) => {
          if (fieldName === "boardName") {
            setNewBoardName(value);
          }
        }}
      />
      <label>Course</label>
      <Dropdown
        options={courses}
        value={selectedCourse}
        onChange={(event, value) => {
          if (value?.id === "add-option") {
            setIsCourseDialogOpen(true);
          } else if (value?.courseId) setSelectedCourse(value);
        }}
        onAddOption={() => {
          setIsCourseDialogOpen(true);
        }}
        onDeleteOption={(option) => handleDeleteCourse(option.courseId)}
        placeholder="Search or Add Course"
        addButtonText="Course"
        getOptionLabel={(option) => option.courseName || ""}
        customRenderOption={(props, option) => {
          const { key, ...rest } = props;

          return (
            <Box
              key={key}
              {...rest}
              display="flex"
              justifyContent="space-between"
              width="100%"
            >
              <Typography>{option.courseName}</Typography>
              <Box>
                <Button
                  color="secondary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCourse(option.courseId);
                  }}
                >
                  Del
                </Button>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCourseId(option.courseId);
                    setNewCourseName(option.courseName);
                    console.log("new subtile", option.subtitle);
                    setNewCourseSubtitle(option.subtitle || "");
                    setIsCourseDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          );
        }}
      />
      <CustomDialog
        open={isCourseDialogOpen}
        onClose={() => {
          handleDialogClose();
          setNewCourseName("");
          setNewCourseSubtitle("");
          setEditingCourseId(null);
        }}
        onSubmit={() => {
          if (editingCourseId) {
            handleEditCourse();
          } else {
            handleAddCourse();
          }
        }}
        title={editingCourseId ? "Edit Course" : "Add New Course"}
        fields={[
          { label: "Course Name", name: "courseName", value: newCourseName },
          {
            label: "Course Subtitle",
            name: "courseSubtitle",
            value: newCourseSubtitle,
          },
        ]}
        onChange={handleDialogChange}
      />
      <label>Period</label>
      <Dropdown
        options={periods}
        value={selectedPeriod}
        onChange={handlePeriodChange}
        placeholder="Search or Add period"
        getOptionLabel={(option) => option}
        customRenderOption={(props, option) => {
          const { key, ...rest } = props;

          return (
            <Box
              key={key}
              {...rest}
              display="flex"
              justifyContent="space-between"
              width="100%"
            >
              <Typography>{option}</Typography>
            </Box>
          );
        }}
      />
      <label>Validity</label>
      {selectedPeriod === "yearly" ? (
        <div>
          <Dropdown
            options={options}
            value={
              options.find((option) => option.id === planDetails.interval) ||
              null
            }
            onChange={handleIntervalChange}
            placeholder="Select Interval"
            getOptionLabel={(option) => option.name}
            isMultiple={false}
          />
          <div>
            <label>Plan ExpiryDate</label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                id="expiryDate"
                value={planDetails.expiryDate}
                onChange={(newDate) => handleDateChange(newDate)}
                format="yyyy-MM-dd"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Expiry Date"
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
      ) : (
        <Dropdown
          options={monthlyOption}
          value={
            monthlyOption.find(
              (option) => option.id === planDetails.interval
            ) || null
          }
          onChange={handleIntervalChange}
          placeholder="Select Interval"
          getOptionLabel={(option) => option.name}
          isMultiple={false}
        />
      )}
      <label>Class</label>
      <Dropdown
        options={classes}
        value={selectedClass}
        onChange={(event, value) => {
          if (value?.id === "add-option") {
            handleAddClassDialogOpen();
          } else if (value?._id) {
            setSelectedClass(value);
            setPlanDetails((prevState) => ({
              ...prevState,
              standards: [value._id],
            }));
          } else {
            console.warn("Selected value does not contain _id", value);
          }
        }}
        onAddOption={handleAddClassDialogOpen}
        onDeleteOption={(option) => handleDeleteClass(option.id)}
        placeholder="Search or Add Class"
        addButtonText="Class"
        customRenderOption={(props, option) => {
          const { key, ...restProps } = props;

          return (
            <Box
              key={key}
              {...restProps}
              display="flex"
              justifyContent="space-between"
              width="100%"
            >
              <Typography>{option.name}</Typography>
              <Box>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsClassDialogOpen(true);
                    setNewClassName(option.name);
                    setEditingClassId(option._id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  color="secondary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClass(option._id);
                  }}
                >
                  Del
                </Button>
              </Box>
            </Box>
          );
        }}
      />
      <label htmlFor="">boards</label>
      <Dropdown
        options={boards}
        value={selectedBoard}
        onChange={(event, value) => {
          if (value?.id === "add-option") {
            setIsBoardDialogOpen(true);
          } else if (value?.boardId) {
            setSelectedBoard(value);
          }
        }}
        onAddOption={() => setIsBoardDialogOpen(true)}
        placeholder="Search or Add Board"
        addButtonText="Board"
        onDeleteOption={(option) => handleDeleteBoard(option.boardId)}
        getOptionLabel={(option) => option.boardName || ""}
        customRenderOption={(props, option) => {
          const { key, ...restProps } = props;

          return (
            <Box
              key={key}
              {...restProps}
              display="flex"
              justifyContent="space-between"
              width="100%"
            >
              <Typography>{option.boardName}</Typography>
              <Box>
                <Button
                  color="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setNewBoardName(option.boardName);
                    setEditingBoardId(option.boardId);
                    setIsBoardDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  color="secondary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(option.boardId);
                  }}
                >
                  Del
                </Button>
              </Box>
            </Box>
          );
        }}
      />
      <CustomDialog
        open={isClassDialogOpen}
        onClose={() => {
          handleDialogClose();
          setNewClassName("");
          setEditingClassId(null);
        }}
        onSubmit={() => {
          if (editingClassId) {
            handleAddOrUpdateClass(newClassName, editingClassId);
          } else {
            handleAddStandard();
          }
        }}
        title={editingClassId ? "Edit Class" : "Add New Class"}
        fields={[
          { label: "Class Name", name: "className", value: newClassName },
        ]}
        onChange={handleDialogChange}
      />
      <label>Subjects</label>
      <div className="newSubject">
        <Autocomplete
          multiple
          value={Array.isArray(selectedSubject) ? selectedSubject : []}
          options={Array.isArray(subjects) ? subjects : []}
          onChange={(event, value) => {
            setSelectedSubject(Array.isArray(value) ? value : []);

            setPlanDetails((prevState) => ({
              ...prevState,
              productIds: Array.isArray(value)
                ? value.map((subject) => subject._id)
                : [],
            }));
          }}
          className="box-input"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Subjects"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F8FAFC !important",
                  borderRadius: "8px",
                },
              }}
            />
          )}
          getOptionLabel={(option) => option?.name || "Unnamed Subject"}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <li
                key={key}
                {...restProps}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{option?.name || "Unnamed Subject"}</span>
                <Box>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSubjectDialogOpen(true);
                      setIsEditing(true);
                      setNewSubjectName(option?.name);
                      setNewMinAmount(option?.minAmount);
                      setNewMaxAmount(option?.maxAmount);
                      console.log("subject idddddd ", option?._id);
                      setEditingSubjectId(option?._id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubject(option?._id);
                    }}
                  >
                    Del
                  </Button>
                </Box>
              </li>
            );
          }}
        />

        <Button
          variant="outlined"
          color="primary"
          onClick={() => setIsSubjectDialogOpen(true)}
          className="addsubjectButton"
        >
          Add Subject
        </Button>

        <CustomDialog
          open={isSubjectDialogOpen}
          onClose={handleDialogClose}
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
          ]}
          onChange={handleDialogChange}
        />
      </div>
      <label>State</label>
      <Dropdown
        options={states}
        value={selectedState}
        onChange={handleStateChange}
        placeholder="Search State"
        addButtonText="State"
        getOptionLabel={(option) => option || ""}
      />
      {selectedPeriod === "yearly" && (
        <div>
          <div>
            <label htmlFor="">Fix Amount</label>
            <Input
              value={givenAmount}
              onChange={setGivenamount}
              placeholder="Enter Fix Amount"
            />
          </div>

          <div>
            <label htmlFor="">Min Amount</label>
            <Input
              value={givenMinAmount}
              onChange={setgivenMinAmount}
              placeholder="Enter Min Amount"
            />
          </div>

          <div>
            <label htmlFor="">Max Amount</label>
            <Input
              value={givenMaxAmount}
              onChange={setgivenMaxAmount}
              placeholder="Enter Max Amount"
            />
          </div>
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPlan}
        className="createPlanButton"
        sx={{ marginTop: "16px" }}
      >
        Create Plan
      </Button>
    </Box>
  );
};

export default SearchableDropdown;
