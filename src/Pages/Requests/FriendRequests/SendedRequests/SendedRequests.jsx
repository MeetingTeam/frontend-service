import { useEffect, useState } from "react";
import Avatar from "../../../../Components/Avatar/Avartar.jsx";
import TableHeader from "../../../../Components/TableHeader/TableHeader.jsx";
import { AddFriendModal } from "./RequestModal.jsx";
import FriendRequestAPI from "../../../../APIs/user-service/FriendRequestAPI.js";
import { alertError } from "../../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import { getTimeDistance } from "../../../../Utils/DateTimeUtil.js";
import UserDetailModal from "../../../../Components/UserDetail/UserDetailModal.jsx";

const SendedRequests=()=>{
          const [requests, setRequests]=useState([]);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showAddFriendModal, setShowAddFriendModal]=useState(false);
          const [newRequest, setNewRequest]=useState(null);
          const [showUserDetail, setShowUserDetail]=useState({show: false, user: null});

          useEffect(()=>{
                FriendRequestAPI.getSentRequests().then(res=>{
                    setRequests(res.data);
                })
                .catch(err=>alertError(handleAxiosError(err)));
          },[])
          useEffect(() => {
            if (newRequest) {
                setRequests(prev => [...prev, newRequest]);
            }
        }, [newRequest])
          
          function handleDeleteButton(requestId){
                    FriendRequestAPI.deleteFriendRequest(requestId).then(res=>{
                              setRequests(prev=>prev.filter(request=>request.id!=requestId));
                    })
                    .catch(err=>alertError("Fail to delete friend request"));
          }
          function handleUserDetailButton(user){
            setShowUserDetail({show: true, user: user});
          }
          function handleFilter(item) {
                    const re = new RegExp("^"+search,"i");
                    return item.recipient.nickName.match(re);
          }
          function getStatus(request){
            if(request.isAccepted==null) return "PENDING";
            else if(request.isAccepted) return "ACCEPT";
            else return "REJECT";
          }

        const filterRequests=(search==="")?requests:requests.filter(handleFilter);
        return(
          <>
          {showUserDetail.show&&<UserDetailModal showUserDetail={showUserDetail} setShowUserDetail={setShowUserDetail}/>}
            {showAddFriendModal&&<AddFriendModal setShow={setShowAddFriendModal} setNewRequest={setNewRequest}/>}
          <div className="tablePage">
                    <div className="contentAlignment">
                              <button type="button" className="btn btn-sm btn-secondary" onClick={()=>setShowAddFriendModal(true)}>Add friend</button>
                              <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                        <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                                        <button className="btn btn-outline-success" type="submit" >Search</button>
                              </form>
                    </div>
                    <div className="tableWapper border-bottom border-dark">
                        <table className="table table-hover">
                            <TableHeader data={["Name","Message","Time","Status","Recipient Info", "Action"]} />
                            <tbody>
                        {filterRequests?.map((request)=> {
                                return (
                                    <tr key={request.id}>
                                        <td rowSpan={2}>
                                                  <Avatar src={request.recipient.urlIcon}/>
                                                  {request.recipient.nickName}
                                        </td>
                                        <td>{request.content}</td>
                                        <td>{getTimeDistance(request.createdAt)}</td>
                                        <td>{getStatus(request)}</td>
                                        <td>
                                                <button type="button" className="btn btn-sm btn-info" onClick={()=>handleUserDetailButton(request.recipient)}>Info</button>
                                        </td>
                                        <td>
                                                <button type="button" className="btn btn-sm btn-danger" onClick={()=>handleDeleteButton(request.id)}>Delete</button>
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