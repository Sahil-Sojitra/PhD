import { useLocation, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'

const readSummary = (stateSummary) => {
    if (stateSummary) return stateSummary

    try {
        const raw = localStorage.getItem('testSummary')
        if (!raw) return null
        return JSON.parse(raw)
    } catch {
        return null
    }
}

function ResultPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const summary = readSummary(location.state?.summary)

    const correct = summary?.correct ?? 0
    const total = summary?.total ?? 0
    const wrong = summary?.wrong ?? 0
    const missed = summary?.missed ?? 0

    return (
        <PageShell
            title="Result"
            footer={
                <button type="button" className="primary-btn" onClick={() => navigate('/')}>
                    Go to Home
                </button>
            }
        >
            <div className="result-box">
                <h2>
                    {correct} / {total}
                </h2>
                <p>Correct / Total</p>
            </div>

            <div className="status-row">
                <div className="status-pill">Wrong: {wrong}</div>
                <div className="status-pill">Missed: {missed}</div>
            </div>
        </PageShell>
    )
}

export default ResultPage