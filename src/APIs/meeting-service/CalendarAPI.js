import { MEETING_SERVICE_ENDPOINT } from "../../Util/EnvStore.js";
import AxiosService from "./AxiosService";

const calendarEndpoint = MEETING_SERVICE_ENDPOINT+"/calendar";

class CalendarAPI {
    addToCalendar(meetingId, isAdded) {
        return AxiosService.post(`${calendarEndpoint}/${meetingId}`, null, {
                    isAdded
        });
    }

    getMeetingsOfWeek(week) {
        return AxiosService.get(`${calendarEndpoint}/week/${week}`);
    }
}

export default new CalendarAPI();