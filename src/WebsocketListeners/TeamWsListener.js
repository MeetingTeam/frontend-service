import { addTeamChatMessage } from "../Redux/teamsReducer.js";
import { AddOrUpdateMessage } from "../Util/Constraints.js";
import WebSocketService from "../Util/WebSocketService.js";

export function subscribeToTeamTopics(team, dispatch){
          const dest="team."+team.id
          WebSocketService.subscribeToNewTopic(dest, AddOrUpdateMessage,
                    (payload)=>{
                              const message=payload;
                              dispatch(addTeamChatMessage({teamId: team.id, message}));
                    });      
                      
          subscribeToNewTopic(url,"/updateMembers", (payload)=>{
                        const members=payload;
                        dispatch(updateMembers({teamId: team.id, newMembers: members}))
                      })
                      subscribeToNewTopic(url,"/updateChannels",(payload)=>{
                          const channel=payload;
                          dispatch(updateChannels({teamId: team.id, newChannel: channel}))
                      })
                      subscribeToNewTopic(url, "/removeChannel",(payload)=>{
                        const channelId=payload;
                        dispatch(removeChannel({teamId: team.id, channelId}))
                      })
                      subscribeToNewTopic(url, "/updateTeam",(payload)=>{
                        const updatedTeam=JSON.parse(payload.body);
                        dispatch(updateTeam(updatedTeam));
                      })
                      subscribeToNewTopic(url, "/updateMeetings", (payload)=>{
                        const meeting=payload;
                        dispatch(updateMeetings({teamId: team.id, meeting: meeting}))
                      })
                      subscribeToNewTopic(url, "/deleteMeeting",(payload)=>{
                        const data=payload;
                        dispatch(deleteMeeting({teamId: team.id, ...data}))
                      })
}
