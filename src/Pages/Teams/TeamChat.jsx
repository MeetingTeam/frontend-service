import { Link } from "react-router-dom";
import Avatar from "../../Components/Avatar/Avartar.jsx";
import TextChannel from "./TextChannel/TextChannel.jsx";
import { useEffect } from "react";
import TeamMemberAPI from "../../APIs/team-service/TeamMemberAPI.js";
import { useDispatch } from "react-redux";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import { channelTypes } from "../../Configs/Constraints.js";
import { addMembers } from "../../Redux/teamsReducer.js";
import VoiceChannel from "./VoiceChannel/VoiceChannel.jsx";
import TeamDetails from "./TeamDetails/TeamDetails.jsx";
import { alertError } from "../../Utils/ToastUtil.js";

const TeamChat=({team, channel,channelInfo, setChannelInfo})=>{
          const dispatch=useDispatch();

          function handle3DotButton(e){
                e.preventDefault();
                setChannelInfo(prev=>{
                    return {teamIndex: prev.teamIndex,channelIndex:-1, tabIndex:0};
                })
         }
          useEffect(()=>{
                    if(!team.members){
                              TeamMemberAPI.getMembersOfTeam(team.id).then(res=>{
                                        dispatch(addMembers({
                                                teamId: team.id, 
                                                newMembers: res.data
                                        }));
                              })
                              .catch(err=>alertError(handleAxiosError(err)));
                    }
          },[team, channelInfo])
         return (
          <div className="chat">
                    <div className="chat-header clearfix">
                              <div className="row">
                                        <div className="col-lg-6">
                                                <Avatar src={team.urlIcon}/>
                                                  <div className="chat-about">
                                                    <h6 className="mb-0">{team.teamName}/{channel?channel.channelName:"TeamDetails"}</h6>
                                                    {team.members&&<small>{team.members.length} members</small>}
                                                </div>
                                        </div>
                                        <div className="col-lg-6 text-end">
                                                <Link className="btn btn-outline-primary"><i className="fa fa-phone"></i></Link>
                                                <Link className="btn btn-outline-secondary" onClick={(e)=>handle3DotButton(e)}><i className="fa fa-ellipsis-v" aria-hidden="true"></i></Link>
                                        </div>
                              </div>
                    </div>
                    {channel&&channel.type==channelTypes.CHAT_CHANNEL&&
                              <TextChannel team={team} channel={channel} channelInfo={channelInfo}/>}
                    {channel&&channel.type==channelTypes.VOICE_CHANNEL&&
                              <VoiceChannel team={team} channel={channel} channelInfo={channelInfo}/>}
                    {team.members&&channel==null&&
                              <TeamDetails team={team} channelInfo={channelInfo} setChannelInfo={setChannelInfo}/>}
          </div>
         )
}

export default TeamChat;