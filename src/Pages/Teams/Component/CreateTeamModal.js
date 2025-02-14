import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateTeam } from "../../../Redux/teamsReducer.js";
import TeamAPI from "../../../APIs/team-service/TeamAPI.js";
import { handleAxiosError } from "../../../Utils/ErrorUtil.js";
import { alertError } from "../../../Utils/ToastUtil.js";

const CreateTeamModal=({setShow})=>{
          const dispatch=useDispatch();
          const [teamName, setTeamName]=useState("");
          function handleSubmit(){
                TeamAPI.createTeam({teamName: teamName}).then(res=>{
                              dispatch(updateTeam(res.data));
                              setShow(false);
                })
                .catch(err=>alertError(handleAxiosError(err)));
          }
          return(
                    <Modal show={true} onHide={()=>setShow(false)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>Send team request</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                  <Form>
                                          <Row className="mb-3">
                                                  <Form.Group as={Col} controlId="teamId">
                                                          <Form.Label>Team name</Form.Label>
                                                          <Form.Control type="text" onChange={(e)=>setTeamName(e.target.value)}/>
                                                  </Form.Group>
                                          </Row>
                                  </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                  <Button variant="primary" onClick={(e)=>handleSubmit(e)}>Submit</Button>
                              </Modal.Footer>
                  </Modal>
          )
}
export default CreateTeamModal;