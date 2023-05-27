import {
	Autocomplete,
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Gym } from "../../models/Gym";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { debounce } from "lodash";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const GymAdd = () => {
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);
	const [course, setCourse] = useState<Gym>({
		name: "",
		location: "",
		memembership: 1,
		grade: 1,
	});

	const addCourse = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios
				.post(`${BACKEND_API_URL}/api/Gym/`, course, {
					headers: {
						Authorization: `Bearer ${getAuthToken()}`,
					},
				})
				.then(() => {
					openSnackbar("success", "Gym added successfully!");
					navigate("/contests");
				})
				.catch((reason: AxiosError) => {
					console.log(reason.message);
					openSnackbar(
						"error",
						"Failed to add gym!\n" +
						(String(reason.response?.data).length > 255
							? reason.message
							: reason.response?.data)
					);
				});
		} catch (error) {
			console.log(error);
			openSnackbar(
				"error",
				"Failed to add gym due to an unknown error!"
			);
		}
	};

	
	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 5 }} to={`/gyms`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addCourse}>
						<TextField
							id="Name"
							label="Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Name: event.target.value })}
						/>
						<TextField
							id="Location"
							label="Location"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Location: event.target.value })}
						/>
						<TextField
							id="Memembership"
							label="Memembership"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Memembership: Number(event.target.value) })}
						/>
						<TextField
							id="Grade"
							label="Grade"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Grade: Number(event.target.value) })}
						/>
						
						<Button type="submit">Add gym</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};
