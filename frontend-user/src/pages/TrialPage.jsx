import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import TestControlPad from '../components/TestControlPad'
import useTrialTestEngine from '../hooks/useTrialTestEngine'

function TrialPage() {
    const navigate = useNavigate()
    const sequence = useMemo(() => ['left', 'right', 'left', 'right', 'left', 'right', 'left', 'right'], [])
    const handleComplete = useCallback(() => {
        navigate('/final', { replace: true })
    }, [navigate])

    const { isRunning, currentDirection, timeLeftMs, score, respond } = useTrialTestEngine({
        durationMs: 30000,
        sequence,
        onComplete: handleComplete,
    })

    return (
        <PageShell title="Trial Test">
            <div className="status-row">
                <div className="status-pill">Time: {Math.ceil(timeLeftMs / 1000)}s</div>
                <div className="status-pill">Correct: {score.correct}</div>
                <div className="status-pill">Total: {score.total}</div>
            </div>

            <div className="prompt-area" aria-live="polite">
                {isRunning && currentDirection ? (
                    <span className="prompt-text">{currentDirection.toUpperCase()}</span>
                ) : (
                    <span className="prompt-text muted">Get Ready</span>
                )}
            </div>

            <TestControlPad disabled={!isRunning} onRespond={respond} />
        </PageShell>
    )
}

export default TrialPage