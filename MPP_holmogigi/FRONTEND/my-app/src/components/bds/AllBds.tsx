import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Container,
    IconButton,
    Tooltip,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL, formatDate } from "../../constants";
import { Bodybuilder } from "../../models/BodybuilderRole";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

export const AllEmployees = () => {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<Bodybuilder[]>([]);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/api/BodyBuilders`)
            .then((response) => response.json())
            .then((data) => {
                setEmployees(data);
                setLoading(false);
            });
    }, []); // Update the dependency array to be an empty array


    return (
        <Container>
            <h1>All employees</h1>
            
            {loading && <CircularProgress />}
            {!loading && employees.length === 0 && <p>No employees found</p>}
            {!loading && (
                <IconButton component={Link} sx={{ mr: 3 }} to={`/employees/add`}>
                    <Tooltip title="Add a new employee" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && employees.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Age</TableCell>
                                <TableCell align="left">Weight</TableCell>
                                <TableCell align="left">Height</TableCell>
                                <TableCell align="left">Division</TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee, index) => (
                                <TableRow key={employee.Id}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="left">{employee.Name}</TableCell>
                                    <TableCell align="left">{employee.Age}</TableCell>
                                    <TableCell align="left">{employee.Weight}</TableCell>
                                    <TableCell align="left">{employee.Height}</TableCell>
                                    <TableCell align="left">{employee.Division}</TableCell>           
                                    <TableCell align="left">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/employees/${employee.Id}/details`}
                                        >
                                            <Tooltip title="View employee details" arrow>
                                                <ReadMoreIcon color="primary" />
                                            </Tooltip>
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/employees/${employee.Id}/edit`}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            component={Link}
                                            sx={{ mr: 3 }}
                                            to={`/employees/${employee.Id}/delete`}
                                        >
                                            <DeleteForeverIcon sx={{ color: "red" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};