import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
    const participantId = localStorage.getItem('participantId')

    if (!participantId) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute