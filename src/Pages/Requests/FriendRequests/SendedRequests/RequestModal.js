import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { useState } from "react";
import { alertError, alertSuccess } from "../../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import FriendRequestAPI from "../../../../APIs/user-service/FriendRequestAPI.js";

export const AddFriendModal=({setShow})=>{
        const [email, setEmail]=useState("");
        const [content, setContent]=useState("");
        function handleRequestButton(){
                FriendRequestAPI.createFriendRequest({email, content}).then(res=>{
                        setShow(false);
                        alertSuccess("Send friend request successfully");
                })
                .catch(err=>alertError(handleAxiosError(err)));
        }   

          return(
          <Modal show={true} onHide={()=>setShow(false)}>
                    <Modal.Header closeButton>
                              <Modal.Title>Add new friend</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                              <Form>
                                        <Row className="mb-3">
                                                  <Form.Group as={Col} controlId="email">
                                                            <Form.Label>Enter your friend email</Form.Label>
                                                            <Form.Control type="text" onChange={(e)=>setEmail(e.target.value)}/>
                                                  </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                                  <Form.Group as={Col} controlId="channelName">
                                                            <Form.Label>Send some text message to your friend:</Form.Label>
                                                            <Form.Control as="textarea" rows={3} onChange={(e)=>setContent(e.target.value)}/>
                                                  </Form.Group>
                                        </Row>
                              </Form>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button variant="primary" onClick={()=>handleRequestButton()}>Send friend request</Button>
                    </Modal.Footer>
          </Modal>
          )
}