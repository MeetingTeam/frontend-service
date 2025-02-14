import { Button, Modal } from "react-bootstrap";
import FriendAPI from "../../../APIs/user-service/FriendAPI.js";
import { alertError, alertSuccess } from "../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../Utils/ErrorUtil.js";

const UnfriendModal=({friend, setShow})=>{

          function handleYesBtn(){
                    FriendAPI.unfriend(friend.id).then(res=>{
                              alertSuccess("Unfriend successfully");
                              setShow(false);
                    }).catch(err=>alertError(handleAxiosError(err)));
          }
          return(
                    <Modal show={true} onHide={()=>setShow(false)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>Unfriend Modal</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                  <div>Are you sure to unfriend with {friend.nickName} ?</div>
                              </Modal.Body>
                              <Modal.Footer>
                                        <Button variant="warning" onClick={()=>setShow(false)}>Cancel</Button>
                                        <Button variant="primary" onClick={handleYesBtn}>Yes</Button>
                              </Modal.Footer>
                  </Modal>
          )
}
export default UnfriendModal;