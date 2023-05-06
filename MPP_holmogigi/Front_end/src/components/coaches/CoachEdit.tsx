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
import { Coach } from "../../models/Coach";
import { BACKEND_API_URL } from "../../constants";

export const CoachEdit = () => {
    const [loading, setLoading] = useState(false);
    const { courseId } = useParams();
    const [courses, setCourses] = useState<Coach>({
        name: "",
        age: 1,
        rate: 1,
        gymId: 1
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(`${BACKEND_API_URL}/api/Coach/${courseId}`);
            const courses = await response.json();
            setCourses({
                id: courses.id,
                name: courses.name,
                age: courses.age,
                rate: courses.rate,
                gymId: courses.gymid,
            });
            setLoading(false);
        };
        fetchEmployee();
    }, [courseId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/api/Coach/${courseId}`, courses)
                .then(() => {
                    alert("Coach updated successfully!");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    alert("Failed to update coach!");
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