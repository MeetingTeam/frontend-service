import { useEffect, useState } from "react";
import TableHeader from "../../../../Components/TableHeader/TableHeader.js";
import Avatar from "../../../../Components/Avatar/Avartar.js";
import TeamRequestAPI from "../../../../APIs/team-service/TeamRequestAPI.js";
import UserDetailModal from "../../../../Components/UserDetail/UserDetailModal.js";
import { alertError } from "../../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";

const PendingRequest=({team})=>{
          const [requests, setRequests]=useState([]);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showUserDetail, setShowUserDetail]=useState({show: false, user: null});
          
          useEffect(()=>{
            TeamRequestAPI.getTeamRequests(team.id).then(res=>{
                        setRequests(res.data);
                    })
          },[])

          function handleFilter(item) {
                    const re = new RegExp("^"+search,"i");
                    return item.user.nickName.match(re);
            }
          function handleApproveButton(requestId, isAccepted){
                    TeamRequestAPI.acceptNewMember({
                        requestId,
                        isAccepted
                    }).then(res=>{
                            setRequests(prev=>prev.filter(request=>request.id!=requestId))
                    })
                    .catch(err=>alertError(handleAxiosError(err)));
          }
          function handleUserDetailButton(user){
            setShowUserDetail({show: true, user: user});
          }

          let filterRequests=(search==="")?requests:requests.filter(handleFilter);
          return(
            <>
                {showUserDetail.show&&<UserDetailModal showUserDetail={showUserDetail} setShowUserDetail={setShowUserDetail}/>}
                <div className="tablePage">
                    <div className="contentAlignment">
                              <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                                    <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                              </form>
                    </div>
                    <div className="tableWapper border-bottom border-dark">
                        <table className="table table-hover">
                            <TableHeader data={["Name", "Message","Requester Info", "Action"]} />
                            <tbody>
                        {filterRequests?.map((request, index)=> {
                                const sender=request.sender;
                                if(sender){
                                return (
                                    <tr key={index}>
                                        <td>
                                            <Avatar src={sender.urlIcon}/> {sender.nickName}
                                        </td>
                                        <td>{request.content}</td>
                                        <td>
                                                <button type="button" className="btn btn-sm btn-info" onClick={()=>handleUserDetailButton(sender)}>Info</button>                                         
                                        </td>
                                        <td>
                                             <button type="button" className="btn btn-sm btn-primary mx-1" onClick={()=>handleApproveButton(request.id, true)}>Accept</button>
                                            <button type="button" className="btn btn-sm btn-danger mx-1" onClick={()=>handleApproveButton(request.id, false)}>Reject</button>
                                        </td>
                                    </tr>
                                )}
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
          )
}
export default PendingRequest;