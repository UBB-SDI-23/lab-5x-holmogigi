import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL , formatDate} from "../../constants";
import { Contest } from "../../models/Contest";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const ContestDetails = () => {
	const { courseId } = useParams();
	const { courseId2 } = useParams();
	const [course, setCourse] = useState<Contest>();

	useEffect(() => {
		const fetchCourse = async () => {
			const response = await fetch(`${BACKEND_API_URL}/api/BodyBuilders/${courseId},${courseId2}/contest`);
			const course = await response.json();
			setCourse(course);
		};
		fetchCourse();
	}, [courseId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/contests`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>Contest Details</h1>
					<p>Date and time: {formatDate(course?.dateTime)}</p>
					<p>Name: {course?.name}</p>
					<p>Location: {course?.location}</p>
					<p>Coach ID: {course?.coachId}</p>
					<p>Coach:</p>
					<ul>
						<li>Name: {course?.coach?.name}</li>
						<li>Age: {course?.coach?.age}</li>
						<li>Rate: {course?.coach?.rate}</li>
					</ul>

					<p>Bodybuilder ID: {course?.bodybuilderId}</p>
					<p>Bodybuilder:</p>
					<ul>
						<li>Name: {course?.bodybuilder?.name}</li>
						<li>Age: {course?.bodybuilder?.age}</li>
						<li>Weight: {course?.bodybuilder?.weight}</li>
						<li>Height: {course?.bodybuilder?.height}</li>
						<li>Division: {course?.bodybuilder?.division}</li>
					</ul>
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/contests/${courseId}/${courseId2}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/contests/${courseId}/${courseId2}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};
