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
import { BACKEND_API_URL , formatDate} from "../../constants";
import { Contest } from "../../models/Contest";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { SnackbarContext } from "../SnackbarContext";
import { getAccount, getAuthToken, isAuthorized } from "../../auth";
import axios, { AxiosError } from "axios";

export const AllContests = () => {
	const openSnackbar = useContext(SnackbarContext);
	const [loading, setLoading] = useState(true);
	const [courses, setCourses] = useState<Contest[]>([]);

	const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
	const [pageIndex, setPageIndex] = useState(0);
	const [hasNextPage, setHasNextPage] = useState(true);

	const fetchEmployees = async () => {
		setLoading(true);
		try {
			await axios
				.get<Contest[]>(
					`${BACKEND_API_URL}/api/Bodybuilders/${pageIndex}/${pageSize}/contest`,
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
						"Failed to fetch contests!\n" +
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
			{!loading && (
				<Button
					title="Add a new contest"
					component={Link}
					to={`/contests/add`}
					disabled={getAccount() === null}
					variant="text"
					size="large"
					sx={{ mr: 3, mb: 2, textTransform: "none" }}
					startIcon={<AddIcon />}
				>
				</Button>
			)}
			{!loading && courses.length === 0 && <p> No contests found</p>}
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

									<IconButton
										component={Link}
										sx={{ mr: 3 }}
										to={`/contests/${course.bodybuilderId}/${course.coachId}/edit`}
										disabled={
											!isAuthorized(
												course.user?.id
											)
										}
									>
										<Tooltip
											title="Edit employee"
											arrow
										>
											<EditIcon />
										</Tooltip>
									</IconButton>

									<IconButton
										component={Link}
										to={`/contests/${course.bodybuilderId}/${course.coachId}/delete`}
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
											title="Delete employee"
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



