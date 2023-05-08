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
	Button,
	TextField,
} from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL , formatDate} from "../../constants";
import { Contest } from "../../models/Contest";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

export const AllContests = () => {
	const [loading, setLoading] = useState(false);
	const [courses, setCourses] = useState<Contest[]>([]);

	const pageSize = 5;
	const [pageIndex, setPageIndex] = useState(0);
	const [hasNextPage, setHasNextPage] = useState(true);

	function fetchBodybuilders(page: number): Promise<Contest[]> {
		return fetch(`${BACKEND_API_URL}/api/BodyBuilders/${page}/${pageSize}/contest`).then((response) => response.json());
	}

	/*
	useEffect(() => {
		setLoading(true);
		fetch(`${BACKEND_API_URL}/api/BodyBuilders`)
			.then((response) => response.json())
			.then((data) => {
				setCourses(data);
				setLoading(false);
			});
	}, []);
	*/

	useEffect(() => {
		setLoading(true);

		// TODO: fix redundant request
		fetchBodybuilders(pageIndex)
			.then((data) => {
				setCourses(data);
			})
			.then(() => {
				fetchBodybuilders(pageIndex + 1).then((data) => {
					setHasNextPage(data.length > 0);
					setLoading(false);
				});
			});
	}, [pageIndex, pageSize]);


	function handleNextPage() {
		setPageIndex((prevPageIndex) => prevPageIndex + 1);
	}

	function handlePrevPage() {
		setPageIndex((prevPageIndex) => prevPageIndex - 1);
	}

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		const intValue = parseInt(value, 10);

		if (intValue > 0) {
			setPageIndex(intValue - 1);
		}
	}

	function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			setPageIndex(0);
		}
	}


	return (
		<Container>
			<h1>All contests</h1>

			{loading && <CircularProgress />}
			{!loading && courses.length === 0 && <p> No contests found</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/contests/add`}>
					<Tooltip title="Add a new contest" arrow>
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
								<TableCell align="left">Date and Time</TableCell>
								<TableCell align="left">Name</TableCell>
								<TableCell align="left">Location</TableCell>
								<TableCell align="left">Added by</TableCell>

							</TableRow>
						</TableHead>
						<TableBody>
							{courses.map((course, index) => (
								<TableRow key={course.id}>
									<TableCell component="th" scope="row">
										{pageIndex * pageSize + index + 1}
									</TableCell>
									<TableCell align="left">{formatDate(course.dateTime)}</TableCell>
									<TableCell align="left">{course.name}</TableCell>
									<TableCell align="left">{course.location}</TableCell>
									<TableCell align="left">
										<Link
											to={`/users/${course.user?.id}/details`}
											title="View user details"
										>
											{course.user?.name}
										</Link>
									</TableCell>

									<IconButton
										component={Link}
										sx={{ mr: 3 }}
										to={`/contests/${course.bodybuilderId}/${course.coachId}/details`}>
										<Tooltip title="View contest details" arrow>
											<ReadMoreIcon color="primary" />
										</Tooltip>
									</IconButton>

									<IconButton component={Link} sx={{ mr: 3 }} to={`/contests/${course.bodybuilderId}/${course.coachId}/edit`}>
										<EditIcon />
									</IconButton>

									<IconButton component={Link} sx={{ mr: 3 }} to={`/contests/${course.bodybuilderId}/${course.coachId}/delete`}>
										<DeleteForeverIcon sx={{ color: "red" }} />
									</IconButton>

								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{!loading && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginTop: 16,
					}}
				>
					<Button
						variant="contained"
						onClick={handlePrevPage}
						disabled={pageIndex === 0}
					>
						&lt;
					</Button>
					<p
						style={{
							marginLeft: 16,
							marginRight: 8,
						}}
					>
					</p>
					<TextField
						value={pageIndex + 1}
						type="text"
						inputProps={{ min: 1, style: { textAlign: "center" } }}
						onChange={handleInputChange}
						onKeyPress={handleInputKeyPress}
						variant="outlined"
						size="small"
						style={{
							width: 100,
							marginRight: 16,
						}}
					/>
					<Button
						variant="contained"
						onClick={handleNextPage}
						disabled={!hasNextPage}
					>
						&gt;
					</Button>
				</div>
			)}
		</Container>
	);
};



