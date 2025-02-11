import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import MediaFileAPI from "../../../../APIs/chat-service/MediaFileAPI.js";
import TeamAPI from "../../../../APIs/team-service/TeamAPI.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import { useSnackbarUtil } from "../../../../Utils/SnackbarUtil.js";

const Settings=({team})=>{
          const { showSuccessMessage, showErrorMessage } = useSnackbarUtil();
          const [teamDTO, setTeamDTO]=useState({
                    id: team.id,
                    teamName: team.teamName,
                    autoAddMember: team.autoAddMember,
                    urlIcon: team.urlIcon
          })
          const [file, setFile]=useState(null);
          
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
                    MediaFileAPI.uploadFileToS3(file).then(fileUrl=>{
                        const dto= {...teamDTO};
                        dto.urlIcon=fileUrl;
                        TeamAPI.updateTeam(dto).then(res=>{
                            showSuccessMessage("Update team successfully");
                        })
                        .catch(err=>showErrorMessage(handleAxiosError(err)));
                    })
          }
          return(
                  <Form>
                                <Row className="mb-3">
                                        <Form.Group as={Col} sm={5} controlId="teamId">
                                                  <Form.Label>Team Id</Form.Label>
                                                  <Form.Control type="text" disabled defaultValue={team.id}/>
                                                  <Button className="btn btn-light" onClick={copyToClipboard} size="sm">
                                                        <i class="fa fa-clipboard" aria-hidden="true"></i>
                                                    </Button>
                                        </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                        <Form.Group as={Col} sm={5} controlId="teamName">
                                                  <Form.Label>Team Name</Form.Label>
                                                  <Form.Control type="text" onChange={(e)=>handleOnChange(e,"teamName")} defaultValue={team.teamName}/>
                                        </Form.Group>
                              </Row>
                              <Row className="mb-3">
                                        <Form.Group as={Col} sm={5} controlId="urlIcon">
                                                  <Form.Label>Icon Image</Form.Label>
                                                  <Form.Control type="file" onChange={(e)=>handleOnChange(e,"urlIcon")}/>
                                        </Form.Group>
                                        <Form.Group as={Col} sm={5} controlId="autoAddMember">
                                                  <Form.Label>Automatically accept join requests</Form.Label>
                                                  <Form.Check type="switch" onChange={(e)=>handleOnChange(e,"autoAddMember")} defaultValue={team.autoAddMember=="true"}/>
                                        </Form.Group>
                              </Row>
                              <Button variant="primary" onClick={(e)=>handleSubmitButton(e)}>Submit</Button>
                  </Form>
          )
}
export default Settings;