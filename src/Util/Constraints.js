import env from "react-dotenv";

export const API_ENDPOINT = env.API_ENDPOINT
export const WEBSOCKET_ENDPOINT=API_ENDPOINT+"/wss"
export const tabTitles=["Members", "Pending Requests", "Channels","Settings"]

// Token Type names
export const REFRESH_TOKEN="REFRESH_TOKEN"
export const ACCESS_TOKEN="ACCESS_TOKEN"
