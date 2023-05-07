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
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Coach } from "../../models/Coach";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { debounce } from "lodash";

export const CoachAdd = () => {
	const navigate = useNavigate();

	const [course, setCourse] = useState<Coach>({
		name: "",
		age: 1,
		rate: 1,
		gymId: 1
	});

	const addCourse = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_API_URL}/api/Coach`, course);
			navigate("/coaches");
		} catch (error) {
			console.log(error);
			alert("!ERROR! Invalid coach rate (rate>1)!")
		}
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 5 }} to={`/coaches`}>
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
							id="Rate"
							label="Rate"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, Rate: Number(event.target.value) })}
						/>
						<TextField
							id="gymId"
							label="gymId"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setCourse({ ...course, gymId: Number(event.target.value) })}
						/>
						<Button type="submit">Add coach</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};
