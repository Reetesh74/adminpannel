import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import { getAllSubscription, getSubsubscriptionById } from "../../utils/api";

function SubscriptionPage() {
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSubscriptionID, setSearchSubscriptionID] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSubscription(currentPage, pageSize);
        console.log("total count ", response.totalCount);

        setTotalSubscriptions(response.totalCount);
        setTotalPages(Math.ceil(response.totalCount / pageSize));

        if (response.data) {
          const subscriptionDataArray = response.data.map(
            ({
              _id,
              planId,
              user,
              subscriptionId,
              status,
              subscriptionData: { created_at, expire_by },
            }) => {
              const createdAtDate = new Date(
                created_at * 1000
              ).toLocaleString();
              const expireByDate = expire_by
                ? new Date(expire_by * 1000).toLocaleString()
                : "N/A";

              return {
                _id,
                planId,
                user,
                subscriptionId,
                status,
                created_at: createdAtDate,
                expire_by: expireByDate,
              };
            }
          );

          if (subscriptionDataArray.length > 0) {
            const customHeaders = {
              user: "User",
              subscriptionId: "Subscription Id",
              _id: "ID",
              planId: "Plan ID",
              status: "Status",
              created_at: "Created At",
              expire_by: "Expire By",
            };

            const displayedHeaders = Object.keys(subscriptionDataArray[0]).map(
              (key) => ({
                key,
                label: customHeaders[key] || key,
              })
            );

            setHeaders(displayedHeaders);
          }

          console.log("subscriptionDataArray", subscriptionDataArray);
          setTableData(subscriptionDataArray);
          setLoading(false);
        } else {
          throw new Error("No data found in response");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handleSubscriptionClick = async () => {
    setLoading(true);
    try {
      const response = await getSubsubscriptionById(searchSubscriptionID);

      if (response && Array.isArray(response)) {
        const subscriptionDataArray = response.map(
          (item) => item.subscriptionData
        );

        if (subscriptionDataArray.length > 0) {
          console.log("All Subscription Data:", subscriptionDataArray);

          setHeaders(Object.keys(subscriptionDataArray[0]));

          setTableData(subscriptionDataArray);
          setLoading(false);
        } else {
          setError("No subscription data found");
          setLoading(false);
        }
      } else {
        setError("Invalid response format");
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const tableStyles = { border: "1px solid #E2E8F0", borderRadius: "10px" };
  const rowStyles = {
    "&:nth-of-type(even)": { backgroundColor: "#FEF4FF" },
    "&:nth-of-type(odd)": {
      backgroundColor: "#FFFFFF",
    },
  };
  const cellStyles = {
    // fontSize: "16px",
    // fontWeight: "bold",
  };
  const dynamicHeaderStyles = {
    backgroundColor: "#E2E8F0",
    fontWeight: "bold",
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setPageSize(newRowsPerPage);
    setCurrentPage(1);
  };

  return (
    <div>
      <div>
        <Input
          value={searchSubscriptionID}
          onChange={setSearchSubscriptionID}
          placeholder="Enter Subscription ID"
        />
        <Button onClick={handleSubscriptionClick} variant="primary">
          Search
        </Button>
      </div>

      <h1>Subscription Data Table</h1>
      {tableData.length > 0 ? (
        <div>
          <Table
            headers={headers}
            data={tableData}
            tableStyles={tableStyles}
            rowStyles={rowStyles}
            cellStyles={cellStyles}
            headerStyles={dynamicHeaderStyles}
          />
        </div>
      ) : (
        <p>No data available</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleRowsPerPageChange}
        tableName="Subscription"
      />
    </div>
  );
}

export default SubscriptionPage;
