import "./Message.css"
import VideoIcon from "../../Resources/VideoIcon.png"
import AudioIcon from "../../Resources/AudioIcon.png"
import FileIcon from "../../Resources/FileIcon.jpg"
import { messageTypes } from "../../Configs/Constraints.js"
import { getFileSize } from "../../Utils/FileUtil.js"

const MessageType=({message})=>{
    if(message.type==messageTypes.TEXT)
        return message.content;
    else if(message.type==messageTypes.UNSEND){
              return (<div className="unsendMessage">Message has been deleted</div>);
    }
    else{
        const mediaFile=message.mediaFile;
        if(message.type==messageTypes.IMAGE){
            return (<img className="customImage" src={mediaFile.fileUrl} alt={mediaFile.fileName}/>)
        }
        else if(message.type==messageTypes.VIDEO){
                    return (
                    <div>
                            <img src={VideoIcon} type={mediaFile.fileType} alt="VideoIcon" width="40px" height="40px"/>
                            <a href={mediaFile.fileUrl}>{mediaFile.fileName}</a><br/>
                            <small>{getFileSize(mediaFile.fileSizeInBytes)}</small>
                    </div>
                )
        }
        else if(message.type==messageTypes.AUDIO){
                return (
                    <div>
                            <img src={AudioIcon} type={mediaFile.fileType} alt="AudioIcon" width="40px" height="40px"/>
                            <a href={mediaFile.fileUrl}>{mediaFile.fileName}</a><br/>
                            <small>{getFileSize(mediaFile.fileSizeInBytes)}</small>
                    </div>
                )
        }
        else if(message.type==messageTypes.DOCUMENT){
            return (
                <div>
                        <img src={FileIcon} alt="FileIcon" width="40px" height="40px"/>
                        <a href={mediaFile.fileUrl}>{mediaFile.fileName}</a><br/>
                        <small>{getFileSize(mediaFile.fileSizeInBytes)}</small>
                </div>
            )
        }
    } 
}
export default MessageType;