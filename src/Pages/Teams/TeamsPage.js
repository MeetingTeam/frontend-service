import { useDispatch, useSelector } from "react-redux";
import "./TeamsPage.css";
import { useState } from "react";
import Avatar from "../../Components/Avatar/Avartar.js";
import CreateTeamModal from "./Component/CreateTeamModal.js";
import { ChannelType } from "./Component/ChannelType.js";
import { useSnackbarUtil } from "../../Utils/SnackbarUtil.js";
import TeamChat from "./TeamChat.js";
import TeamAPI from "../../APIs/team-service/TeamAPI.js";
import { loadMoreTeams } from "../../Redux/teamsReducer.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import { alertError } from "../../Utils/ToastUtil.js";

const TeamsPage=()=>{
           const dispatch= useDispatch();
          const teams=useSelector(state=>state.teams);
          const [channelInfo, setChannelInfo]=useState({teamIndex:0, channelIndex:0});
          const [searchTerm, setSearchTerm]=useState("");
          const [searchTeamIds, setSearchTeamIds]=useState(null);
          const [showTeamModal, setShowTeamModal]=useState(false);

          function findTeamAndChannelByIndex(){
            let team=null, channel=null;
            if(teams){
                if(channelInfo.teamIndex<teams.length){
                    team=teams[channelInfo.teamIndex];
                    if(team&&team.channels){
                        if(channelInfo.channelIndex<team.channels.length){
                            channel= team.channels[channelInfo.channelIndex];
                        }
                    } 
                }
              }
              return {team, channel};
          }
          function handleShowMoreBtn(){
            TeamAPI.getJoinedTeams(teams.length/10, 10).then(res=>{
                dispatch(loadMoreTeams(res.data.data));
            })
            .catch(err=>alertError(handleAxiosError(err)));
          }
           function handleSearchBtn(e){
                e.preventDefault();
                if(searchTerm&&searchTerm!="") {
                        TeamAPI.searchTeamsByName(searchTerm).then(res=>{
                            var searchTeams=res.data;
                            setSearchTeamIds(new Set(searchTeams.map(searchTeam=>searchTeam.id)));
                            dispatch(loadMoreTeams(searchTeams));
                        })
                        .catch(err=>alertError(handleAxiosError(err)));
                      }
                      else if(searchTeamIds!=null) setSearchTeamIds(null);
            }
          function handleFilter(){
            if(!teams) return null;
            if(searchTeamIds!=null){
                return teams.filter(team=>searchTeamIds.has(team.id));
            }
            else return teams;
        }

          const {team, channel}=findTeamAndChannelByIndex();
          const filerTeams=handleFilter();
          return(
            <>
            {showTeamModal&&<CreateTeamModal setShow={setShowTeamModal}/>}
             <div className="container-fluid">
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                              <div id="teamslist" className="teams-management">
                                    <div className="teams-control">
                                        <button className="mb-1 btn btn-outline-warning" onClick={()=>setShowTeamModal(true)}>Create a team</button>
                                        <form className="input-group" onSubmit={(e)=>handleSearchBtn(e)}>
                                                <span className="input-group-text"><i className="fa fa-search"></i></span>
                                                <input type="text" className="form-control" placeholder="Search..." onChange={(e)=>setSearchTerm(e.target.value)}/>
                                        </form>
                                    </div>
                                    <div className="teams-list">
                                        <div className="accordion" id="teams">
                                            {filerTeams.map((team)=>{
                                                return(
                                                        <div className="accordion-item" key={team.id}>
                                                            <h3 className="accordion-header">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#team-"+team.id} aria-expanded="false" aria-controls={"team-"+team.id}>
                                                                        <Avatar src={team.urlIcon}/>
                                                                        <div className="about name">{team.teamName}</div>
                                                                </button>
                                                            </h3>
                                                            <div id={"team-"+team.id} className="accordion-collapse collapse" data-bs-parent="#teams">
                                                                    <div className="accordion-body channelType">
                                                                            <ChannelType team={team} setChannelInfo={setChannelInfo} channelInfo={channelInfo}/>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    )
                                            })}
                                        </div>
                                        <button className="mt-1 w-100 btn btn-outline-success" onClick={()=>handleShowMoreBtn()}>Show More</button>
                                    </div>
                                </div>
                                {team&&<TeamChat team={team} channel={channel} channelInfo={channelInfo} setChannelInfo={setChannelInfo}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
          )
}
export default TeamsPage