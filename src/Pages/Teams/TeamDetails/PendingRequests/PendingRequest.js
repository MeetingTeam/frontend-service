import { useEffect, useState } from "react";
import TableHeader from "../../../../Components/TableHeader/TableHeader.js";
import Avatar from "../../../../Components/Avatar/Avartar.js";
import TeamRequestAPI from "../../../../APIs/team-service/TeamRequestAPI.js";

const PendingRequest=({team})=>{
          const [requests, setRequests]=useState([]);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          
          useEffect(()=>{
            TeamRequestAPI.getTeamRequests(team.id).then(res=>{
                        setRequests(res.data);
                    })
          },[])
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.user.nickName.match(re);
            }
          function handleAcceptButton(e, requestId){
                    e.preventDefault();
                    TeamRequestAPI.acceptNewMember(team.id,requestId).then(res=>{
                            setRequests(prev=>prev.filter(request=>request.id!=requestId))
                    });
          }
          function handleDeleteButton(e, requestId){
                    e.preventDefault();
                    TeamRequestAPI.deleteTeamRequest(requestId).then(res=>{
                              setRequests(prev=>{
                                        return prev.filter(request=>request.id!=requestId);
                              })
                    })
          }

          let filterRequests=(search==="")?requests:requests.filter(handleFilter);
          return(
          <div className="tablePage">
                    <div className="contentAlignment mb-2">
                              <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                                    <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                              </form>
                    </div>
                    <div className="TableWapper border-bottom border-dark">
                        <table className="table table-hover">
                            <TableHeader data={["Name", "Email","Message","Action"]} />
                            <tbody>
                        {filterRequests?.map((request, index)=> {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <Avatar src={request.sender.urlIcon}/>
                                            {request.sender.nickName}
                                        </td>
                                        <td>{request.sender.email}</td>
                                        <td>{request.content}</td>
                                        <td>
                                             <button type="button" className="btn btn-primary" onClick={(e)=>handleAcceptButton(e,request.id)}>Accept</button>
                                            <button type="button" className="btn btn-danger" onClick={(e)=>handleDeleteButton(e,request.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
          </div>
          )
}
export default PendingRequest;