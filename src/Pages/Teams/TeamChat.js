import { Link } from "react-router-dom";
import Avatar from "../../Components/Avatar/Avartar.js";
import TextChannel from "./TextChannel/TextChannel.js";
import { useEffect } from "react";
import TeamMemberAPI from "../../APIs/team-service/TeamMemberAPI.js";
import { useDispatch } from "react-redux";
import { updateMembers } from "../../Redux/teamsReducer.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import { channelTypes } from "../../Utils/Constraints.js";
import { useSnackbarUtil } from "../../Utils/SnackbarUtil.js";

const TeamChat=({team, channel,channelInfo})=>{
          const dispatch=useDispatch();
          const { showErrorMessage } = useSnackbarUtil();

          useEffect(()=>{
                    if(!team.members){
                        console.log("send")
                              TeamMemberAPI.getMembersOfTeam(team.id).then(res=>{
                                        console.log("members", res.data)
                                        dispatch(updateMembers({
                                                teamId: team.id, 
                                                newMembers: res.data
                                        }));
                              })
                              .catch(err=>{
                                        showErrorMessage(handleAxiosError(err));
                                        console.log("err", err);
                                });
                    }
          },[])
         return (
          <div className="chat">
                    <div className="chat-header clearfix">
                              <div className="row">
                                        <div className="col-lg-6">
                                                <Avatar src={team.urlIcon}/>
                                                  <div className="chat-about">
                                                    <h6 className="m-b-0">{team.teamName}/{channel?channel.channelName:"TeamDetails"}</h6>
                                                    {team.memebers&&<small>{team.members.length} members</small>}
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
                              <VideoChannel team={team} channel={channel} channelInfo={channelInfo}/>}
                    {/* {team.members&&channel==null&&
                              <TeamDetails team={team} channelInfo={channelInfo} setChannelInfo={setChannelInfo}/>} */}
          </div>
         )
}

export default TeamChat;