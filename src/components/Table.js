import React from "react";

const Table = ({ headers, data }) => {
  return (
    <table
      style={{ borderCollapse: "collapse", width: "100%", textAlign: "left" }}
    >
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#f2f2f2",
                fontWeight: "bold",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, colIndex) => (
              <td
                key={colIndex}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                {row[header] !== null ? row[header] : "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
