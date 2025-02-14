import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import MediaFileAPI from "../../../../APIs/chat-service/MediaFileAPI.js";
import TeamAPI from "../../../../APIs/team-service/TeamAPI.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import { alertError, alertSuccess } from "../../../../Utils/ToastUtil.js";
import DeleteTeamModal from "./DeleteTeamModal.js";
import { useSelector } from "react-redux";
import { teamRoles } from "../../../../Utils/Constraints.js";

const Settings=({team})=>{
          const user=useSelector(state=>state.user);
          const [teamDTO, setTeamDTO]=useState({
                    id: team.id,
                    teamName: null,
                    autoAddMember: null,
                    urlIcon: null
          });
          const [file, setFile]=useState(null);
          const [showDeleteModal, setShowDeleteModal]=useState(false);
          const roleOfOwner=team.members?.find(member=>member.user.id==user.id)?.role;
          
          async function copyToClipboard(){
                await navigator.clipboard.writeText(team.id);
          }
          function handleOnChange(e, fieldName){
                    e.preventDefault();
                    if(fieldName=="urlIcon") setFile(e.target.files[0]);
                    else setTeamDTO(prev=>{
                              prev[fieldName]=e.target.value;
                              return prev;
                    });
          }
          function handleSubmitButton(e){
                    e.preventDefault();
                    if(file) {
                        MediaFileAPI.uploadFileToS3(file).then(fileUrl=>{
                            const dto= {...teamDTO};
                            dto.urlIcon=fileUrl;
                            TeamAPI.updateTeam(dto).then(res=>{
                                alertSuccess("Update team successfully");
                            })
                            .catch(err=>alertError(handleAxiosError(err)));
                        })
                    }
                    else{
                        TeamAPI.updateTeam(teamDTO).then(res=>{
                            alertSuccess("Update team successfully");
                        })
                        .catch(err=>alertError(handleAxiosError(err)));
                    }
            }
       
          return(
            <>
                {showDeleteModal&&<DeleteTeamModal team={team} setShow={setShowDeleteModal}/>}
                  <Form>
                                <Row className="mb-1">
                                        <Form.Group as={Col} sm={5} controlId="teamId">  
                                                <Form.Label>Team Id</Form.Label>                                              
                                                <Form.Control type="text" disabled defaultValue={team.id}/>
                                                <Button className="btn btn-light" onClick={copyToClipboard} size="sm">
                                                    <i className="fa fa-clipboard" aria-hidden="true"></i>
                                                </Button>
                                        </Form.Group>
                              </Row>
                              <Row className="mb-1">
                                        <Form.Group as={Col} sm={5} controlId="teamName">
                                                  <Form.Label>Team Name</Form.Label>
                                                  <Form.Control type="text" onChange={(e)=>handleOnChange(e,"teamName")} defaultValue={team.teamName}/>
                                        </Form.Group>
                              </Row>
                              <Row className="mb-1">
                                        <Form.Group as={Col} sm={5} controlId="urlIcon">
                                                  <Form.Label>Icon Image</Form.Label>
                                                  <Form.Control type="file" onChange={(e)=>handleOnChange(e,"urlIcon")}/>
                                        </Form.Group>
                                        <Form.Group as={Col} sm={5} controlId="autoAddMember">
                                                  <Form.Label>Automatically accept join requests</Form.Label>
                                                  <Form.Check type="switch" onChange={(e)=>handleOnChange(e,"autoAddMember")} defaultValue={team.autoAddMember=="true"}/>
                                        </Form.Group>
                              </Row>
                              <div className="mt-3">
                                    {roleOfOwner==teamRoles.LEADER&&
                                        <Button size="sm" className="mx-1" variant="danger" onClick={()=>setShowDeleteModal(true)}>Delete Team</Button>}
                                    <Button size="sm" className="mx-1" variant="primary" onClick={(e)=>handleSubmitButton(e)}>Update Team</Button>
                              </div>
                  </Form>
            </>
          )
}
export default Settings;