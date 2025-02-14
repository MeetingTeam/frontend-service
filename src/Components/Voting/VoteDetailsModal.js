import { Accordion, Col, Container, Modal, Row } from "react-bootstrap";
import Avatar from "../Avatar/Avartar.js";
import { getDateTime } from "../../Utils/DateTimeUtil.js";

const VoteDetailModal=({message,team,setShow})=>{
          const members=team.members;
          return(
          <Modal show={true} onHide={()=>setShow({type:0, message:null})}>
                    <Modal.Header closeButton>
                              <Modal.Title>{message.voting.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                              <Accordion>
                                        <Accordion.Item eventKey="0">
                                                  <Accordion.Header><i>Vote History</i></Accordion.Header>
                                                  <Accordion.Body>
                                                            {message.voting.events.map((votingEvent,index)=>(
                                                                      <Row key={index}>
                                                                                <Col xs={3}><b>{getDateTime(votingEvent.createdAt)}</b></Col>
                                                                                <Col xs={9}>{votingEvent.content}</Col>
                                                                      </Row>
                                                            ))}
                                                  </Accordion.Body>
                                        </Accordion.Item>
                                        {message.voting.options.map((option,index)=>{
                                                  return(
                                                  <Accordion.Item key={index} eventKey={index+1}>
                                                            <Accordion.Header>{option.name}</Accordion.Header>
                                                            <Accordion.Body>
                                                                     {option.userIds.map(userId=>{
                                                                                const owner=members.find(member=>member.user.id==userId);
                                                                                if(owner) return(
                                                                                          <Col lg="12" key={userId}>
                                                                                                    <Avatar src={owner.user.urlIcon}/> {owner.user.nickName}
                                                                                          </Col>
                                                                                )
                                                                     })}
                                                            </Accordion.Body>
                                                  </Accordion.Item>  
                                                  )
                                        })}
                              </Accordion>                           
                    </Modal.Body>
          </Modal>
          )
}
export default VoteDetailModal;