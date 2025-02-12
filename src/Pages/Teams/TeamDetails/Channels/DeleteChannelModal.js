import { Button, Modal } from "react-bootstrap";
import ChannelAPI from "../../../../APIs/team-service/ChannelAPI.js";

const DeleteChannelModal=({channel, setShow})=>{
          function handleYesButton(e){
                    e.preventDefault();
                    ChannelAPI.deleteChannel(channel.id)
                        .catch(err=>alertError(handleAxiosError(err)));
                    setShow(0);
          }
          return(
                    <Modal show={true} onHide={()=>setShow(0)}>
                              <Modal.Header closeButton>
                                        <Modal.Title>Are you sure to delete channel {channel.channelName}</Modal.Title>
                              </Modal.Header>
                    <Modal.Footer>
                        <Button size="sm" variant="warning" onClick={(e)=>handleYesButton(e)}>Yes</Button>
                        <Button size="sm" variant="danger" onClick={(e)=>setShow(0)}>No</Button>
                    </Modal.Footer>
        </Modal>
          )
}

export default DeleteChannelModal;