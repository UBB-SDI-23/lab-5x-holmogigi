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
import { Coach } from "../../models/Coach";
import { BACKEND_API_URL } from "../../constants";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const CoachEdit = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();
    const [courses, setCourses] = useState<Coach>({
        name: "",
        age: 1,
        rate: 1,
        gymId: 1
    });

    const fetchEmployee = async () => {
            setLoading(true);
        try {
            await axios
                .get<Coach>(
                    `${BACKEND_API_URL}/api/Coach/${courseId}`,
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
                        "Failed to fetch employee details!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch employee details due to an unknown error!"
            );
        }
    };


    useEffect(() => {
        fetchEmployee();
    }, [courseId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/api/Coach/${courseId}`,
                    courses,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Coach updated successfully!");
                    navigate("/coaches");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update coach!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update coach due to an unknown error!"
            );
        }
    };


    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();
        navigate("/coaches");
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/coaches`}>
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
                            id="Age"
                            label="Age"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Age: Number(event.target.value) })}
                        />
                        <TextField
                            id="Rate"
                            label="Rate"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Rate: Number(event.target.value) })}
                        />
                        <TextField
                            id="gymId"
                            label="gymId"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, gymId: Number(event.target.value) })}
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