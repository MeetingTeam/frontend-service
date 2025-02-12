import { useEffect, useState } from "react";
import Avatar from "../../../../Components/Avatar/Avartar.js";
import TableHeader from "../../../../Components/TableHeader/TableHeader.js";
import { AddFriendModal } from "./RequestModal.js";
import FriendRequestAPI from "../../../../APIs/user-service/FriendRequestAPI.js";
import { alertError } from "../../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import { getTimeDistance } from "../../../../Utils/DateTimeUtil.js";

const SendedRequests=()=>{
          const [requests, setRequests]=useState([]);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showAddFriendModal, setShowAddFriendModal]=useState(false);
          
          useEffect(()=>{
                FriendRequestAPI.getSentRequests().then(res=>{
                    setRequests(res.data);
                })
                .catch(err=>alertError(handleAxiosError(err)));
          },[])
          
          function handleUnsendButton(requestId){
                    FriendRequestAPI.deleteFriendRequest(requestId).then(res=>{
                              setRequests(prev=>prev.filter(request=>request.id!=requestId));
                    })
                    .catch(err=>alertError("Fail to delete friend request"));
          }
          function handleFilter(item) {
                    const re = new RegExp("^"+search,"i");
                    return item.recipient.nickName.match(re);
          }
          const filterRequests=(search==="")?requests:requests.filter(handleFilter);
         
        return(
          <>
            {showAddFriendModal&&<AddFriendModal setShow={setShowAddFriendModal}/>}
          <div className="tablePage">
                    <div className="contentAlignment mb-10">
                              <button type="button" className="btn btn-secondary" onClick={()=>setShowAddFriendModal(true)}>Add friend</button>
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
                                console.log("request", request)
                                return (
                                    <tr key={request.id}>
                                        <td>
                                                  <Avatar src={request.recipient.urlIcon}/>
                                                  {request.recipient.nickName}
                                        </td>
                                        <td>{request.content}</td>
                                        <td>{getTimeDistance(request.createdAt)}</td>
                                        <td>
                                                  <button type="button" className="btn btn-danger" onClick={()=>handleUnsendButton(request.id)}>Unsend</button>
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
export default SendedRequests;