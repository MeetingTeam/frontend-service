import { useState } from "react";
import { Button, Col, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Avatar from "../../../../Components/Avatar/Avartar.js";
import TeamMemberAPI from "../../../../APIs/team-service/TeamMemberAPI.js";
import { alertError, alertSuccess } from "../../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import FriendAPI from "../../../../APIs/user-service/FriendAPI.js";
import { teamRoles } from "../../../../Utils/Constraints.js";

const FriendsListModal=({user, team, setShow})=>{
          const members=team.members;
          const friends=useSelector(state=>state.friends);
          const [searchTerm, setSearchTerm]=useState("");
          const [searchFriends, setSearchFriends]= useState(null);
          const [friendIds, setFriendIds]=useState([]);
          
          function handleCheckbox(friendId){
                    setFriendIds(prev=>{
                              prev.push(friendId);
                              return prev;
                    })
          }
          function addFriends(){
                TeamMemberAPI.addFriendsToTeam({
                        friendIds: friendIds,
                        teamId: team.id
                })
                .then(res=>{
                        setShow(false);
                        alertSuccess("Add friends successfully");
                })
                .catch(err=>alertError(handleAxiosError(err)));
          }
          function handleSearchForm(e){
                e.preventDefault();
                FriendAPI.searchFriendsByName(searchTerm).then(res=>{
                        setSearchFriends(res.data);
                })
                .catch(err=>alertError("Unable to search. Check internet connection"));
          }

          const filterFriends=searchFriends?searchFriends:friends;
          return(
          <Modal show={true} onHide={()=>setShow(false)}>
                    <Modal.Header closeButton>
                              <Modal.Title>Friends List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                              <Form  className="mb-2" onSubmit={(e)=>handleSearchForm(e)}>
                                        <InputGroup size="sm">
                                                <InputGroup.Text><i className="fa fa-search"></i></InputGroup.Text>
                                                <FormControl type="text" placeholder="Search by nickName" onChange={(e)=>setSearchTerm(e.target.value)}/>
                                        </InputGroup>
                                </Form>
                              {filterFriends.map(friend=>{
                                        let index=members.findIndex(member=>(friend.id==member.user.id));
                                        if(index===-1||members[index].role==teamRoles.LEAVE) 
                                                return(
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