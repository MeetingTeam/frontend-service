import { Col, Modal, Row } from "react-bootstrap";
import Avatar from "../Avatar/Avartar.js";

const ReactionDetails=({reactions, people, setShow})=>{
          return(
          <Modal show={reactions} onHide={()=>setShow(null)}>
                    <Modal.Header closeButton>
                              <Modal.Title>Emotions about the message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                             {reactions.map(reaction=>{
                                        let index=people.findIndex((person)=>(person.id===reaction.userId));
                                        const owner=people[index];
                                        return(
                                                  <Row key={owner.id}>
                                                            <Col lg="2">
                                                                      <Avatar src={owner.urlIcon}/>
                                                            </Col>
                                                            <Col lg="8">{owner.nickName}</Col>
                                                            <Col lg="2">{reaction.emojiCode}</Col>
                                                  </Row>
                                        )
                             })}
                    </Modal.Body>
          </Modal>
          )
}

export default ReactionDetails;