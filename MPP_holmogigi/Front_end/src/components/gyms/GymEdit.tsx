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
import { Gym } from "../../models/Gym";
import { BACKEND_API_URL } from "../../constants";

export const GymEdit = () => {
    const [loading, setLoading] = useState(false);
    const { courseId } = useParams();
    const [courses, setCourses] = useState<Gym>({
        Name: "",
        Location: "",
        Memembership: 1,
        Grade: 1,
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(`${BACKEND_API_URL}/api/Gym/${courseId}`);
            const courses = await response.json();
            setCourses({
                id: courses.id,
                name: courses.name,
                location: courses.location,
                memembership: courses.memembership,
                grade: courses.grade,
            });
            setLoading(false);
        };
        fetchEmployee();
    }, [courseId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/api/Gym/${courseId}`, courses)
                .then(() => {
                    alert("Gym updated successfully!");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    alert("Failed to update gym!");
                });
        } catch (error) {
            console.log(error);
            alert("Failed to update coach!");
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