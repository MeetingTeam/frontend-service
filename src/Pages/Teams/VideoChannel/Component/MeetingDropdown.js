import { useDispatch, useSelector } from "react-redux";
import { updateCalendarMeetingIds } from "../../../../Redux/userReducer.js";
import MeetingAPI from "../../../../APIs/meeting-service/MeetingAPI.js";
import { useSnackbarUtil } from "../../../../Utils/SnackbarUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import CalendarAPI from "../../../../APIs/meeting-service/CalendarAPI.js";
import { emojiCodes } from "../../../../Utils/Constraints.js";

const MeetingDropdown=({setMeetingDTO,meeting})=>{
          const dispatch=useDispatch();
          const user=useSelector(state=>state.user);
          const { showErrorMessage } = useSnackbarUtil();
         
          function handleEmoji(e,emojiCode){
              e.preventDefault();
              MeetingAPI.reactMeeting(meeting.id, emojiCode)
                .catch(err=>showErrorMessage(handleAxiosError(err)));
          }
          function handleCalendarSwitch(e){
               CalendarAPI.addToCalendar(meeting.id,!e.target.checked).then(res=>{
                    const meetingIds=new Set([...user.calendarMeetingIds]);
                    if(meetingIds.has(meeting.id)) meetingIds.delete(meeting.id)
                    else meetingIds.add(meeting.id);
                    dispatch(updateCalendarMeetingIds(meetingIds))
                })
                .catch(err=>showErrorMessage(handleAxiosError(err)));
          }
          function handleCancelSwitch(e){
            MeetingAPI.cancelMeeting(meeting.id, e.target.checked)
                .catch(err=>showErrorMessage(handleAxiosError(err)));
          }
          function handleEditMeeting(){
            setMeetingDTO({
                id: meeting.id,
                title: meeting.title,
                scheduledTime: meeting.scheduledTime,
                scheduledDaysOfWeek: meeting.scheduledDaysOfWeek,
                endDate: meeting.endDate
            })
          }
          function handleDeleteBtn(){
            MeetingAPI.deleteMeeting(meeting.id)
                .catch(err=>showErrorMessage(handleAxiosError(err)));
          }
          function checkAddToCalendar(){
                if(!meeting||!meeting.calendarUserIds) return false;
                return meeting.calendarUserIds.find(calendarUserId=>calendarUserId==user.id);
          }
          
          return(
                    <div className="dropdown">
                              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id={"meetingDropdown"+meeting.id}>
                                        Settings
                              </button>
                              <div className="dropdown-menu" aria-labelledby={"meetingDropdown"+meeting.id}>
                                        {meeting.creatorId===user.id&&
                                            <button href="#" className="dropdown-item" onClick={handleEditMeeting}>Edit meeting</button>}
                                        {meeting.creatorId===user.id&&
                                            <button className="dropdown-item" onClick={handleDeleteBtn}>Delete Meeting</button>}
                                        {meeting.creatorId==user.id&&
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch"
                                                         onChange={e=>handleCancelSwitch(e)}/>
                                                <div className="form-check-label">Cancel meeting</div>
                                            </div>}
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch"
                                                     onChange={e=>handleCalendarSwitch(e)} />
                                                <div className="form-check-label">Add to calender</div>
                                            </div>
                                            <div className="d-flex align-items-center bg-light rounded-pill reaction-list">
                                                  {emojiCodes.map((emojiCode, index)=>
                                                            <span className="fs-4 me-2" key={index} onClick={(e)=>handleEmoji(e, emojiCode)}>
                                                                {emojiCode}
                                                            </span>
                                                  )}
                                                  <span className="fs-4 me-2" onClick={(e)=>handleEmoji(e, null)}>X</span>
                                        </div>
                              </div>
                    </div>
          )
}
export default MeetingDropdown;