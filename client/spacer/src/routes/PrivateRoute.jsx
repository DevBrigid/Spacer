import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const { isAuthenticated, authChecked } = useSelector((state) => state.auth);

    if (!authChecked) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;