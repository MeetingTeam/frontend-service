import { useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useSnackbarUtil } from "../../../../Utils/SnackbarUtil.js";
import MeetingAPI from "../../../../APIs/meeting-service/MeetingAPI.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";
import { DateTime } from "luxon";
import { getHourMinuteOnly, getTime } from "../../../../Utils/DateTimeUtil.js";

const daysOfWeek=["Sun","Mon","Tue","Wed","Thu","Fri","Sar"];
const MeetingModal=({meeting, setShow, noChange})=>{
          const { showSuccessMessage, showErrorMessage } = useSnackbarUtil();
          const [meetingDTO, setMeetingDTO]=useState({...meeting});
          const [error, setError]=useState({
                txtTitle:null,
                txtScheduledTime:null, 
                txtEndDate: null
          })
          
         function handleOnChange(e, fieldName, day){
                let value=null;
                if(fieldName=="scheduledDaysOfWeek"){
                        let hasDay=false;
                        value=meetingDTO.scheduledDaysOfWeek.filter(scheduledDay=>{
                                if(day==scheduledDay){
                                        hasDay=true;
                                }
                                return !(day==scheduledDay);
                        });
                        if(!hasDay) value.push(day);
                }
                else if(fieldName=="scheduledTime"){
                        value=e.target.value+":00.000";
                }
                else value=e.target.value;

                var updatedMeeting= {...meetingDTO};
                updatedMeeting[fieldName]=value;
                setMeetingDTO(updatedMeeting);
          }
          function validateData(){
                let txtTitle, txtScheduledTime=null, txtEndDate= null;
                if(!meetingDTO.title||meetingDTO.title=="") txtTitle="Title must not be empty";
                if(!meetingDTO.scheduledTime) txtScheduledTime="Schedule Time is required";
                else {
                        var startDateTime= DateTime.fromISO(meetingDTO.startDate)
                        if(meetingDTO.endDate){
                                var endDateTime =DateTime.fromISO(meetingDTO.endDate);
                                if(startDateTime>endDateTime) txtEndDate="End time must be after start date";
                        }
                }
                setError({txtTitle, txtScheduledTime, txtEndDate})
                return !(txtTitle||txtScheduledTime||txtEndDate);
          }
          function handleSubmit(e){
                e.preventDefault();
                if(validateData()){
                        if(!meetingDTO.id) {
                                MeetingAPI.createMeeting(meetingDTO).
                                        then(res=>{
                                                showErrorMessage("Create new meeting successfully");
                                                setShow(null);
                                        })
                                        .catch(err=>showErrorMessage(handleAxiosError(err)));
                        }
                        else {
                                MeetingAPI.updateMeeting(meetingDTO)
                                .then(res=>{
                                        showSuccessMessage("Update meeting successfully");
                                        setShow(null);
                                })
                                .catch(err=>showErrorMessage(handleAxiosError(err)));
                        }
                }
          }
          return(
          <Modal show={true} onHide={()=>setShow(null)}>
                    <Modal.Header closeButton>
                            <Modal.Title>Edit Meeting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <Form>
                                        <Row className="mb-3">
                                                <Form.Group as={Col} controlId="title">
                                                        <Form.Label>Title</Form.Label>
                                                        <Form.Control type="text" onChange={(e)=>handleOnChange(e,"title")} defaultValue={meetingDTO.title}/>
                                                        <div style={error.txtTitle ? { display: ''} : { display: 'none' }} className="error">{error.txtTitle}</div>
                                                </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                                <Form.Group as={Col} controlId="startDate" disabled={meetingDTO.scheduledDaysOfWeek.size==0}>
                                                        <Form.Label>Start Date</Form.Label>
                                                        <Form.Control type="date" onChange={(e)=>handleOnChange(e,"startDate")} defaultValue={meeting.startDate}/>
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="scheduledTime">
                                                        <Form.Label>Schedule Time</Form.Label>
                                                        <Form.Control type="time" onChange={(e)=>handleOnChange(e,"scheduledTime")} defaultValue={getHourMinuteOnly(meeting.scheduledTime)}/>
                                                        <div style={error.txtScheduledTime ? { display: ''} : { display: 'none' }} className="error">{error.txtScheduledTime}</div>
                                                </Form.Group>
                                        </Row>
                                        <Row className="mb-3">
                                                <div className="col-auto">
                                                        <label htmlFor="scheduledDaysOfWeek" className="col-form-label">Repeat weekly</label>
                                                </div>
                                                <div className="col-auto">
                                                        <div className="btn-group" role="group" aria-label="Days of the Week">
                                                                {daysOfWeek.map((day, index)=>{
                                                                        let isChoosed=meetingDTO.scheduledDaysOfWeek.find(day=>day==index+1);
                                                                        return(
                                                                                <button key={index} type="button" className={"btn btn-circle "+(isChoosed?"btn-primary":"btn-light")} onClick={(e)=>handleOnChange(e,"scheduledDaysOfWeek", index+1)}>
                                                                                        {day}
                                                                                </button>
                                                                        )
                                                                })}
                                                        </div>
                                                </div>
                                        </Row>
                                        <Row className="mb-3">
                                                <Form.Group as={Col} controlId="endDate" disabled={meetingDTO.scheduledDaysOfWeek.size==0}>
                                                        <Form.Label>End Date(if schedule meeting repeatly)</Form.Label>
                                                        <Form.Control type="date" onChange={(e)=>handleOnChange(e,"endDate")} defaultValue={meeting.endDate}/>
                                                        <div style={error.txtEndDate? { display: ''} : { display: 'none' }} className="error">{error.txtEndDate}</div>
                                                </Form.Group>
                                        </Row>
                            </Form>
                    </Modal.Body>
                    {!noChange&&<Modal.Footer>
                        <Button variant="primary" onClick={(e)=>handleSubmit(e)}>Submit</Button>
                    </Modal.Footer>}
        </Modal>
          )
}
export default MeetingModal;