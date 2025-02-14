import { Button, Modal } from "react-bootstrap";
import TeamAPI from "../../../../APIs/team-service/TeamAPI.js";
import { alertError, alertSuccess } from "../../../../Utils/ToastUtil.js";
import { handleAxiosError } from "../../../../Utils/ErrorUtil.js";

const DeleteTeamModal=({team, setShow})=>{
          function handleDeleteButton(e){
                    e.preventDefault();
                    TeamAPI.deleteTeam(team.id).then(res=>{
                              setShow(false);
                              alertSuccess(`Delete team ${team.teamName} successfully`);
                    })
                    .catch(err=>alertError(handleAxiosError(err)));
          }
          return(
                    <Modal show={true} onHide={()=>setShow(false)}>
                              <Modal.Header closeButton>
                                        <Modal.Title>Are you sure to delete team {team.teamName}</Modal.Title>
                              </Modal.Header>
                    <Modal.Footer>
                        <Button size="sm" variant="danger" onClick={(e)=>handleDeleteButton(e)}>Yes</Button>
                        <Button size="sm" variant="warning" onClick={(e)=>setShow(false)}>No</Button>
                    </Modal.Footer>
        </Modal>
          )
}
export default DeleteTeamModal;