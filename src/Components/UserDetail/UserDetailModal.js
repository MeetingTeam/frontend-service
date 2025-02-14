import { Modal } from "react-bootstrap";
import { formatDate } from "../../Utils/DateTimeUtil.js";
import BigAvatar from "../Avatar/BigAvatar.js";

const UserDetailModal=({showUserDetail, setShowUserDetail})=>{
          const user=showUserDetail.user;
          return (
           <Modal show={true} onHide={()=>setShowUserDetail({show:false, user:null})}>
                    <Modal.Header closeButton>
                            <Modal.Title>Personal Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                              <div className="text-center">
                                        <BigAvatar src={user.urlIcon} />
                                        <h4 className="mt-2">{user.nickName}</h4>
                              </div>
                              <hr />
                              <p><strong>Email:</strong> {user.email}</p>
                              <p><strong>Phone:</strong> {user.phoneNumber}</p>
                              <p><strong>Gender:</strong> {user.gender ? "Male" : "Female"}</p>
                              <p><strong>Birthday:</strong> {formatDate(user.birthday)}</p>
                    </Modal.Body>
            </Modal> 
          )
}

export default UserDetailModal;