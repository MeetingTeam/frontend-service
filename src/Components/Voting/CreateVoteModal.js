import { Button, Form, InputGroup, Modal} from "react-bootstrap";
import { useRef, useState } from "react";
import VotingAPI from "../../APIs/chat-service/VotingAPI.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";

const CreateVoteModal=({nickName, teamId, channel,setShow})=>{
          const [voting, setVoting]=useState({
                title: "",
                isSingleAnswer: false,
                endTime: null,
                options: ["",""],
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
            updatedData.options.push("");
            setVoting(updatedData);
          }
          function handleOnChange(fieldName,e,index){
                const updatedData=structuredClone(voting);
                if(fieldName=="title")
                    updatedData.title=e.target.value;
                else if(fieldName=="options")
                    updatedData.options[index]=e.target.value;
                else if(fieldName=="endTime")
                    updatedData.endTime=endDateRef.current.value+"T"+endTimeRef.current.value;
                else if(fieldName=="isSingleAnswer")
                    updatedData.isSingleAnswer=e.target.checked;
                setVoting(updatedData);
          }
          function handleSubmit(){
                if(voting.options.length<2){
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
                    voting: voting
                }  
                console.log("message", message)
                VotingAPI.createVoting(message).then(res=>{
                    setShow({type:0, message:null});
                })
                .catch(err=>setError(handleAxiosError(err)));
          }

          return(
            <Modal show={true} onHide={() => setShow({ type: 0, message: null })}>
                <Modal.Header closeButton className="py-2">
                    <Modal.Title className="fs-6">Create New Vote</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">
                    <Form>
                        <Form.Group controlId="title">
                            <Form.Label className="mb-1">Vote Title</Form.Label>
                            <Form.Control size="sm" onChange={(e) => handleOnChange("title", e)} placeholder="Enter title"/>
                        </Form.Group>
                        <Form.Group controlId="options" className="mt-2">
                            <Form.Label className="mb-1">Options</Form.Label>
                            {voting.options.map((option, index) => (
                                <InputGroup key={index} className="mb-1">
                                    <Form.Control size="sm" type="text" placeholder={`Option ${index + 1}`} onChange={(e) => handleOnChange("options", e, index)} value={option.name}/>
                                    <Button variant="outline-danger" size="sm" onClick={() => deleteOptionTb(index)}>X</Button>
                                </InputGroup>
                            ))}
                            <Button variant="outline-primary" size="sm" onClick={addOptionTb}>+ Add</Button>
                        </Form.Group>
                        <Form.Group controlId="endTime" className="mt-2">
                            <Form.Label className="mb-1">End Time (Optional)</Form.Label>
                            <Form.Control type="date" size="sm" ref={endDateRef} onChange={(e) => handleOnChange("endTime", e)} />
                            <Form.Control type="time" size="sm" ref={endTimeRef} onChange={(e) => handleOnChange("endTime", e)} />
                        </Form.Group>
                        <Form.Group controlId="isSingleAnswer" className="mt-2">
                            <Form.Check type="switch" label="Single Choice" onChange={(e) => handleOnChange("isSingleAnswer", e)}/>
                        </Form.Group>
                        {error && <div className="text-danger small mt-2">{error}</div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer className="py-2">
                    <Button variant="primary" size="sm" onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>          
        )
}
export default CreateVoteModal;