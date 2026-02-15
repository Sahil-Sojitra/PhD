import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { exportParticipantCsv, fetchParticipantSummaries } from '../services/adminService'
import { clearToken } from '../utils/auth'

const formatReactionTime = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '—'
    return `${value.toFixed(2)} ms`
}

function DashboardPage() {
    const navigate = useNavigate()
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [downloading, setDownloading] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError('')
                const data = await fetchParticipantSummaries()
                setRows(Array.isArray(data) ? data : [])
            } catch (requestError) {
                setError(requestError?.response?.data?.message || 'Failed to load records.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    const totalParticipants = useMemo(() => rows.length, [rows])

    const handleLogout = () => {
        clearToken()
        navigate('/login', { replace: true })
    }

    const handleDownload = async () => {
        try {
            setDownloading(true)
            const blob = await exportParticipantCsv()
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'reaction_time_responses.csv'
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
            window.URL.revokeObjectURL(url)
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Failed to download CSV.')
        } finally {
            setDownloading(false)
        }
    }

    return (
        <main className="dashboard-wrap">
            <section className="panel">
                <header className="panel-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Total participants: {totalParticipants}</p>
                    </div>

                    <div className="header-actions">
                        <button type="button" className="secondary-btn" onClick={handleDownload} disabled={downloading}>
                            {downloading ? 'Downloading...' : 'Download CSV'}
                        </button>
                        <button type="button" className="danger-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                {error ? <p className="error-text">{error}</p> : null}

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Correct</th>
                                <th>Wrong</th>
                                <th>Missed</th>
                                <th>Average Reaction Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7">Loading...</td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No records found.</td>
                                </tr>
                            ) : (
                                rows.map((item) => (
                                    <tr key={item.participantId}>
                                        <td>{item.participantName || '—'}</td>
                                        <td>{item.age ?? '—'}</td>
                                        <td>{item.correct ?? 0}</td>
                                        <td>{item.wrong ?? 0}</td>
                                        <td>{item.missed ?? 0}</td>
                                        <td>{formatReactionTime(item.averageReactionTime)}</td>
                                        <td>
                                            <Link className="table-link" to={`/participant/${item.participantId}`}>
                                                View details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}

export default DashboardPage