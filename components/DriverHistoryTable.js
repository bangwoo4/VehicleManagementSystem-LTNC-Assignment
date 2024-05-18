import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const DriverHistoryTable = () => {
  return (
    <table border="1">
      <tr>
        <th></th>
        <th>Column Header 1</th>
        <th>Column Header 2</th>
        <th>Column Header 3</th>
      </tr>
      <tr>
        <th>Row Header 1</th>
        <td>Data</td>
        <td>Data</td>
        <td>Data</td>
      </tr>
      <tr>
        <th>Row Header 2</th>
        <td>Data</td>
        <td>Data</td>
        <td>Data</td>
      </tr>
      <tr>
        <th>Row Header 3</th>
        <td>Data</td>
        <td>Data</td>
        <td>Data</td>
      </tr>
    </table>
  );
};

export default DriverHistoryTable;
