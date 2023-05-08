import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Coach } from "../../models/Coach";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const CoachDetails = () =>
{
	const { courseId } = useParams();
	const [course, setCourse] = useState<Coach>();

	useEffect(() => {
		const fetchCourse = async () => {
			const response = await fetch(`${BACKEND_API_URL}/api/Coach/${courseId}`);
			const course = await response.json();
			setCourse(course);
		};
		fetchCourse();
	}, [courseId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/coaches`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>Coach Details</h1>
					<p>Name: {course?.name}</p>
					<p>Age: {course?.age}</p>
					<p>Rate: {course?.rate}</p>
					<p>GymId: {course?.gymId}</p>
					<p>Gym:</p>
					<ul>
						<li>Name: {course?.gym?.name}</li>
						<li>Location: {course?.gym?.location}</li>
						<li>Membership: {course?.gym?.memembership}</li>
						<li>Grade: {course?.gym?.grade}</li>
					</ul>
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/coaches/${courseId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/coaches/${courseId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};
