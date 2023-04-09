import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	CircularProgress,
	Container,
	IconButton,
	Tooltip,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Bodybuilder } from "../../models/Bodybuilder";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

export const AllCourses = () => {
	const [loading, setLoading] = useState(false);
	const [courses, setCourses] = useState<Bodybuilder[]>([]);

	useEffect(() => {
		setLoading(true);
		fetch(`${BACKEND_API_URL}/api/BodyBuilders`)
			.then((response) => response.json())
			.then((data) => {
				setCourses(data);
				setLoading(false);
			});
	}, []);


	return (
		<Container>
			<h1>All bodybuilders</h1>

			{loading && <CircularProgress />}
			{!loading && courses.length === 0 && <p>No bodybuilders found</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/courses/add`}>
					<Tooltip title="Add a new bodybuilder" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}
			{!loading && courses.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left">Name</TableCell>
								<TableCell align="left">Age</TableCell>
								<TableCell align="left">Weight</TableCell>
								<TableCell align="left">Height</TableCell>
								<TableCell align="left">Division</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{courses.map((course, index) => (
								<TableRow key={course.id}>
									<TableCell component="th" scope="row">
										{index + 1}
									</TableCell>
									<TableCell align="right">{course.Name}</TableCell>
									<TableCell align="right">{course.Age}</TableCell>
									<TableCell align="right">{course.Weight}</TableCell>
									<TableCell align="right">{course.Height}</TableCell>
									<TableCell align="right">{course.Division}</TableCell>
									<TableCell align="right">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/courses/${course.id}/details`}>
											<Tooltip title="View course details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/courses/${course.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/courses/${course.id}/delete`}>
											<DeleteForeverIcon sx={{ color: "red" }} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
};
