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
import { Bodybuilder } from "../../models/Bodybuilder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { debounce } from "lodash";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const CourseAdd = () => {
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);
	const [course, setCourse] = useState<Bodybuilder>({
		name: "",
		age: 1,
		weight: 1,
		height: 1,
		division: "",
	});

	const addCourse = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios
				.post(`${BACKEND_API_URL}/api/BodyBuilders`, course, {
					headers: {
						Authorization: `Bearer ${getAuthToken()}`,
					},
				})
				.then(() => {
					openSnackbar("success", "Bodybuilder added successfully!");
					navigate("/contests");
				})
				.catch((reason: AxiosError) => {
					console.log(reason.message);
					openSnackbar(
						"error",
						"Failed to add bodybuilder!\n" +
						(String(reason.response?.data).length > 255
							? reason.message
							: reason.response?.data)
					);
				});
		} catch (error) {
			console.log(error);
			openSnackbar(
				"error",
				"Failed to add bodybuilder due to an unknown error!"
			);
		}
	};


	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 5 }} to={`/courses`}>
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
							id="Age"
							label="Age"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Age: Number(event.target.value) })}
						/>
						<TextField
							id="Weight"
							label="Weight"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Weight: Number(event.target.value) })}
						/>
						<TextField
							id="Height"
							label="Height"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Height: Number(event.target.value) })}
						/>
						<TextField
							id="Division"
							label="Division"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Division: event.target.value })}
						/>

						<Button type="submit">Add bodybuilder</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};
