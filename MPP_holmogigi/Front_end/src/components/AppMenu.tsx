import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { getAccount, logOut } from "../auth";
import { useContext } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { SnackbarContext } from "./SnackbarContext";
import { AccessLevel } from "../models/User";

export const AppMenu = () => {

	const navigate = useNavigate();
	const openSnackbar = useContext(SnackbarContext);

	const location = useLocation();
	const path = location.pathname;

	const accountNameClick = (event: { preventDefault: () => void }) => {
		event.preventDefault();

		const account = getAccount();
		if (account !== null) {
			navigate(`/users/${account.id}/details`);
		} else {
			navigate("/users/login");
		}
	};

	const logOutClick = (event: { preventDefault: () => void }) => {
		event.preventDefault();

		logOut();
		navigate("/");
		openSnackbar("info", "Logged out successfully!");
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ marginBottom: "20px" }}>
				<Toolbar>
					<IconButton
						component={Link}
						to="/"
						size="large"
						edge="start"
						color="inherit"
						aria-label="school"
						sx={{ mr: 2 }}>
						<SchoolIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ mr: 5 }}>
						Bodybuilders Management
					</Typography>
					<Button
						variant={path.startsWith("/courses") ? "outlined" : "text"}
						to="/courses"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						Bodybuilders
					</Button>
					<Button
						variant={path.startsWith("/coaches") ? "outlined" : "text"}
						to="/coaches"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						Coaches
					</Button>
					<Button
						variant={path.startsWith("/gyms") ? "outlined" : "text"}
						to="/gyms"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						Gyms
					</Button>
					<Button
						variant={path.startsWith("/contests") ? "outlined" : "text"}
						to="/contests"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						Contests
					</Button>


					<Button
						variant={path.startsWith("/filterAge") ? "outlined" : "text"}
						to="/filterAge"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						Input Filter by Age
					</Button>

					<Button
						variant={path.startsWith("/gymMinAge") ? "outlined" : "text"}
						to="/gymMinAge"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						Gym Coaches by avg Age
					</Button>

					<Button
						variant={path.startsWith("/gymOrderSmall") ? "outlined" : "text"}
						to="/gymOrderSmall"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						Gym Coaches by Youngest
					</Button>

					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						component={Link}
						to={`/users/admin`}
						size="large"
						edge="start"
						color="inherit"
						aria-label="school"
						sx={{
							mr: 0,
							display:
								getAccount()?.accessLevel === AccessLevel.Admin
									? "inline-flex"
									: "none",
						}}
					>
					<LocalLibraryIcon />
					
					</IconButton>
					<Button
						variant="text"
						color="inherit"
						sx={{ mr: 2 }}
						onClick={accountNameClick}
					>
						{getAccount()?.name ?? "LOG IN"}
					</Button>	
					<Button
						variant="text"
						to="/users/register"
						component={Link}
						color="inherit"
						sx={{
							mr: 0,
							display:
								getAccount() !== null ? "none" : "inline-flex",
						}}
						>
						REGISTER
					</Button>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="school"
						sx={{
							mr: 0,
							display:
								getAccount() !== null ? "inline-flex" : "none",
						}}
						onClick={logOutClick}
					>
						<LogoutIcon />
					</IconButton>
					
				</Toolbar>
			</AppBar>
		</Box>
	);
};
