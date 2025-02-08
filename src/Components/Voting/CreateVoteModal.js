import { Button, Form, InputGroup, Modal} from "react-bootstrap";
import { useRef, useState } from "react";
import VotingAPI from "../../APIs/chat-service/VotingAPI.js";

const CreateVoteModal=({nickName, teamId, channel,setShow})=>{
          const [voting, setVoting]=useState({
                title: "",
                isSingleAnswer: false,
                endTime: null,
                options: [{name:""},{name:""}],
                events:[]
            });
            const endDateRef = useRef();
            const endTimeRef = useRef();
            const [error, setError]=useState(null);

          function deleteOptionTb(index){
                const updatedData = { ...voting };
                updatedData.options=updatedData.options.filter((_,i)=>i!=index);
                setVoting(updatedData);
          }
          function addOptionTb(){
            const updatedData = { ...voting };
            updatedData.options.push({name:""});
            setVoting(updatedData);
          }
          function handleOnChange(fieldName,e,index){
                const updatedData={...voting};
                if(fieldName=="title")
                    updatedData.title=e.target.value;
                else if(fieldName=="options")
                    updatedData.options[index].name=e.target.value;
                else if(fieldName=="endTime")
                    updatedData.endTime=endDateRef.current.value+"T"+endTimeRef.current.value;
                else if(fieldName=="isSingleAnswer")
                    updatedData.isSingleAnswer=e.target.checked;
                setVoting(updatedData);
          }
          function handleSubmit(){
                if(message.options.length<2){
                    setError("Please add at least two options");
                    return;
                }
                else if(voting.title.trim().length==0){
                    setError("Please fill in the title of the vote");
                    return;
                }      
                const message={
                    channelId: channel.id,
                    teamId: teamId,
                    username: nickName,
                    voting
                }  
                VotingAPI.createVoting(message).then(res=>{
                    setShow({type:0, message:null});
                })
                .catch(err=>setError(err.response.data));
          }

          return(
          <Modal show={true} onHide={()=>setShow({type:0, message:null})}>
                    <Modal.Header closeButton>
                            <Modal.Title>Create new vote</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                              <Form.Group className="mb-3" controlId="title">
                                        <Form.Label>Vote Title</Form.Label>
                                        <Form.Control as="textarea" onChange={(e)=>handleOnChange("title",e)} rows={3} placeholder="Add your title here"/>
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="title">
                                        <Form.Label>Options</Form.Label>
                                        {message.voting.options.map((option, index) =>{
                                            return(
                                                <InputGroup key={index} className="mb-3">
                                                    <Form.Control type="text" 
                                                        placeholder={`Option ${index}`}
                                                        onChange={(e)=>handleOnChange("options",e,index)} 
                                                        value={option.name}
                                                    />
                                                    <Button variant="outline-danger" onClick={()=>deleteOptionTb(index)}>X</Button>
                                                </InputGroup>
                                            )
                                        })}
                                        <Button variant="outline-primary" onClick={addOptionTb}>+ Add option</Button>
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="endTime">
                                        <Form.Label>End Time (Optional)</Form.Label>
                                        <Form.Control type="date" ref={endDateRef} onChange={(e)=>handleOnChange("endTime",e)}/>
                                        <Form.Control type="time" ref={endTimeRef} onChange={(e)=>handleOnChange("endTime",e)}/>
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="isSingleAnswer">
                                        <Form.Check type="switch" label="Allow to choose only one option" onChange={(e)=>handleOnChange("isSingleAnswer",e)}/>
                              </Form.Group>
                              {error!=null&&<div className="error">{error}</div>}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={()=>handleSubmit()}>Submit</Button>
                    </Modal.Footer>
         </Modal>
        )
}
export default CreateVoteModal;