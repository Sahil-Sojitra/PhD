import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import TestControlPad from '../components/TestControlPad'
import useFinalTestEngine from '../hooks/useFinalTestEngine'
import { submitTestResult } from '../services/testService'

const summarizeRecords = (records) => {
    const correct = records.filter((item) => item.result === 'correct').length
    const wrong = records.filter((item) => item.result === 'wrong').length
    const missed = records.filter((item) => item.result === 'missed').length

    return {
        correct,
        wrong,
        missed,
        total: records.length,
    }
}

function FinalPage() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)

    const handleComplete = useCallback(
        async (records) => {
            const participantId = localStorage.getItem('participantId')
            const summary = summarizeRecords(records)
            const payload = {
                participantId,
                responses: records,
                ...summary,
            }

            setSubmitting(true)

            try {
                await submitTestResult(payload)
            } catch {
            } finally {
                setSubmitting(false)
            }

            localStorage.setItem('testSummary', JSON.stringify(summary))
            navigate('/result', { replace: true, state: { summary } })
        },
        [navigate],
    )

    const { isRunning, activeDirection, timeLeftMs, respond } = useFinalTestEngine({
        durationMs: 60000,
        onComplete: handleComplete,
    })

    return (
        <PageShell title="Final Test">
            <div className="status-row">
                <div className="status-pill">Time: {Math.ceil(timeLeftMs / 1000)}s</div>
                <div className="status-pill">Status: {isRunning ? 'Running' : 'Completed'}</div>
            </div>

            <div className="prompt-area" aria-live="polite">
                {activeDirection ? (
                    <span className="prompt-text">{activeDirection.toUpperCase()}</span>
                ) : (
                    <span className="prompt-text muted">Wait for prompt</span>
                )}
            </div>

            <TestControlPad disabled={!isRunning} onRespond={respond} />

            {submitting ? <p className="muted-note">Submitting results...</p> : null}
        </PageShell>
    )
}

export default FinalPage