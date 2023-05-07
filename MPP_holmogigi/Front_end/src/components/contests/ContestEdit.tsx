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
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { Contest } from "../../models/Contest";
import { BACKEND_API_URL } from "../../constants";

export const ContestEdit = () => {
    const [loading, setLoading] = useState(false);
    const { courseId } = useParams();
    const { courseId2 } = useParams();
    const [courses, setCourses] = useState<Contest>({
        datetime: "",
        name: "",
        location: "",
        coachid: 0,
        bodybuilderid: 0
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(`${BACKEND_API_URL}/api/BodyBuilders/${courseId},${courseId2}/contest`);
            const courses = await response.json();
            setCourses({
                datetime: courses.datetime,
                name: courses.name,
                location: courses.location,
                coachid: courses.coachid,
                bodybuilderid: courses.bodybuilderid,
            });
            setLoading(false);
        };
        fetchEmployee();
    }, [courseId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/api/BodyBuilders/${courseId},${courseId2}/contest`, courses)
                .then(() => {
                    alert("Contest updated successfully!");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    alert("Failed to update contest!");
                });
        } catch (error) {
            console.log(error);
            alert("Failed to update contest!");
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