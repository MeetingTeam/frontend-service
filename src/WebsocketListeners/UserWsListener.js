import { addFriendChatMessage, deleteFriend, updateFriends } from "../Redux/friendsReducer.js";
import { deleteTeam, updateTeam } from "../Redux/teamsReducer.js";
import { AddOrUpdateFriend, AddOrUpdateMeeting, AddOrUpdateMessage, DeleteFriend, DeleteTeam } from "../Util/Constraints.js";
import WebSocketService from "../Util/WebSocketService.js";

export function subscribeToUserTopics(user, dispatch){
          const dest= "user."+user.id;

          WebSocketService.subscribeToNewTopic(dest, AddOrUpdateMessage ,
                    (payload)=>{
                              const message=payload;
                              dispatch(addFriendChatMessage(message))
          })
                    
          WebSocketService.subscribeToNewTopic(dest, AddOrUpdateMeeting,
                    (payload)=>{
                        const newTeam=payload;
                        dispatch(updateTeam(newTeam));
          })
          
          WebSocketService.subscribeToNewTopic(dest, DeleteTeam,
                    (payload)=>{
                        const teamId=payload;
                        unsubscribeByTeamId(teamId);
                        dispatch(deleteTeam(teamId));
          })
                    
          WebSocketService.subscribeToNewTopic(dest,AddOrUpdateFriend,(payload)=>{
                        const updatedFriend=payload;
                        dispatch(updateFriends(updatedFriend));
          })
                    
          WebSocketService.subscribeToNewTopic(dest,DeleteFriend,
                    (payload)=>{
                        const friendId=payload;
                        dispatch(deleteFriend(friendId));
          })
}