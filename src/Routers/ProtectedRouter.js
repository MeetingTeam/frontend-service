import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Spinner } from "react-bootstrap";

const ProtectedRouter=({children})=>{
          const [isLoading, setIsLoading] = useState(true);
          const [isAuthenticated, setIsAuthenticated] = useState(false);

          useEffect(()=>{
                    Auth.currentSession().then(session=>{
                              setIsAuthenticated(true);
                    })
                    .catch(err=>console.log(err))
                    .finally(()=>setIsLoading(false))
          });

          if(isLoading){
                    return (<Spinner animation="border" variant="primary" />)
          }
          else{
                    if(isAuthenticated) return (<div>Hello</div>);
                    else return  (<Navigate replace to="/login" />);
          }
}
export default ProtectedRouter;