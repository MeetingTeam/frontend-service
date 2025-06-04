import "./VoiceChannel.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadChannelMeetings } from "../../../Redux/teamsReducer.js";
import MeetingModal from "./Component/MeetingModal.jsx";
import MeetingAPI from "../../../APIs/meeting-service/MeetingAPI.js";
import { handleAxiosError } from "../../../Utils/ErrorUtil.js";
import { getScheduledTime, getTimeDistance } from "../../../Utils/DateTimeUtil.js";
import MeetingDropdown from "./Component/MeetingDropdown.jsx";
import { DateTime } from "luxon";
import ReactionDetails from "../../../Components/Message/ReactionDetails.jsx";
import ReactionList from "../../../Components/Message/ReactionList.jsx";
import Avatar from "../../../Components/Avatar/Avartar.jsx";
import { alertError } from "../../../Utils/ToastUtil.js";

const VoiceChannel=({team, channel, channelInfo})=>{
          const dispatch=useDispatch();
          const user=useSelector(state=>state.user);
          const [reactions, setReactions]=useState(null);
          const [meeting, setMeeting]=useState(null);
          
          useEffect(()=>{
              if(!channel.meetings){
                  MeetingAPI.getMeetingsOfVideoChannel(channel.id,0).then(res=>{
                      dispatch(loadChannelMeetings({channelInfo, meetings:res.data}))
                  })
                  .catch(err=>alertError(handleAxiosError(err)));
              }
          },[channelInfo])
          
          function handleScheduleButton(e){
            e.preventDefault();
            setMeeting({
                teamId: team.id,
                channelId:channel.id,
                title: "",
                scheduledTime: null,
                startDate: DateTime.local().toISODate(),
                endDate: null,
                scheduledDaysOfWeek: []
            })
          }
          function handleMeetingNowButton(){
                MeetingAPI.createMeeting({
                  teamId: team.id,
                  channelId:channel.id,
                  title:"Meeting Now",
                  scheduledTime:null,
                  startDate: null,
                  endDate: null,
                  scheduledDaysOfWeek: []
              }).then(res=>{
                var resMeeting=res.data;
                window.open(`/videoCall?meetingId=${resMeeting.id}`, "_blank");
              }).catch(err=>alertError(handleAxiosError(err)));
          }
          function handleAddMeetingsButton(){
                const meetingsNum=channel.meetings?channel.meetings.length:0;
                MeetingAPI.getMeetingsOfVideoChannel(channel.id,meetingsNum).then(res=>{
                    dispatch(loadChannelMeetings({channelInfo, meetings:res.data}))
                })
                .catch(err=>alertError(handleAxiosError(err)));
          }
          
          return(
            <>
            {reactions&&<ReactionDetails reactions={reactions} people={team.members.map(member=>member.u)} setShow={setReactions}/>}
            {meeting&&<MeetingModal meeting={meeting} setShow={setMeeting}/>}
            <div className="chat-history">
                    <button className="btn btn-success" onClick={handleAddMeetingsButton}>See more meetings</button>
                    {team.members&&channel.meetings?.map(meeting=>{
                              let owner=null;
                              if(meeting.creatorId==user.id) owner=user;
                              else{
                                    let ownerIndex=team.members.findIndex(member=>member.u.id==meeting.creatorId);
                                    if(ownerIndex>-1) owner=team.members[ownerIndex].u;
                              } 
                              let title=meeting.title?meeting.title:"no title";
                            if(owner) return(
                              <div key={meeting.id} className="card meeting-card">
                                        <div className="card-body">
                                            <div className="row">
                                                  <div className="col-lg-auto"><Avatar src={owner.urlIcon}/></div>
                                                  <div className="col-lg-6">
                                                            <div className="chat-about">
                                                                      <div className="name">{owner.nickName}</div>
                                                                      <small>{getTimeDistance(owner.createdAt)}</small>
                                                            </div>
                                                  </div>
                                                  {/* <div className="col-lg-4 status">
                                                      {meeting.isActive?<i className="fa fa-circle online"> the meeting is happening</i>:<i className="fa fa-circle offline"> the meeting is offline</i>}
                                                  </div> */}
                                          </div>
                                        <div className="card mt-3 meeting-detail">
                                                  <div className="card-body">
                                                            <h6 className="card-title"><i className="fa fa-calendar" aria-hidden="true"></i> {meeting.isCanceled?<del>{"Cancel:" +title}</del>:title}</h6>
                                                            <p className="card-text">{getScheduledTime(meeting)}</p>
                                                  </div>
                                        </div>
                                        <div className="mt-3 d-flex justify-content-between">
                                                  <button className="btn btn-warning" onClick={()=>window.open(`/videoCall?meetingId=${meeting.id}`, "_blank")}  disabled={meeting.isCanceled}>Join</button>
                                                  <MeetingDropdown team={team} setMeetingDTO={setMeeting} meeting={meeting}/>
                                                  <ReactionList reactions={meeting.reactions} setReactions={setReactions}/>
                                     </div>
                                 </div>
                              </div>       
                              )
                    })}
                  </div>
                  <div className="chat-control clearfix">
                      <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="fa fa-video-camera" aria-hidden="true"></i> Meeting
                        </button>
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={handleMeetingNowButton}>
                            <i className="fa fa-pause" aria-hidden="true"></i> Meet now
                          </button>
                          <button className="dropdown-item" onClick={(e)=>handleScheduleButton(e)}>
                            <i className="fa fa-calendar-o" aria-hidden="true"></i> Schedule a meeting
                          </button>
                        </div>
                      </div>
                  </div>
            </> 
          )
}
export default VoiceChannel;