import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    IconButton,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Gym } from "../../models/Gym";
import { BACKEND_API_URL } from "../../constants";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const GymEdit = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();
    const [courses, setCourses] = useState<Gym>({
        name: "",
        location: "",
        memembership: 1,
        grade: 1,
    });

    const fetchEmployee = async () => {
        setLoading(true);
        try {
            await axios
                .get<Gym>(
                    `${BACKEND_API_URL}/api/Gym/${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then((response) => {
                    const employee = response.data;
                    setCourses(employee);
                    setLoading(false);
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to fetch gym details!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch gym details due to an unknown error!"
            );
        }
    };



    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/api/Gym/${courseId}`,
                    courses,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Gym updated successfully!");
                    navigate("/courses");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update gym!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update gym due to an unknown error!"
            );
        }
    };

    
    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/gyms`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={handleUpdate}>
                        <TextField
                            id="Name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Name: event.target.value })}
                        />
                        <TextField
                            id="Location"
                            label="Location"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Location: event.target.value })}
                        />
                        <TextField
                            id="Memembership"
                            label="Memembership"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Memembership: Number(event.target.value) })}
                        />
                        <TextField
                            id="Grade"
                            label="Grade"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Grade: Number(event.target.value) })}
                        />

                    </form>
                </CardContent>
                <CardActions>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Button type="submit" onClick={handleUpdate} variant="contained">
                            Update
                        </Button>
                    </CardActions>
                </CardActions>
            </Card>
        </Container>
    );
};