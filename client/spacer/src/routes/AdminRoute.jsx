//  BLOCKS ANYONE WHO ISN'T AN ADMIN
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const { isAuthenticated, authChecked, currentUser } = useSelector((state) => state.auth);

    if (!authChecked) {
        return <p>Loading...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }

    if(currentUser?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children;
}

export default AdminRoute;