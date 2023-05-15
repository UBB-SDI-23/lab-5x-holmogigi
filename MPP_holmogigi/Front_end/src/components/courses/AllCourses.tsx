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
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { Bodybuilder } from "../../models/Bodybuilder";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { SnackbarContext } from "../SnackbarContext";
import { getAccount, getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";

export const AllCourses = () => {
	const openSnackbar = useContext(SnackbarContext);
	const [loading, setLoading] = useState(true);
	const [courses, setCourses] = useState<Bodybuilder[]>([]);

	const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
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

	const fetchEmployees = async () => {
		setLoading(true);
		try {
			await axios
				.get<Bodybuilder[]>(
					`${BACKEND_API_URL}/api/BodyBuilders/${pageIndex}/${pageSize}`,
					{
						headers: {
							Authorization: `Bearer ${getAuthToken()}`,
						},
					}
				)
				.then((response) => {
					const data = response.data;
					setCourses(data);
					setLoading(false);
				})
				.catch((reason: AxiosError) => {
					console.log(reason.message);
					openSnackbar(
						"error",
						"Failed to fetch bodybuilders!\n" +
						(String(reason.response?.data).length > 255
							? reason.message
							: reason.response?.data)
					);
				});
		} catch (error) {
			console.log(error);
			openSnackbar(
				"error",
				"Failed to fetch contests due to an unknown error!"
			);
		}
	};

	
	useEffect(() => {
		fetchEmployees();
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
			{!loading && (
				<Button
					title="Add a new bodybuilder"
					component={Link}
					to={`/courses/add`}
					disabled={getAccount() === null}
					variant="text"
					size="large"
					sx={{ mr: 3, mb: 2, textTransform: "none" }}
					startIcon={<AddIcon />}
				>
				</Button>
			)}
			{!loading && courses.length === 0 && <p> No bodybuilders found</p>}
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

									<IconButton
										component={Link}
										sx={{ mr: 3 }}
										to={`/courses/${course.id}/edit`}
										disabled={
											!isAuthorized(
												course.user?.id
											)
										}
									>
										<Tooltip
											title="Edit bodybuilder"
											arrow
										>
											<EditIcon />
										</Tooltip>
									</IconButton>

									<IconButton
										component={Link}
										to={`/courses/${course.id}/delete`}
										disabled={
											!isAuthorized(
												course.user?.id
											)
										}
										sx={{
											color: "red",
										}}
									>
										<Tooltip
											title="Delete bodybuilder"
											arrow
										>
											<DeleteForeverIcon />
										</Tooltip>
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


	
