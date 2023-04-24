import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TablePagination,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import { INetwork } from "../interfaces/INetwork";

function NetworkList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [networks, setNetworks] = useState<Array<INetwork>>([]);
  const [filteredNetworks, setFilteredNetworks] = useState<Array<INetwork>>([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [stationCount, setStationCount] = useState<number>()

  useEffect(() => {
    axios
      .get("http://localhost:8080/networks")
      .then((response) => {
        setNetworks(response.data);
        setFilteredNetworks(response.data);
      });
  }, []);

  const handleChangePage = (
    event: any,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCountryFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const filterValue = event.target.value.toUpperCase();
    setCountryFilter(filterValue);
    const filteredData = networks.filter((network) => {
      return network.country.toUpperCase().includes(filterValue);
    });
    setFilteredNetworks(filteredData);
  };

  const handleFetchStations = (event: React.FocusEvent<HTMLInputElement>) => {
    const country = event.target.value.toUpperCase();

    axios.get(`http://localhost:8080/stations?country=${country}`).then((res)=>{
      setStationCount(res.data.stationCount)
    })
  };

  return (
    <Paper>
      <TextField
        label="Filter by Country Code"
        variant="outlined"
        value={countryFilter}
        onChange={handleCountryFilterChange}
        onBlur={handleFetchStations}
      />
      {stationCount !== null && (
        <p>There are {stationCount} stations in {countryFilter}</p>
      )}
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNetworks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((network) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={network.id}
                  >
                    <TableCell>{network.name}</TableCell>
                    <TableCell>{network.company}</TableCell>
                    <TableCell>{network.city}</TableCell>
                    <TableCell>{network.country}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
        colSpan={3}
        count={filteredNetworks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default NetworkList;
