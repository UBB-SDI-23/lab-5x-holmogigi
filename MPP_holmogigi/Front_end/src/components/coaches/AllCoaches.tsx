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
import { Coach } from "../../models/Coach";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import { getAccount, getAuthToken, isAuthorized } from "../../auth";
import { SnackbarContext } from "../SnackbarContext";
import axios, { AxiosError } from "axios";

export const AllCoaches = () => {
	const openSnackbar = useContext(SnackbarContext);
	const [loading, setLoading] = useState(true);
	const [courses, setCourses] = useState<Coach[]>([]);

	const [pageSize] = useState(getAccount()?.userProfile?.pagePreference ?? 5);
	const [pageIndex, setPageIndex] = useState(0);
	const [totalPages, setTotalPages] = useState(999999);

	const displayedPages = 9;

	let startPage = pageIndex - Math.floor((displayedPages - 3) / 2) + 1;
	let endPage = startPage + displayedPages - 3;

	if (startPage <= 2) {
		startPage = 1;
		endPage = displayedPages - 1;
	} else if (endPage >= totalPages - 1) {
		startPage = totalPages - displayedPages + 2;
		endPage = totalPages;
	}

	function handlePageClick(pageNumber: number) {
		setPageIndex(pageNumber - 1);
	}


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


	function fetchBodybuilders(page: number): Promise<Coach[]> {
		return fetch(`${BACKEND_API_URL}/api/Coach/${page}/${pageSize}`).then((response) => response.json());
	}


	const fetchPageCount = async () => {
		try {
			await axios
				.get<number>(`${BACKEND_API_URL}/api/Coach/count/${pageSize}`, {
					headers: {
						Authorization: `Bearer ${getAuthToken()}`,
					},
				})
				.then((response) => {
					const data = response.data;
					setTotalPages(data);
				})
				.catch((reason: AxiosError) => {
					console.log(reason.message);
					openSnackbar(
						"error",
						"Failed to fetch page count!\n" +
						(String(reason.response?.data).length > 255
							? reason.message
							: reason.response?.data)
					);
				});
		} catch (error) {
			console.log(error);
			openSnackbar(
				"error",
				"Failed to fetch page count due to an unknown error!"
			);
		}
	};

	useEffect(() => {
		fetchPageCount();
	}, [pageSize]);

	const fetchEmployees = async () => {
		setLoading(true);
		try {
			await axios
				.get<Coach[]>(
					`${BACKEND_API_URL}/api/Coach/${pageIndex}/${pageSize}`,
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
						"Failed to fetch coaches!\n" +
						(String(reason.response?.data).length > 255
							? reason.message
							: reason.response?.data)
					);
				});
		} catch (error) {
			console.log(error);
			openSnackbar(
				"error",
				"Failed to fetch coaches due to an unknown error!"
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
		<Container data-testid="test-all-coaches-container">
			<h1>All coaches</h1>

			{loading && <CircularProgress />}
			{!loading && (
				<Button
					title="Add a new coach"
					component={Link}
					to={`/coaches/add`}
					disabled={getAccount() === null}
					variant="text"
					size="large"
					sx={{ mr: 3, mb: 2, textTransform: "none" }}
					startIcon={<AddIcon />}
				>
				</Button>
			)}
			{!loading && courses.length === 0 && <p> No coaches found</p>}	
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
								<TableCell align="left">Rate</TableCell>
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
									<TableCell align="left">{course.rate}</TableCell>
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
										to={`/coaches/${course.id}/details`}>	
										<Tooltip title="View coach details" arrow>
											<ReadMoreIcon color="primary" />
										</Tooltip>
									</IconButton>

									<IconButton
										component={Link}
										sx={{ mr: 3 }}
										to={`/coaches/${course.id}/edit`}
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
										to={`/coaches/${course.id}/delete`}
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
						onClick={() =>
							setPageIndex((prevPageIndex) =>
								Math.max(prevPageIndex - 1, 0)
							)
						}
						disabled={pageIndex === 0}
					>
						&lt;
					</Button>
					{startPage > 1 && (
						<>
							<Button
								variant={
									pageIndex === 0 ? "contained" : "outlined"
								}
								onClick={() => handlePageClick(1)}
								style={{
									marginLeft: 8,
									marginRight: 8,
								}}
							>
								1
							</Button>
							<span>...</span>
						</>
					)}
					{Array.from(
						{ length: endPage - startPage + 1 },
						(_, i) => i + startPage
					).map((number) => (
						<Button
							key={number}
							variant={
								pageIndex === number - 1
									? "contained"
									: "outlined"
							}
							onClick={() => handlePageClick(number)}
							style={{
								marginLeft: 8,
								marginRight: 8,
							}}
						>
							{number}
						</Button>
					))}
					{endPage < totalPages && (
						<>
							<span>...</span>
							<Button
								variant={
									pageIndex === totalPages - 1
										? "contained"
										: "outlined"
								}
								onClick={() => handlePageClick(totalPages)}
								style={{
									marginLeft: 8,
									marginRight: 8,
								}}
							>
								{totalPages}
							</Button>
						</>
					)}
					<Button
						variant="contained"
						onClick={() =>
							setPageIndex((prevPageIndex) => prevPageIndex + 1)
						}
						disabled={pageIndex + 1 >= totalPages}
					>
						&gt;
					</Button>
				</div>
			)}
		</Container>
	);
};



