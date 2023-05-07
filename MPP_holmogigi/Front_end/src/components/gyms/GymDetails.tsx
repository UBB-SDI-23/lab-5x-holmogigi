import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Gym } from "../../models/Gym";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const GymDetails = () => {
	const { courseId } = useParams();
	const [course, setCourse] = useState<Gym>();

	useEffect(() => {
		const fetchCourse = async () => {
			const response = await fetch(`${BACKEND_API_URL}/api/Gym/${courseId}`);
			const course = await response.json();
			setCourse(course);
		};
		fetchCourse();
	}, [courseId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/gyms`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>Gym Details</h1>
					<p>Name: {course?.name}</p>
					<p>Location: {course?.location}</p>
					<p>Membership: {course?.memembership}</p>
					<p>Grade: {course?.grade}</p>
					<p>Coaches:</p>
					<ul>
						{course?.coaches?.length ? (
							<ul style={{ marginBottom: 0 }}>
								{course?.coaches?.map((coach) => (
									<li key={coach.id}>
										Name: {coach.name} {"  ||  "}
										 Age: {coach.age} {"  ||  "}
										 Rate: {coach.rate}
									</li>
								))}
							</ul>
						) : (
							<ul style={{ marginBottom: 0 }}>
								<li>N/A</li>
							</ul>
						)}
					</ul>
					<p>UserId: {course?.userId}</p>
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/gyms/${courseId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/gyms/${courseId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};
