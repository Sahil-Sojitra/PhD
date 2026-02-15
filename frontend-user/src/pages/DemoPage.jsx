import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'

function DemoPage() {
    const navigate = useNavigate()

    return (
        <PageShell
            title="Demo"
            footer={
                <button type="button" className="primary-btn" onClick={() => navigate('/trial')}>
                    Start Trial
                </button>
            }
        >
            <div className="video-wrap">
                <video className="demo-video" controls preload="metadata" playsInline>
                    <source src="/demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </PageShell>
    )
}

export default DemoPage