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
import { Contest } from "../../models/Contest";
import { BACKEND_API_URL } from "../../constants";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const ContestEdit = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();
    const { courseId2 } = useParams();
    const [courses, setCourses] = useState<Contest>({
        datetime: "",
        name: "",
        location: "",
        coachid: 0,
        bodybuilderid: 0
    });

    const fetchEmployee = async () => {
        setLoading(true);
        try {
            await axios
                .get<Contest>(
                    `${BACKEND_API_URL}/api/BodyBuilders/${courseId},${courseId2}/contest`,
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
                        "Failed to fetch contest details!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch contest details due to an unknown error!"
            );
        }
    };


    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/api/BodyBuilders/${courseId},${courseId2}/contest`,
                    courses,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Contest updated successfully!");
                    navigate("/contests");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update contest!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update contest due to an unknown error!"
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
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/coaches`}>
                        <ArrowBackIcon />
                    </IconButton>{" "}
                    <form onSubmit={handleUpdate}>
                        <TextField
                            id="Datetime"
                            label="Datetime"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Datetime: event.target.value })}
                        />
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
                            id="CoachId"
                            label="CoachId"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, CoachId: Number(event.target.value) })}
                        />
                        <TextField
                            id="BodybuilderId"
                            label="BodybuilderId"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, BodybuilderId: Number(event.target.value) })}
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