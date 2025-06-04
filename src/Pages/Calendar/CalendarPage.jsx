import { useEffect, useState } from "react";
import "./Calendar.css";
import { useSelector } from "react-redux";
import CalendarAPI from "../../APIs/meeting-service/CalendarAPI.js";
import { alertError } from "../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../Utils/ErrorUtil.js";
import { formatDate, getCalendarTime, getHour } from "../../Utils/DateTimeUtil.js";
import MeetingModal from "../Teams/VoiceChannel/Component/MeetingModal.jsx";
import { DateTime } from "luxon";

const daysOfWeek=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const colors=["btn-primary","btn-secondary","btn-success","btn-danger","btn-warning","btn-info","btn-light","btn-dark"];
const hours=Array.from({ length: 24 }, (_, i) => i);

const CalendarPage=()=>{
        const user=useSelector(state=>state.user);
        const [week, setWeek]=useState(0);
        const [weekRange, setWeekRange]=useState([new Date(), new Date()]);
        const [meetings, setMeetings]=useState([]);
        const [meetingModal, setMeetingModal]=useState(null);   
        const [mIndexesOfDays, setMIndexesOfDays]=useState([[],[],[],[],[],[],[]]);

        useEffect(()=>{
            CalendarAPI.getMeetingsOfWeek(week).then(res=>{
                let colorIndex=0;
                setMeetings(res.data.meetings.map(m=>{
                    if(m.scheduledTime){
                        m.scheduledTime=DateTime.fromFormat(m.scheduledTime,"HH:mm:ss");
                    }
                    if(m.startDate){
                        m.startDate=DateTime.fromISO(m.startDate);
                    }
                    colorIndex=chooseColor(colorIndex);
                    m.color=colors[colorIndex];
                    return m;
                }));
                setWeekRange(res.data.weekRange);               
            })
            .catch(err=>alertError(handleAxiosError(err)));
        },[week]);
        useEffect(()=>{
            const updatedData=[];
            for(let i=0;i<7;i++) updatedData.push([]);
            for(let i=0;i<meetings.length;i++){   
                var meeting=meetings[i];             
                if(meeting.scheduledDaysOfWeek&&meeting.scheduledDaysOfWeek.length>0){
                    for(var day of meeting.scheduledDaysOfWeek){
                        updatedData[day-1].push(i);
                    }
                    setMIndexesOfDays(updatedData);
                }
                else if(meeting.startDate) {
                    let dayOfWeek= meeting.startDate.weekday - 1; //0: Sun to 6:Sat
                    updatedData[dayOfWeek].push(i);
                    setMIndexesOfDays(updatedData);
                }
            }
        },[meetings]);

        function chooseColor(colorIndex){
            if(colorIndex<colors.length-1) colorIndex++;
            else colorIndex=0;
            return colorIndex;
        }
        function handleDetailBtn(mIndex){
            var meeting= {...meetings[mIndex]};
            if(meeting.startDate){
                meeting.startDate=meeting.startDate.toFormat("yyyy-MM-dd");
            }
            if(meeting.scheduledTime){
                meeting.scheduledTime=meeting.scheduledTime.toFormat("HH:mm:ss");
            }
            setMeetingModal(meeting);
        }

        return(
            <>
            {meetingModal!=null&&
                <MeetingModal meeting={meetingModal} setShow={setMeetingModal} 
                    noChange={user.id!=meetingModal.creatorId}/>}
            <div className="container">
                <div className="contentAlignment">
                    <button type="button" className="btn btn-dark" onClick={()=>setWeek(week-1)}>{"<<"}</button>
                    <h6>{formatDate(weekRange[0])} - {formatDate(weekRange[1])}</h6>
                    <button type="button" className="btn btn-dark" onClick={()=>setWeek(week+1)}>{">>"}</button>
                    <h5 className="text-center">Meeting Calendar</h5>
                </div>
                <div className="table-container">
                    <div className="table-header-wrapper">
                        <table className="table table-bordered text-center fixed-table">
                            <thead>
                                <tr>
                                    <th className="text-uppercase">Time/Day</th>
                                    {daysOfWeek.map((day, index)=>(<th className="text-uppercase" key={index}>{day}</th>))}
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="table-body-wrapper">
                        <table  className="table table-bordered text-center fixed-table .table-scroll">
                            <tbody>
                            {hours.map(hour=>{
                                return(
                                    <tr key={hour}>
                                        <th className="align-middle" style={{backgroundColor: "#F0F1F3"}}>
                                            <div>{getHour(hour)}</div>
                                        </th>
                                        {daysOfWeek.map((_,index)=>{
                                            const mIndexes=mIndexesOfDays[(index==6)?0:index+1];
                                            return(
                                                <td key={index}>
                                                {mIndexes?.map(mIndex=>{
                                                    if(mIndex>=meetings.length) return;
                                                    var meeting=meetings[mIndex];
                                                    if(meeting.scheduledTime.hour==hour)
                                                    return (                                                
                                                        <div key={mIndex} className="meeting-info">
                                                            <button type="button" className={"btn "+meeting.color} onClick={()=>handleDetailBtn(mIndex)}>
                                                                    <b>{meeting.title}</b>
                                                                    <div className="time-info">Starts at {getCalendarTime(meeting.scheduledTime)}</div>                                                             
                                                            </button>
                                                        </div>)
                                                })}
                                                </td>)
                                        })}
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
        </>
        )
}
export default CalendarPage;