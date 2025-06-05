import { Alert } from "react-bootstrap";

const ReplyAlert=({replyMessage, setReplyMessage})=>{
    function handleClose(){
        setReplyMessage(null);
    }
    let content=replyMessage.content;
    if(content&&content.length>61) content=content.substring(0,60)+"...";
    return(
        <Alert variant="secondary"  className="mb-1" onClose={() =>handleClose()} dismissible>
               <small><strong>Reply to:</strong>  {replyMessage.content}</small>
        </Alert>
    )
}
export default ReplyAlert;