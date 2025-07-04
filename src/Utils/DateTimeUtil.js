import { DateTime } from "luxon";

export function getTimeDistance(input) {
          if(!input) return "";
          const inputDate=new Date(input);
          const now=new Date();
          let minutes=Math.round((now.getTime()-inputDate.getTime())/(1000*60));
          if(minutes<60) return minutes+" minutes ago";
          else {
                    let hours=Math.round(minutes/60);
                    if(hours<24) return hours+" hours ago";
                    else {
                              let days=Math.round(hours/24);
                              if(days<31) return days+" days ago";
                              else return inputDate.getDate()+"/"+inputDate.getMonth()+"/"+inputDate.getFullYear();
                    }
          }
}

export function getDateTime(input){
          if(!input) return "";
          const now=new Date();
          const inputDate=new Date(input);
          var time=inputDate.getHours()+":"+inputDate.getMinutes();
          if(now.getFullYear()!=inputDate.getFullYear()
          ||now.getMonth()!=inputDate.getMonth()
          ||now.getDate()!=inputDate.getDate())
          time=time+", "+inputDate.getDate()+"/"+inputDate.getMonth()+"/"+inputDate.getFullYear();
          return time;
}

export function getScheduledTime(meeting){
          const {scheduledTime, scheduledDaysOfWeek, startDate, endDate}=meeting;
          if(!scheduledTime) return "";
          const daysOfWeek=["","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Sartuday"]
          const time=DateTime.fromFormat(scheduledTime, "HH:mm:ss");
          const startDateTime=DateTime.fromISO(startDate);
          if(scheduledDaysOfWeek&&scheduledDaysOfWeek.length>0){
                    let result="Occurs every ";
                    scheduledDaysOfWeek.forEach(day=>{result+=daysOfWeek[day]+","})
                    result+=" at "+time.toFormat("HH:mm");
                    result+=", from "+startDateTime.toFormat("dd/MM/yyyy");
                    if(endDate){
                              const endDateTime=DateTime.fromISO(endDate);
                              result+=" to "+endDateTime.toFormat("dd/MM/yyyy");
                    }
                    return result;
          }
          else return "schedule meeting at "+ time.toFormat("dd-MM-yyyy , HH:mm");
}

export function getDate(luxonDateTime) {
          if (!luxonDateTime) return null;
          return luxonDateTime.toISODate();
}

export function formatDate(isoDateStr){
          if(!isoDateStr) return "";
          const luxonDateTime=DateTime.fromISO(isoDateStr);
          return luxonDateTime.toFormat("dd/MM/yyyy");
}

export function getHourMinuteOnly(isoTimeStr){
          if(!isoTimeStr) return null;
          return isoTimeStr.split(":").slice(0, 2).join(":"); 
}

export function getHour(num) {
          if(num<=12) return `${num} AM`;
          else return `${num-12} PM`;
}

export function getCalendarTime(luxonDateTime) {
          if(!luxonDateTime) return "";
          return luxonDateTime.toFormat("hh:mm a");
}