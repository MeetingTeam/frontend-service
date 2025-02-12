import Person from "../../Resources/Person.png";

const BigAvatar=({src})=>{
          return <img src={src?src:Person}  alt="avatar" className="rounded-pill" width="100px" height="100px"/>
}
export default BigAvatar;