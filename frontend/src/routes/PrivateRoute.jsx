import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import { getDashboardPath } from '../utils/roleNavigation';

function PrivateRoute({ children }) {
    const { isAuthenticated, authChecked, currentUser } = useSelector((state) => state.auth);

    if (!authChecked) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser?.role?.trim().toLowerCase() === 'admin') {
        return <Navigate to={getDashboardPath(currentUser)} replace />;
    }

    return children;
}

export default PrivateRoute;
