import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Dropdown from "../../components/Dropdown";
import Table from "../../components/Table";
import Input from "../../components/Input";
import Button from "../../components/Button";
import {
  getPlansByCourseId,
  getCourseData,
  getPlansById,
  getSubjectData,
  getClassData,
} from "../../utils/api";

function PlanPage() {
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [planId, setPlanId] = useState("");

  const handleCourseChange = async (event, value) => {
    setSelectedCourse(value);
    if (value?.courseId) {
      await fetchPlans(value.courseId);
    }
  };
  const handlePlanByIdClick = async () => {
    try {
      const response = await getPlansById(planId);

      if (response) {
        const data = {
          amount: response.amount,
          createdAt: response.createdAt,
          currency: response.currency,
          interval: response.interval,
          maxAmount: response.maxAmount,
          minAmount: response.minAmount,
          name: response.name,
          period: response.period,
          planId: response.planId,
        };
        const productIds = response.productIds;
        const standards = response.standards;

        const subjectResponse = await getSubjectData();
        const classResponse = await getClassData();

        const subjectMap = subjectResponse.reduce((acc, subject) => {
          acc[subject._id] = subject.name;
          return acc;
        }, {});
        // const productIdss = [
        //   "675292de16d1a29dd65def0a",
        //   "675300e0e782ea8d9e44eebf",
        //   "675304cee782ea8d9e44ef0f",
        // ];

        const classMap = classResponse.reduce((acc, classItem) => {
          acc[classItem._id] = classItem.name;
          return acc;
        }, {});

        const className = classMap[standards];

        const productNamesArray = productIds.map((productId) => {
          const name = subjectMap[productId];
          return name || "Unknown Subject";
        });

        const productNames = productNamesArray.join(", ");

        data.productIds = productNames;
        data.standards = className;

        setHeaders(Object.keys(data));
        setTableData([data]);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      setError(err.message);
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

  const fetchPlans = async (courseId) => {
    try {
      const response = await getPlansByCourseId(courseId);

      if (response && Array.isArray(response)) {
        const subscriptionDataArray = await Promise.all(
          response.map(
            async ({
              amount,
              createdAt,
              currency,
              interval,
              maxAmount,
              minAmount,
              name,
              period,
              planId,
              productIds,
              standards,
            }) => {
              const subjectResponse = await getSubjectData();
              const classResponse = await getClassData();

              const subjectMap = subjectResponse.reduce((acc, subject) => {
                acc[subject._id] = subject.name;
                return acc;
              }, {});
              //   const productIdss = ["675292de16d1a29dd65def0a","675300e0e782ea8d9e44eebf","675304cee782ea8d9e44ef0f"]

              const classMap = classResponse.reduce((acc, classItem) => {
                acc[classItem._id] = classItem.name;
                return acc;
              }, {});

              const className = classMap[standards];

              const productNamesArray = productIds.map(
                (productId) => subjectMap[productId] || "Unknown Subject"
              );

              const productNames = productNamesArray.join(", ");

              return {
                amount,
                createdAt,
                currency,
                interval,
                maxAmount,
                minAmount,
                name,
                period,
                planId,
                productNames,
                className,
              };
            }
          )
        );

        if (subscriptionDataArray.length > 0) {
          setHeaders(Object.keys(subscriptionDataArray[0]));
          setTableData(subscriptionDataArray);
        } else {
          throw new Error("No data found in response");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <Input value={planId} onChange={setPlanId} placeholder="Enter Plan ID" />
      <Button onClick={handlePlanByIdClick} variant="primary">
        Search
      </Button>
      <Dropdown
        options={courses}
        value={selectedCourse}
        onChange={handleCourseChange}
        placeholder="Search"
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
            </Box>
          );
        }}
      />

      <h1>Plans List</h1>
      {tableData.length > 0 ? (
        <Table headers={headers} data={tableData} />
      ) : (
        <p>No Plan Available</p>
      )}
    </div>
  );
}

export default PlanPage;
