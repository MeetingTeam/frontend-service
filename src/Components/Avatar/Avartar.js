import Person from "../../Resources/Person.png";

const Avatar=({src})=>{
          return <img src={src?src:Person}  alt="avatar" className="rounded-pill" width="40px" height="40px" />
}
export default Avatar;