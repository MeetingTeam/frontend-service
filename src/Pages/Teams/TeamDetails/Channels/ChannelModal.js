import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import ChannelAPI from "../../../../APIs/team-service/ChannelAPI.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import { alertError, alertSuccess } from "../../../../Utils/ToastUtil.js";
import { useState } from "react";

const  ChannelModal=({channel, setShow})=>{
        const [channelDTO, setChannelDTO]= useState({...channel})
        
        function handleOnChange(e, fieldName){
                const updatedDto={...channelDTO};
                updatedDto[fieldName]=e.target.value;
                setChannelDTO(updatedDto);
        }
        function handleSubmit(e){
                  e.preventDefault();
                  if(!channel.id){
                        ChannelAPI.createChannel(channelDTO).then(res=>{
                                setShow(0);
                                alertSuccess("Create channel successfully");
                        })
                        .catch(err=>alertError(handleAxiosError(err)));
                  }
                  else {
                        ChannelAPI.updateChannel(channelDTO).then(res=>{
                                setShow(0);
                                alertSuccess("Update channel successfully");
                        })
                        .catch(err=>alertError(handleAxiosError(err)));
                  }
          }
          return(
                  <Modal show={true} onHide={()=>setShow(0)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>Add or update channel</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                      <Form>
                                                  <Row className="mb-3">
                                                          <Form.Group as={Col} controlId="channelName">
                                                                  <Form.Label>Channel Name</Form.Label>
                                                                  <Form.Control type="text" onChange={(e)=>handleOnChange(e,"channelName")} defaultValue={channel.channelName}/>
                                                          </Form.Group>
                                                          <Form.Group as={Col} controlId="type">
                                                                  <Form.Label>Type</Form.Label>
                                                                  {channel.id?(<Form.Control type="text" disabled defaultValue={channel.type}/>):
                                                                        (<Form.Select onChange={(e)=>handleOnChange(e,"type")} disabled={channel.id} defaultValue={channel.type}>
                                                                          <option value="TEXT_CHANNEL">TEXT_CHANNEL</option>
                                                                          <option value="VOICE_CHANNEL">VOICE_CHANNEL</option>
                                                                        </Form.Select>)}
                                                          </Form.Group>
                                                  </Row>
                                                  <Row className="mb-3">
                                                          <Form.Group as={Col} controlId="description">
                                                                  <Form.Label>Description</Form.Label>
                                                                  <Form.Control as="textarea" rows={3} onChange={(e)=>handleOnChange(e,"description")} defaultValue={channel.description}/>
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
export default ChannelModal;