import {
    CircularProgress,
    Container,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Button,
    Box,
    TextField,
} from "@mui/material";

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import axios, { AxiosError } from "axios";
import { SnackbarContext } from "../SnackbarContext";
import { getAccount, getAuthToken } from "../../auth";
import { AccessLevel, User } from "../../models/User";

import AddIcon from "@mui/icons-material/Add";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export const AllUsers = () => {
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
    const [pageIndex, setPageIndex] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            await axios
                .get<User[]>(
                    `${BACKEND_API_URL}/api/Users/${pageIndex}/${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const data = response.data;
                    setUsers(data);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch users!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch users due to an unknown error!"
            );
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pageIndex, pageSize]);

    function handleNextPage() {
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
    }

    function handlePrevPage() {
        setPageIndex((prevPageIndex) => prevPageIndex - 1);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        // TODO: this function
        const value = event.target.value;
        const intValue = parseInt(value, 10);

        if (intValue > 0) {
            setPageIndex(intValue - 1);
        }
    }

    function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        // TODO: this function
        if (event.key === "Enter") {
            setPageIndex(0);
        }
    }

    return (
        <Container>
            <h1
                style={{
                    paddingTop: 26,
                    marginBottom: 4,
                    textAlign: "center",
                }}
            >
                All Users
            </h1>

            {loading && <CircularProgress />} 
            {!loading && users.length === 0 && (
                <p style={{ marginLeft: 16 }}>No users found.</p>
            )}
            {!loading && users.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ userSelect: "none" }}>
                                    #
                                </TableCell>
                                <TableCell align="left">User</TableCell>
                                <TableCell align="left">Access Level</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell component="th" scope="row">
                                        {pageIndex * pageSize + index + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                        {user.name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {user.accessLevel !== undefined
                                            ? AccessLevel[user.accessLevel]
                                            : "Unknown"}
                                    </TableCell>

                                    <IconButton
                                        component={Link}
                                        sx={{ mr: 3 }}
                                        to={`/users/${user.id}/details`}>
                                        <Tooltip title="View user details" arrow>
                                            <ReadMoreIcon color="primary" />
                                        </Tooltip>
                                    </IconButton>

                                    <IconButton
                                        component={Link}
                                        sx={{ mr: 3 }}
                                        to={`/users/${user.id}/edit`} 
                                    >
                                        <Tooltip
                                            title="Edit user"
                                            arrow
                                        >
                                            <EditIcon />
                                        </Tooltip>
                                    </IconButton>

                                    <IconButton
                                        component={Link}
                                        to={`/users/${user.id}/delete`}
                                        sx={{
                                            color: "red",
                                        }}
                                    >
                                        <Tooltip
                                            title="Delete user"
                                            arrow
                                        >
                                            <DeleteForeverIcon />
                                        </Tooltip>
                                    </IconButton>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {!loading && users.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 16,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handlePrevPage}
                        disabled={pageIndex === 0}
                    >
                        &lt;
                    </Button>
                    <p
                        style={{
                            marginLeft: 16,
                            marginRight: 8,
                        }}
                    >
                    </p>
                    <TextField
                        value={pageIndex + 1}
                        type="text"
                        inputProps={{ min: 1, style: { textAlign: "center" } }}
                        onChange={handleInputChange}
                        onKeyPress={handleInputKeyPress}
                        variant="outlined"
                        size="small"
                        style={{
                            width: 100,
                            marginRight: 16,
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                    >
                        &gt;
                    </Button>
                </div>
            )}
        </Container>
    );
};