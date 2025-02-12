import { addChannel, addMeeting, addMembers, addTeamChatMessage, deleteMeeting, deleteMember, removeChannel, updateTeam } from "../Redux/teamsReducer.js";
import WebSocketService from "../Services/WebSocketService.js";
import { wsTopics } from "../Utils/Constraints.js";

export function subscribeToTeamTopics(team, dispatch){
          const dest="/topic/team."+team.id;
          
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateMessage,
                    (payload)=>{
                              const message=payload;
                              dispatch(addTeamChatMessage(message));
                    });      
                      
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addTeamMembers, 
              (payload)=>{
                        const members=payload;
                        dispatch(addMembers({teamId: team.id, newMembers: members}))
                    });

            WebSocketService.subscribeToNewTopic(dest, wsTopics.deleteMember,
                  (payload)=>{
                        const memberId=payload;
                        dispatch(deleteMember({teamId: team.id, memberId}));
                  }
            )
          
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateChannel,
                    (payload)=>{
                          const channel=payload;
                          dispatch(addChannel({teamId: team.id, newChannel: channel}))
                    });
          
          WebSocketService.subscribeToNewTopic(dest, wsTopics.deleteChannel,
                (payload)=>{
                        const channelId=payload;
                        dispatch(removeChannel({teamId: team.id, channelId}))
                    });
          
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateTeam,
                (payload)=>{
                        const updatedTeam=payload;
                        dispatch(updateTeam(updatedTeam));
                      });
                      
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateMeeting, 
                (payload)=>{
                        const meeting=payload;
                        dispatch(addMeeting(meeting))
                      });
                      
          WebSocketService.subscribeToNewTopic(dest, wsTopics.deleteMeeting,
                (payload)=>{
                        const data=payload;
                        dispatch(deleteMeeting({...data}))
                  });
}
