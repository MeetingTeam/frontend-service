import Person from "../../Resources/Person.png"
const Avatar=({src})=>{
          return <img src={src?src:Person} alt="avatar" className="avatar" width="30px" height="30px"/>
}
export default Avatar;