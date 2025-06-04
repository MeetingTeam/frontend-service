import { useSelector } from "react-redux";
import { useState } from "react";
import ChannelModal from "./ChannelModal.jsx";
import TableHeader from "../../../../Components/TableHeader/TableHeader.jsx";
import { channelTypes, teamRoles } from "../../../../Configs/Constraints.js";
import DeleteChannelModal from "./DeleteChannelModal.jsx";

const Channels=({team})=>{
          const user=useSelector(state=>state.user);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const roleOfUser=team.members.filter(member=>member.user.id==user.id)[0].role;

          const [choosedChannel, setChoosedChannel]=useState(null);
          const [showModal, setShowModal]=useState(0);
          
          function handleFilter(item) {
                    const re = new RegExp("^"+search,"i");
                    return item.channelName.match(re);
            }
          function handleAddButton(e){
                    setChoosedChannel({
                              teamId: team.id,
                              channelName:"",
                              type: channelTypes.CHAT_CHANNEL,
                              description:""
                    });
                    setShowModal(1);              
          }
          function handleUpdateButton(channel){
                    setChoosedChannel(channel);
                    setShowModal(1);
          }
          function handleDeleteButton(channel){
                setChoosedChannel(channel);
                setShowModal(2);
          }

          const filterChannels=(search=="")?team.channels:team.channels.filter(handleFilter)
          return(
          <>
          {showModal==1&&<ChannelModal channel={choosedChannel} setShow={setShowModal}/>}
          {showModal==2&&<DeleteChannelModal channel={choosedChannel} setShow={setShowModal} />}
          <div className="tablePage">
                    <div className="contentAlignment">
                              {(roleOfUser==teamRoles.LEADER)&&
                                <button type="button" className="btn btn-sm btn-secondary" onClick={(e)=>handleAddButton(e)}>Add new channel</button>}
                                <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                    <span className="input-group-text"><i className="fa fa-search"></i></span>
                                    <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                              </form>
                    </div>
                    <div className="tableWapper border-bottom border-dark">
                        <table className="table table-hover">
                            <TableHeader data={["Name","Description","Type","Action"]} />
                            <tbody>
                        {filterChannels?.map((channel, index)=> {
                                return (
                                    <tr key={index}>
                                        <td>{channel.channelName}</td>
                                        <td>{channel.description}</td>
                                        <td>{channel.type}</td>
                                        <td>
                                            {(roleOfUser==teamRoles.LEADER)&&
                                            <>
                                                <button type="button" className="btn mx-1 btn-sm btn-primary" onClick={()=>handleUpdateButton(channel)}>Update</button>
                                                <button type="button" className="btn mx-1 btn-sm btn-danger" onClick={(e)=>handleDeleteButton(channel)}>Delete</button>
                                            </>}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
          </div>
          </>
          )
}
export default Channels;