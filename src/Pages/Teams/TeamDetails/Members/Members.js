import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../../Components/Avatar/Avartar.js";
import FriendsListModal from "./FriendsListModal.js";
import TableHeader from "../../../../Components/TableHeader/TableHeader.js";
import { deleteTeam } from "../../../../Redux/teamsReducer.js";
import { useSnackbarUtil } from "../../../../Utils/SnackbarUtil.js";
import TeamMemberAPI from "../../../../APIs/team-service/TeamMemberAPI.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import { teamRoles } from "../../../../Utils/Constraints.js";
import WebSocketService from "../../../../Services/WebSocketService.js";
import { getDateTime } from "../../../../Utils/DateTimeUtil.js";
import { alertError, alertSuccess } from "../../../../Utils/ToastUtil.js";

const Members=({team})=>{
          const user=useSelector(state=>state.user);
          const members=team.members;
          const roleOfOwner=team.members.find(member=>member.user.id==user.id)?.role;
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showFriendsList, setShowFriendsList]=useState(false);
          const dispatch= useDispatch();
         
          const filterMembers=(search==="")?members:members.filter(handleFilter);
          
          function handleFilter(item) {
            const re = new RegExp("^"+search,"i");
            return item.user.nickName.match(re);
         }
          function handleKickButton(memberId){
                TeamMemberAPI.kickMember(team.id, memberId).then(res=>{
                    alertSuccess('Kick member successfully')
                })
                .catch(err=>alertError(handleAxiosError(err)));
          }
          function handleLeaveButton(){
                TeamMemberAPI.leaveTeam(team.id).then(()=>{
                    WebSocketService.unsubscribeByTeamId(team.id);
                    dispatch(deleteTeam(team.id));
                    alertSuccess("You have leaved the team "+team.teamName);
                })
                .catch(err=>alertError("Failed to leave team. Try again"));
          }

          return(
            <>
            {showFriendsList&&<FriendsListModal user={user} team={team} setShow={setShowFriendsList}/>}
            <div className="tablePage">
                    <div className="contentAlignment">
                              <button type="button" className="btn btn-sm btn-primary" onClick={()=>setShowFriendsList(true)}>Add new member</button>
                              <button type="button" className="btn btn-sm btn-warning" onClick={()=>handleLeaveButton()}>Leave Team</button>
                              <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                                    <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                              </form>
                    </div>
                    <div className="TableWapper border-bottom border-dark">
                        <table className="table table-hover">
                            <TableHeader data={["Name", "Email","Last active","Role","Action"]} />
                            <tbody>
                        {filterMembers?.map((member, index)=> {
                            const memberUser=member.user;
                            if(member.role!=teamRoles.LEAVE)
                                return (
                                    <tr key={index}>
                                        <td>
                                            <Avatar src={memberUser.urlIcon}/> {memberUser.nickName}
                                        </td>
                                        <td>{memberUser.email}</td>
                                        <td>{getDateTime(memberUser.lastActive)}</td>
                                        <td>{member.role}</td>
                                        <td>
                                            {(roleOfOwner==teamRoles.LEADER&&memberUser.id!=user.id)&&
                                            <button type="button" className="btn btn-sm btn-danger" onClick={(e)=>handleKickButton(memberUser.id)}>Kick member</button>}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
          </div>
          </>
          )
}
export default Members;