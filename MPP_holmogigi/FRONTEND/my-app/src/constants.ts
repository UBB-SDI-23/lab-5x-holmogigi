const PROD_BACKEND_API_URL = "https://mpp20230409123420.azurewebsites.net";
const DEV_BACKEND_API_URL = "https://mpp20230409123420.azurewebsites.net";

export const BACKEND_API_URL =
	process.env.NODE_ENV === "development" ? DEV_BACKEND_API_URL : PROD_BACKEND_API_URL;

export function formatDate(date: Date | string | undefined) {
	return date == null || date == undefined
		? "N/A"
		: new Date(date).toLocaleString()
}

export const getEnumValues = (e: any) => {
	return Object.keys(e)
		.filter((key) => isNaN(Number(key)))
		.map((key) => e[key]);
};