import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import * as React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button, Snackbar,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";
import { AppHome } from "./components/AppHome";
import { AppMenu } from "./components/AppMenu";
import { AllCourses } from "./components/courses/AllCourses";
import { CourseDetails } from "./components/courses/CourseDetails";
import { CourseDelete } from "./components/courses/CourseDelete";
import { CourseAdd } from "./components/courses/CourseAdd";
import { CourseEdit } from "./components/courses/CourseEdit";
import { AllCoaches } from "./components/coaches/AllCoaches";
import { ContestAdd } from "./components/contests/ContestAdd";
import { AllGyms } from "./components/gyms/AllGyms";
import { GymAdd } from "./components/gyms/GymAdd";
import { GymDelete } from "./components/gyms/GymDelete";
import { GymDetails } from "./components/gyms/GymDetails";
import { GymEdit } from "./components/gyms/GymEdit";
import { AllContests } from "./components/contests/AllContests";
import { ContestEdit } from "./components/contests/ContestEdit";
import { ContestDelete } from "./components/contests/ContestDelete";
import { ContestDetails } from "./components/contests/ContestDetails";
import { CoachDetails } from "./components/coaches/CoachDetails";
import { CoachAdd } from "./components/coaches/CoachAdd";
import { CoachDelete } from "./components/coaches/CoachDelete";
import { CoachEdit } from "./components/coaches/CoachEdit";
import { FilterAge } from "./components/filters/FilterAge";
import { GymMinAge } from "./components/filters/GymMinAge";
import { GymOrderSmall } from "./components/filters/GymOrderSmall";

import { UserDetails } from "./components/users/UserDetails";
import { UserRegister } from "./components/users/UserRegister";
import { UserRegisterConfirm } from "./components/users/UserRegisterConfirm";
import { UserLogin } from "./components/users/UserLogin";
import { SnackbarContext } from "./components/SnackbarContext";
import { AdminPage } from "./components/users/AdminPage";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App()
{
	const [open, setOpen] = useState(false);
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [message, setMessage] = useState("placeholder");

	const openSnackbar = (severity: AlertColor, message: string) => {
		handleClose();

		setTimeout(() => {
			setSeverity(severity);
			setMessage(message);
			setOpen(true);
		}, 250);
	};

	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};
	return (
		<React.Fragment>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert
					onClose={handleClose}
					severity={severity}
					sx={{ width: "100%", whiteSpace: "pre-wrap" }}
				>
					{message}
				</Alert>
			</Snackbar>

			<SnackbarContext.Provider value={openSnackbar}>
			<Router>
				<AppMenu />

				<Routes>
					<Route path="/" element={<AppHome />} />

						<Route
							path="/users/:userId/details"
							element={<UserDetails />}
						/>
						<Route
							path="/users/register"
							element={<UserRegister />}
						/>
						<Route
							path="/users/register/confirm/:code"
							element={<UserRegisterConfirm />}
						/>
						<Route path="/users/login" element={<UserLogin />} />
						<Route path="/users/admin" element={<AdminPage />} />

					<Route path="/courses" element={<AllCourses />} />
					<Route path="/courses/:courseId/details" element={<CourseDetails />} />
					<Route path="/courses/:courseId/edit" element={<CourseEdit />} />
					<Route path="/courses/:courseId/delete" element={<CourseDelete />} />
					<Route path="/courses/add" element={<CourseAdd />} />

					<Route path="/coaches" element={<AllCoaches />} />
					<Route path="/coaches/:courseId/details" element={<CoachDetails/>} />
					<Route path="/coaches/add" element={<CoachAdd />} />
					<Route path="/coaches/:courseId/delete" element={<CoachDelete />} />
					<Route path="/coaches/:courseId/edit" element={<CoachEdit />} />

					<Route path="/gyms" element={<AllGyms />} />
					<Route path="/gyms/:courseId/details" element={<GymDetails />} />
					<Route path="/gyms/:courseId/delete" element={<GymDelete />} />
					<Route path="/gyms/add" element={<GymAdd />} />
					<Route path="/gyms/:courseId/edit" element={<GymEdit />} />

					<Route path="/contests" element={<AllContests />} />
					<Route path="/contests/:courseId/:courseId2/details" element={<ContestDetails />} />
					<Route path="/contests/add" element={<ContestAdd />} />
					<Route path="/contests/:courseId/:courseId2/delete" element={<ContestDelete />} />
					<Route path="/contests/:courseId/:courseId2/edit" element={<ContestEdit />} />

					<Route path="/filterAge" element={<FilterAge />} />

					<Route path="/gymMinAge" element={<GymMinAge />} />

					<Route path="/gymOrderSmall" element={<GymOrderSmall />} />
				</Routes>
				</Router>
			</SnackbarContext.Provider>
		</React.Fragment>
	);
}

export default App;
