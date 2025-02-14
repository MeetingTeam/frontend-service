import { addFriendChatMessage, deleteFriend, updateFriends } from "../Redux/friendsReducer.js";
import { deleteTeam, updateTeam } from "../Redux/teamsReducer.js";
import WebSocketService from "../Services/WebSocketService.js";
import { wsTopics } from "../Utils/Constraints.js";

export function subscribeToUserTopics(user, dispatch){
          const dest= "/topic/user."+user.id;

          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateMessage ,
                    (payload)=>{
                              const message=payload;
                              dispatch(addFriendChatMessage(message))
          });
                    
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateMeeting,
                    (payload)=>{
                        const newTeam=payload;
                        dispatch(updateTeam(newTeam));
          });
          
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateTeam, 
                (payload)=>{
                    const updatedTeam=payload;
                    dispatch(updateTeam(updatedTeam));
                }
          )
          WebSocketService.subscribeToNewTopic(dest, wsTopics.deleteTeam,
                    (payload)=>{
                        const teamId=payload;
                        WebSocketService.unsubscribeByTeamId(teamId);
                        dispatch(deleteTeam(teamId));
          });
                    
          WebSocketService.subscribeToNewTopic(dest, wsTopics.addOrUpdateFriend,
                (payload)=>{
                        const updatedFriend=payload;
                        dispatch(updateFriends(updatedFriend));
          });
                    
          WebSocketService.subscribeToNewTopic(dest, wsTopics.deleteFriend,
                    (payload)=>{
                        const friendId=payload;
                        dispatch(deleteFriend(friendId));
          });
}