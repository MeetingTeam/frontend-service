import AxiosService from "../../Services/AxiosService.js";
import { MEETING_SERVICE_ENDPOINT } from "../../Utils/EnvStore.js";

const meetingEndpoint = MEETING_SERVICE_ENDPOINT+"/meeting";

class MeetingAPI {
    createMeeting(meetingDto) {
        return AxiosService.post(meetingEndpoint, meetingDto);
    }

    updateMeeting(meetingDto) {
        return AxiosService.patch(meetingEndpoint, meetingDto);
    }

    reactMeeting(meetingId, emojiCode) {
        return AxiosService.post(`${meetingEndpoint}/reaction/${meetingId}`, {}, {
            emojiCode
        });
    }

    cancelMeeting(meetingId, isCanceled) {
        return AxiosService.put(`${meetingEndpoint}/cancel/${meetingId}`, null, {
          isCanceled
        });
    }

    getMeetingsOfVideoChannel(channelId, receivedMeetingNum) {
        return AxiosService.get(meetingEndpoint, {
                    channelId, receivedMeetingNum
        });
    }

    deleteMeeting(meetingId) {
        return AxiosService.delete(`${meetingEndpoint}/${meetingId}`);
    }
}

export default new MeetingAPI();