import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../Components/Avatar/Avartar.js";
import TableHeader from "../../../../Components/TableHeader/TableHeader.js";
import FriendRequestAPI from "../../../../APIs/user-service/FriendRequestAPI.js";
import { getTimeDistance } from "../../../../Utils/DateTimeUtil.js";
import { alertError } from "../../../../Utils/ToastUtil.js";

const RecievedRequests=()=>{
          const friendRequests=useSelector(state=>state.friendRequests);
          const user=useSelector(state=>state.user);
          const [requests, setRequests]=useState([]);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          useEffect(()=>{
                FriendRequestAPI.getReceivedRequests().then(res=>{
                    setRequests(res.data);
                })
                .catch(err=>alertError("Unable to load received requests"))
          },[])
          
          function handleApproveButton(requestId, isAccepted){
                FriendRequestAPI.acceptFriend(requestId, isAccepted).then(res=>{
                        setRequests(prev=>prev.filter(request=>request.id!=requestId));
                })
                .catch(err=>alert(err.response.data));
          }
          function handleFilter(item) {
                    const re = new RegExp("^"+search,"i");
                    return item.sender.nickName.match(re);
          }

          const filterRequests=(search==="")?requests:requests.filter(handleFilter);
          return(
                  <div className="tablePage">
                            <div className="contentAlignment mb-10">
                                      <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                                <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                                                <button className="btn btn-outline-success" type="submit" >Search</button>
                                      </form>
                            </div>
                            <div className="TableWapper border-bottom border-dark">
                                <table className="table table-hover">
                                    <TableHeader data={["Name","Message","Time","Action"]} />
                                    <tbody>
                                {filterRequests?.map((request)=> {
                                        return (
                                            <tr key={request.id}>
                                                <td>
                                                          <Avatar src={request.sender.urlIcon}/>
                                                          {request.sender.nickName}
                                                </td>
                                                <td>{request.content}</td>
                                                <td>{getTimeDistance(request.createdAt)}</td>
                                                <td>
                                                          <button type="button" className="btn btn-success" onClick={()=>handleApproveButton(request.id, true)}>Accept</button>
                                                          <button type="button" className="btn btn-danger" onClick={()=>handleApproveButton(request.id, false)}>Reject</button>
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
export default RecievedRequests;