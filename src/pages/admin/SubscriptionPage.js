import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { getAllSubscription, getSubsubscriptionById } from "../../utils/api";

function SubscriptionPage() {
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSubscriptionID, setSearchSubscriptionID] = useState("");
  const [pageSize, setPageSize] = useState(2);
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
            (item) => item.subscriptionData
          );

          if (subscriptionDataArray.length > 0) {
            setHeaders(Object.keys(subscriptionDataArray[0]));
          }

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
          <Table headers={headers} data={tableData} />
          <div>
            <p>Total Subscriptions: {totalSubscriptions}</p>
            <p>Total Pages: {totalPages}</p>
          </div>
          <label>
            Page Size:{" "}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
          <label>
            Page Number:{" "}
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default SubscriptionPage;
