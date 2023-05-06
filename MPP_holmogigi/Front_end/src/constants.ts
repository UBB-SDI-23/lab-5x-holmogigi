const PROD_BACKEND_API_URL = "https://localhost:7143";

export function formatDate(date: Date | string | undefined) {
	return date == null || date == undefined
		? "N/A"
		: new Date(date).toLocaleString()
}

export const BACKEND_API_URL = PROD_BACKEND_API_URL;
