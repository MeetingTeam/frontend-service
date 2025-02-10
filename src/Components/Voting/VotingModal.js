import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import VotingAPI from "../../APIs/chat-service/VotingAPI.js";
import { alertError } from "../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";

const VotingModal=({message,nickName, setShow})=>{
          const [optionNames, setOptionNames]=useState([]);
          function handleSubmit(){
                    if(optionNames.length==0) return; 
                    const chooseOptionDto={
                        messageId: message.id, 
                        optionNames,
                        nickName
                    }                             
                    VotingAPI.chooseOption(chooseOptionDto).then(res=>{
                              setShow({type:0, message: null});
                    })
                    .catch(err=>alertError(handleAxiosError(err)));
          }
          function clickOption(optionName){
                    if(message.voting.isSingleAnswer) setOptionNames([optionName]);
                    else{
                        let isExist=false;
                        const updatedData=optionNames.map(name=>{
                                if(name==optionName) isExist=true;
                                else return name;
                        });
                        if(!isExist) updatedData.push(optionName);
                        setOptionNames(updatedData);
                    }
          }
          var type=message.voting.isSingleAnswer?"radio":"checkbox";
          return(
                    <Modal show={true} onHide={()=>setShow(0)}>
                              <Modal.Header closeButton>
                                      <Modal.Title>{message.voting.title}</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                  <Form>
                                        {message.voting.options?.map((option,index)=>
                                                  <Form.Check key={index} type={type} name="votingOption"
                                                            label={option.name} onClick={()=>clickOption(option.name)}/>
                                        )} 
                                  </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                  <Button size="sm" variant="primary" onClick={(e)=>handleSubmit(e)}>Submit</Button>
                              </Modal.Footer>
                  </Modal>
          )
}
export default VotingModal;