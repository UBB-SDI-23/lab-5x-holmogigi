const PROD_BACKEND_API_URL = "https://mpp20230409123420.azurewebsites.net";
const DEV_BACKEND_API_URL = "https://mpp20230409123420.azurewebsites.net";

export const BACKEND_API_URL =
	process.env.NODE_ENV === "development" ? DEV_BACKEND_API_URL : PROD_BACKEND_API_URL;
