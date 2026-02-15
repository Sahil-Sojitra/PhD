import { useEffect, useState } from 'react'

function LandscapeEnforcer() {
    const [isPortrait, setIsPortrait] = useState(() => window.innerHeight > window.innerWidth)

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth)
        }

        checkOrientation()
        window.addEventListener('resize', checkOrientation)
        window.addEventListener('orientationchange', checkOrientation)

        return () => {
            window.removeEventListener('resize', checkOrientation)
            window.removeEventListener('orientationchange', checkOrientation)
        }
    }, [])

    if (!isPortrait) return null

    return (
        <div className="orientation-overlay" role="alert" aria-live="assertive">
            <p>Please rotate device to landscape mode.</p>
        </div>
    )
}

export default LandscapeEnforcer