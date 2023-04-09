import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import * as React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppHome } from "./components/AppHome";
import { AppMenu } from "./components/AppMenu";
import { AllEmployees } from "./components/bds/AllBds";
import { CourseDetails } from "./components/bds/DetailBds";
//import { CourseDelete } from "./components/courses/CourseDelete";
import { CourseAdd } from "./components/bds/AddBds";

function App() {
	return (
		<React.Fragment>
			<Router>
				<AppMenu />

				<Routes>
					<Route path="/" element={<AppHome />} />
					<Route path="/courses" element={<AllEmployees />} />

					<Route path="/employees/:employee/details"
						element={<CourseDetails />}
					/>

					<Route path="/employees/add" element={<CourseAdd />} />
				</Routes>
			</Router>
		</React.Fragment>
	);
}

export default App;