import { useState } from "react";
import { Button, Col, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Avatar from "../../../../Components/Avatar/Avartar.js";
import TeamMemberAPI from "../../../../APIs/team-service/TeamMemberAPI.js";
import { alertError } from "../../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";

const FriendsListModal=({team, setShow})=>{
          const members=team.members;
          const friends=useSelector(state=>state.friends);
          const [friendIds, setFriendIds]=useState([]);
          
          function handleCheckbox(friendId){
                    setFriendIds(prev=>{
                              prev.push(friendId);
                              return prev;
                    })
          }
          function addFriends(){
                TeamMemberAPI.addFriendsToTeam(friendIds,team.id)
                        .catch(err=>alertError(handleAxiosError(err)));
          }

          return(
          <Modal show={true} onHide={()=>setShow(false)}>
                    <Modal.Header closeButton>
                              <Modal.Title>Friends List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                              <Form>
                              <InputGroup>
                                        <InputGroup.Text><i className="fa fa-search"></i></InputGroup.Text>
                                        <FormControl type="text" placeholder="Search..." />
                                </InputGroup>
                              {friends.map(friend=>{
                                        let index=members.findIndex(member=>member.user.id==friend.id);
                                        if(index===-1||members[index].role=="LEAVE") return(
                                                  <Row className="justify-content-begin"  key={friend.id}>
                                                            <Col lg="1">
                                                                      <Form.Check type="checkbox" onChange={()=>handleCheckbox(friend.id)}/>
                                                            </Col>
                                                            <Col lg="11">
                                                                      <Avatar src={friend.urlIcon}/>
                                                                      {friend.nickName}
                                                            </Col>
                                                  </Row>
                                        )
                              })} 
                              </Form>
                              <Row>
                                        <div>Send team id to invite friends:</div>
                                        <div><b>{team.id}</b></div>
                              </Row>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button variant="primary" onClick={addFriends}>Add Friends</Button>
                    </Modal.Footer>
          </Modal>
          )
}
export default FriendsListModal;