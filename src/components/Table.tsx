import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import checked from "../components/icon/checked.svg";
import checkMark from "../components/icon/check-mark.svg";

export default function BasicTable({
  data,
  total,
  onClick,
}: {
  data: any[];
  total: number;
  onClick: any;
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            {data.map((item, index) => {
              item.amount = parseFloat(item.amount);
              return (
                <TableRow
                  key={index}
                  onClick={() => onClick(item)}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                >
                  <TableCell align="left">{item.name}</TableCell>
                  <TableCell align="left">
                    {item.amount.toLocaleString()}đ
                  </TableCell>
                  <TableCell align="center">
                    <img
                      className="check"
                      width={15}
                      src={item.amount <= total ? checked : checkMark}
                      alt=""
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
