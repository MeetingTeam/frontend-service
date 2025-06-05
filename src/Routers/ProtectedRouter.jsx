import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import CognitoService from "../Services/CognitoService.js";

const ProtectedRouter=({children})=>{
          const [isLoading, setIsLoading] = useState(true);
          const [isAuthenticated, setIsAuthenticated] = useState(false);

          useEffect(()=>{
                    CognitoService.isTokenValid().then(isValid=>{
                      console.log("isValid", isValid)
                      setIsAuthenticated(isValid);
                    })
                    .catch(err=>console.log(err))
                    .finally(()=>setIsLoading(false))
          }, []);

          if(isLoading){
                    return (<Spinner animation="border" variant="primary" />)
          }
          else{
                    if(isAuthenticated) {
                      console.log("Protected Router ok")
                      return children;
                    }
                    else{
                        console.log("Protected Router fails")
                        return  (<Navigate replace to="/login" />);
                    }
          }
}
export default ProtectedRouter;