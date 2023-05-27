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
import { Contest } from "../../models/Contest";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios, { AxiosError } from "axios";
import { debounce } from "lodash";
import { SnackbarContext } from "../SnackbarContext";
import { getAuthToken } from "../../auth";

export const ContestAdd = () => {
	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);
	const [course, setCourse] = useState<Contest>({
		datetime: "",
		name: "",
		location: "",	
		coachid: 0,
		bodybuilderid: 0
	});

	const addCourse = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios
				.post(`${BACKEND_API_URL}/api/BodyBuilders/contest`, course, {
					headers: {
						Authorization: `Bearer ${getAuthToken()}`,
					},
				})
				.then(() => {
					openSnackbar("success", "Contest added successfully!");
					navigate("/contests");
				})
				.catch((reason: AxiosError) => {
					console.log(reason.message);
					openSnackbar(
						"error",
						"Failed to add contests!\n" +
						(String(reason.response?.data).length > 255
							? reason.message
							: reason.response?.data)
					);
				});
		} catch (error) {
			console.log(error);
			openSnackbar(
				"error",
				"Failed to add contests due to an unknown error!"
			);
		}
	};

	
	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 5 }} to={`/contests`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addCourse}>
						<TextField
							id="Datetime"
							label="Datetime"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Datetime: event.target.value })}
						/>
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
							id="CoachId"
							label="CoachId"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, CoachId: Number(event.target.value) })}
						/>
						<TextField
							id="BodybuilderId"
							label="BodybuilderId"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, BodybuilderId: Number(event.target.value) })}
						/>
						<Button type="submit">Add contest</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};
