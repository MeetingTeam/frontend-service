import { Link } from "react-router-dom";

const NotFoundPage = () =>(
            <div className="contentCenter">
                <h2 style={{ marginBottom: "20px" }}>Page not found!!</h2>
                <Link to="/login">Go to Login Page</Link>
            </div>
    )

export default NotFoundPage;