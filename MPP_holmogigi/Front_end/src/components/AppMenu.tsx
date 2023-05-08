import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { getAccount } from "../auth";

export const AppMenu = () => {
	const location = useLocation();
	const path = location.pathname;

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

					<Button
						variant="text"
						to={'/users/${getAccount()?.id}/details'}
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						//disabled={getAccount() === null}
						startIcon={<LocalLibraryIcon />}>
						{getAccount()?.name}
					</Button>
					<Button
						variant="text"
						to="/users/login"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<LocalLibraryIcon />}>
						LOGIN
					</Button>
					<Button
						variant="text"
						to="/users/register"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<LocalLibraryIcon />}>
						REGISTER
					</Button>
					
				</Toolbar>
			</AppBar>
		</Box>
	);
};
