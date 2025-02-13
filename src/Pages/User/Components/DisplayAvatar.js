const DisplayAvatar=({file, user})=>{
          if(file) return <img src={URL.createObjectURL(file)} width="250px" height="250px"/>
          else if(user.urlIcon) return <img src={user.urlIcon} width="250px" height="250px"/>
          else return <i className="fas fa-fw fa-user position-absolute top-50 start-50 translate-middle text-secondary"></i>
}

export default DisplayAvatar;