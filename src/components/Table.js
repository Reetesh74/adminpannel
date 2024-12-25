import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  [`&.${TableCell.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const MyTable = ({
  headers,
  data,
  headerStyles = {},
  tableStyles = {},
  rowStyles = {},
  cellStyles = {},
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "16px",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px",
        borderBottomLeftRadius: "0",
        borderBottomRightRadius: "0",
        ...tableStyles,
      }}
    >
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headers.map(({ key, label }) => (
              <StyledTableCell
                key={key}
                align="left"
                sx={{
                  ...headerStyles,
                  ...cellStyles,
                }}
              >
                {label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <StyledTableRow key={rowIndex} sx={rowStyles}>
              {headers.map(({ key }) => (
                <StyledTableCell key={key} align="left" sx={cellStyles}>
                  {row[key] !== null ? row[key] : "-"}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTable;
