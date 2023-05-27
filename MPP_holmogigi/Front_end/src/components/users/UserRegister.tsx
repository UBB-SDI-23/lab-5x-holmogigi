import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Autocomplete,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_API_URL, formatDate} from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { UserRegisterDTO } from "../../models/UserRegisterDTO";
import { debounce } from "lodash";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken, logOut } from "../../auth";

export const UserRegister = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);

    const [user, setUser] = useState<UserRegisterDTO>({
        name: "",
        password: "",

        bio: "",
        location: "",

        birthday: "",
        gender: "",
        maritalStatus: "",
    });

    useEffect(() => {
        logOut();
    }, []);

    const addRole = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .post(`${BACKEND_API_URL}/api/Users/register`, user, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then((response) => {
                    console.log(response);
                    const token = response.data.token;

                    const expirationDateTime = new Date(
                        response.data.expiration
                    );
                    const expirationInMinutes = Math.floor(
                        (expirationDateTime.getTime() -
                            new Date().getTime() +
                            1000 * 59) /
                        (1000 * 60)
                    );

                    openSnackbar(
                        "success",
                        "Registered successfully!" +
                        "\n" +
                        "Please confirm your account using this code: " +
                        token +
                        "\n" +
                        `This code will expire in ${expirationInMinutes} minutes at ${formatDate(
                            expirationDateTime
                        )}.`
                    );
                    navigate(`/users/register/confirm/${token}`);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to register!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to register due to an unknown error!"
            );
        }
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 5 }} to={`/`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={addRole}>
                        <TextField
                            id="Name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUser({ ...user, name: event.target.value })}
                        />
                        <TextField
                            id="Password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUser({ ...user, password: event.target.value })}
                        />

                        <TextField
                            id="Bio"
                            label="Bio"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUser({ ...user, bio: event.target.value })}
                        />

                        <TextField
                            id="Location"
                            label="Location"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUser({ ...user, location: event.target.value })}
                        />

                        <TextField
                            id="Birthday"
                            label="Birthday"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUser({ ...user, birthday: event.target.value })}
                        />

                        <TextField
                            id="Gender"
                            label="Gender"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUser({ ...user, gender: event.target.value })}
                        />

                        <TextField
                            id="MaritalStatus"
                            label="MaritalStatus"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUser({ ...user, maritalStatus: event.target.value })}
                        />
                        <Button type="submit">Register</Button>
                    </form>
                </CardContent>
                <CardActions></CardActions>
            </Card>
        </Container>
    );
};