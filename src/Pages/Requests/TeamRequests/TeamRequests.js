import { useEffect, useState } from "react";
import Avatar from "../../../Components/Avatar/Avartar.js";
import JoinRequestModal from "./JoinRequestModal.js";
import TableHeader from "../../../Components/TableHeader/TableHeader.js";
import TeamRequestAPI from "../../../APIs/team-service/TeamRequestAPI.js";
import { alertError } from "../../../Utils/ToastUtil.js";
import { getTimeDistance } from "../../../Utils/DateTimeUtil.js";

const TeamRequests=()=>{
          const [requests, setRequests]=useState([]);
          const [showJoinRequestModal, setShowJoinRequestModal]=useState(false);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          
          useEffect(()=>{
                TeamRequestAPI.getSendedRequests().then(res=>{
                              setRequests(res.data);
                })
                .catch(err=>alertError("Unable to fetch team reuqests.Please try again"));
          },[])
          
          function handleDeleteButton(requestId){
                TeamRequestAPI.deleteTeamRequest(requestId).then(res=>{
                              setRequests(prev=>prev.filter(request=>request.id!=requestId));
                })
                .catch(err=>alertError('Failed to delete request'));
          }
          function handleFilter(item) {
                    const re = new RegExp("^"+search,"i");
                    return item.team.teamName.match(re);
          }
          function getStatus(request){
            if(request.isAccepted==null) return "PENDING";
            else if(request.isAccepted) return "ACCEPT";
            else return "REJECT";
          }

          const filterRequests=(search==="")?requests:requests.filter(handleFilter);
          return(
                <>
                    {showJoinRequestModal&&<JoinRequestModal setShow={setShowJoinRequestModal} />}
                    <div className="chat">
                    <div className="chat-header clearfix">
                        <div className="chat-about">
                            <h6 className="m-b-0">Sended Team Requests</h6>
                                <small>{requests.length} requests</small>
                        </div>
                    </div>
                    <div className="request-history">
                        <div className="tablePage">
                            <div className="contentAlignment">
                                        <button type="button" className="btn btn-secondary" onClick={()=>setShowJoinRequestModal(true)}>Send team request</button>
                                        <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                                  <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                                                  <button className="btn btn-outline-success" type="submit" >Search</button>
                                        </form>
                              </div>
                              <div className="TableWapper border-bottom border-dark">
                              <table className="table table-hover">
                              <TableHeader data={["Team","Message","Time","Status", "Action"]} />
                              <tbody>
                              {filterRequests?.map((request)=> {
                                        
                                        return (
                                        <tr key={request.id}>
                                                  <td>
                                                            <Avatar src={request.team.urlIcon}/> {request.team.teamName}
                                                  </td>
                                                  <td>{request.content}</td>
                                                  <td>{getTimeDistance(request.createdAt)}</td>
                                                  <td>{getStatus(request)}</td>
                                                  <td>
                                                            <button type="button" className="btn btn-danger" onClick={()=>handleDeleteButton(request.id)}>Delete</button>
                                                  </td>
                                        </tr>
                                        )
                              })}
                              </tbody>
                              </table>
                          </div>
                      </div>
                    </div>
                </div>
          </>
          )
}
export default TeamRequests;