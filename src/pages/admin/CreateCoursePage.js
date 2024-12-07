import React, { useState, useEffect } from "react";
import Dropdown from "../../components/Dropdown";
import CustomDialog from "../../components/CustomDialog";

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
  const [planDetails, setPlanDetails] = useState({
    name: "",
    planType: "",
    period: "",
    currency: "INR",
    interval: null,
    board: "",
    state: "",
    city: "",
    standards: [],
    productIds: [],
    coupon: "",
    expiryDate: null,
  });
  // --------------------option year--------------
  const [selectedOption, setSelectedOption] = useState(null);
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
        const response = await addOrUpdateSubject(
          newSubjectName,
          newMinAmount,
          newMaxAmount
        );

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
      const courseName = selectedCourse.courseName;
      const boardName = selectedBoard.boardName;
      const updatedPlanDetails = {
        ...planDetails,
        planType: `${courseName}`,
        board: `${boardName}`,
      };

      const response = await createOrUpdatePlan(updatedPlanDetails);
    } catch (error) {
      console.error("Error creating/updating the plan:", error);
      alert("An error occurred while creating/updating the plan.");
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
  const periods = ["Monthly", "Yearly"];

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

  // board ------------------------------------------------------
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
        onClose={handleAddBoardDialogClose}
        onSubmit={handleAddNewBoard}
        title="Add New Board"
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
          if (value?.id === "add-option") setIsCourseDialogOpen(true);
          else if (value?.courseId) setSelectedCourse(value);
        }}
        onAddOption={() => setIsCourseDialogOpen(true)}
        onDeleteOption={(option) => handleDeleteCourse(option.courseId)} // <-- Fixed here
        placeholder="Search or Add Course"
        addButtonText="Course"
        getOptionLabel={(option) => option.courseName || ""}
        customRenderOption={(props, option) => (
          <Box
            {...props}
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Typography>{option.courseName}</Typography>
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
          </Box>
        )}
      />
      <CustomDialog
        open={isCourseDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleAddCourse}
        title="Add New Course"
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
      <Autocomplete
        options={periods}
        onChange={handlePeriodChange}
        value={selectedPeriod}
        className="box-input"
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select Period"
            label="Period"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#F8FAFC !important",
                borderRadius: "8px",
              },
            }}
          />
        )}
        renderOption={(props, option) => <li {...props}>{option}</li>}
        isOptionEqualToValue={(option, value) => option === value}
      />

      <label>Validity</label>
      {selectedPeriod === "Yearly" ? (
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
          console.log("Selected Value:", value);

          if (value?.id === "add-option") {
            handleAddClassDialogOpen();
          } else if (value?._id) {
            // Ensure value._id is available before accessing it
            setSelectedClass(value);
            console.log("Vvvvvvvvvvvvvvvvv" + value._id);
            setPlanDetails((prevState) => ({
              ...prevState,
              standards: [value._id], // Set _id if it's valid
            }));
          } else {
            console.warn("Selected value does not contain _id", value);
          }
        }}
        onAddOption={handleAddClassDialogOpen}
        onDeleteOption={(option) => handleDeleteClass(option.id)}
        placeholder="Search or Add Class"
        addButtonText="Class"
        customRenderOption={(props, option) => (
          <Box
            {...props} // Spread the required props here
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Typography>{option.name}</Typography>
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
        )}
      />

      <label htmlFor="">boards</label>
      <Dropdown
        options={boards}
        value={selectedBoard}
        onChange={(event, value) => {
          if (value?.id === "add-option") setIsBoardDialogOpen(true);
          else if (value?.boardId) setSelectedBoard(value);
        }}
        onAddOption={() => setIsBoardDialogOpen(true)}
        placeholder="Search or Add borad"
        addButtonText="Borad"
        onDeleteOption={(option) => handleDeleteBoard(option.boardId)}
        getOptionLabel={(option) => option.boardName || ""}
        customRenderOption={(props, option) => (
          <Box
            {...props}
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Typography>{option.boardName}</Typography>
            <Button
              color="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log("board id  " + option.boardId);
                handleDeleteBoard(option.boardId);
              }}
            >
              Del
            </Button>
          </Box>
        )}
      />

      <CustomDialog
        open={isClassDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleAddStandard}
        title="Add New Class"
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
          onSubmit={handleAddNewSubject}
          title="Add New Subject"
          fields={[
            {
              label: "Subject Name",
              name: "subjectName",
              value: newSubjectName,
            },
            { label: "Minimum Amount", name: "minAmount", value: newMinAmount },
            { label: "Maximum Amount", name: "maxAmount", value: newMaxAmount },
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
