import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { BACKEND_API_URL } from "../../constants";
import { useContext } from "react";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const CoachDelete = () => {
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);
	const { courseId } = useParams();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
        try {
            await axios
                .delete(`${BACKEND_API_URL}/api/Coach/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                })
                .then(() => {
                    openSnackbar("success", "Employee deleted successfully!");
                    navigate("/coaches");
                })
                .catch((reason: AxiosError) => {
                    console.log(reason.message);
                    openSnackbar(
                        "error",
                        "Failed to delete employee!\n" +
                        (String(reason.response?.data).length > 255
                            ? reason.message
                            : reason.response?.data)
                    );
                });
        } catch (error) {
            console.log(error);
            openSnackbar(
                "error",
                "Failed to delete employee due to an unknown error!"
            );
        }
    };

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		// go to courses list
		navigate("/coaches");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/coaches`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this coach? This cannot be undone!
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete it</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};
