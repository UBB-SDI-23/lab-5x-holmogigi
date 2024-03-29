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
import { BACKEND_API_URL } from "../../constants";
import { Bodybuilder } from "../../models/Bodybuilder";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

export const AllCourses = () => {
	const [loading, setLoading] = useState(false);
	const [courses, setCourses] = useState<Bodybuilder[]>([]);

	const pageSize = 5;
	const [pageIndex, setPageIndex] = useState(0);
	const [hasNextPage, setHasNextPage] = useState(true);

	const [sorting, setSorting] = useState({
		key: "name",
		ascending: true,
	});

	function applySorting(key: string, ascending: boolean) {
		setSorting({ key: key, ascending: ascending });
	}

	useEffect(() => {
		if (courses.length === 0) {
			return;
		}

		const currentEmployees = [...courses];

		const sortedCurrentUsers = currentEmployees.sort((a, b) => {
			return a[sorting.key].localeCompare(b[sorting.key]);
		});

		setCourses(
			sorting.ascending ? sortedCurrentUsers : sortedCurrentUsers.reverse()
		);
	}, [sorting]);


	function fetchBodybuilders(page: number): Promise<Bodybuilder[]> {
		return fetch(`${BACKEND_API_URL}/api/BodyBuilders/${page}/${pageSize}`).then((response) => response.json());
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
		// TODO: this function
		const value = event.target.value;
		const intValue = parseInt(value, 10);

		if (intValue > 0) {
			setPageIndex(intValue - 1);
		}
	}

	function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		// TODO: this function
		if (event.key === "Enter") {
			setPageIndex(0);
		}
	}


	return (
		<Container>
			<h1>All bodybuilders</h1>

			{loading && <CircularProgress />}
			{!loading && courses.length === 0 && <p> No bodybuilders found</p>}
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
								<TableCell
									align="left"
									style={{ cursor: "pointer" }}
									onClick={() => applySorting("name", !sorting.ascending)}
								>
								 Name
								</TableCell>
								<TableCell align="left">Age</TableCell>
								<TableCell align="left">Weight</TableCell>
								<TableCell align="left">Height</TableCell>
								<TableCell align="left">Division</TableCell>
								<TableCell align="left">Added by</TableCell>
	
							</TableRow>
						</TableHead>
						<TableBody>
							{courses.map((course, index) => (
								<TableRow key={course.id}>
									<TableCell component="th" scope="row">
										{pageIndex * pageSize + index + 1}
									</TableCell>
									<TableCell align="left">{course.name}</TableCell>
									<TableCell align="left">{course.age}</TableCell>
									<TableCell align="left">{course.weight}</TableCell>
									<TableCell align="left">{course.height}</TableCell>
									<TableCell align="left">{course.division}</TableCell>
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
											to={`/courses/${course.id}/details`}>
											<Tooltip title="View bodybuilder details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/courses/${course.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/courses/${course.id}/delete`}>
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


	
