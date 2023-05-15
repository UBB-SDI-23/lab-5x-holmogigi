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
import { Bodybuilder } from "../../models/Bodybuilder";
import { BACKEND_API_URL } from "../../constants";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const CourseEdit = () => {
    const navigate = useNavigate();
    const openSnackbar = useContext(SnackbarContext);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();
    const [courses, setCourses] = useState<Bodybuilder>({
        name: "",
        age: 0,
        weight: 0,
        height: 0,
        division: "",
    });

 
    const fetchEmployee = async () => {
        setLoading(true);
        try {
            await axios
                .get<Bodybuilder>(
                    `${BACKEND_API_URL}/api/Bodybuilders/${courseId}`,
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
                        "Failed to fetch bodybuilder details!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to fetch bodybuilder details due to an unknown error!"
            );
        }
    };
 
   

    const handleUpdate = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        try {
            await axios
                .put(
                    `${BACKEND_API_URL}/api/Bodybuilders/${courseId}`,
                    courses,
                    {
                        headers: {
                            Authorization: `Bearer ${getAuthToken()}`,
                        },
                    }
                )
                .then(() => {
                    openSnackbar("success", "Bodybuilder updated successfully!");
                    navigate("/courses");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to update bodybuilder!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to update bodybuilder due to an unknown error!"
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