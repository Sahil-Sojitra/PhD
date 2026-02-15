import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'

function InstructionsPage() {
    const navigate = useNavigate()

    return (
        <PageShell
            title="Instructions"
            footer={
                <button type="button" className="primary-btn" onClick={() => navigate('/demo')}>
                    Go to Demo
                </button>
            }
        >
            <ul className="instruction-list">
                <li>Keep both hands ready near the response buttons.</li>
                <li>Tap the matching direction as quickly and accurately as possible.</li>
                <li>Wait for each prompt and avoid random taps.</li>
                <li>Stay focused until the test ends automatically.</li>
            </ul>
        </PageShell>
    )
}

export default InstructionsPage