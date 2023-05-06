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
import { Bodybuilder } from "../../models/Bodybuilder";
import { BACKEND_API_URL } from "../../constants";

export const CourseEdit = () => {
    const [loading, setLoading] = useState(false);
    const { courseId } = useParams();
    const [courses, setCourses] = useState<Bodybuilder>({
        name: "",
        age: 0,
        weight: 0,
        height: 0,
        division: "",
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            const response = await fetch(`${BACKEND_API_URL}/api/BodyBuilders/${courseId}`);
            const courses = await response.json();
            setCourses({
                id: courses.id,
                name: courses.name,
                age: courses.age,
                weight: courses.weight,
                height: courses.height,
                division: courses.division,
            });
            setLoading(false);
        };
        fetchEmployee();
    }, [courseId]);

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(`${BACKEND_API_URL}/api/BodyBuilders/${courseId}`, courses)
                .then(() => {
                    alert("Bodybuilder updated successfully!");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    alert("Failed to update bodybuilder!");
                });
        } catch (error) {
            console.log(error);
            alert("Failed to update bodybuilder!");
        }
    };

    const handleCancel = (event: { preventDefault: () => void }) => {
        event.preventDefault();  
    };

    return (
        <Container>
            <Card>
                <CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/courses`}>
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
                            id="Weight"
                            label="Weight"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Weight: Number(event.target.value) })}
                        />
                        <TextField
                            id="Height"
                            label="Height"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Height: Number(event.target.value) })}
                        />

                        <TextField
                            id="Division"
                            label="Division"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setCourses({ ...courses, Division: event.target.value })}
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