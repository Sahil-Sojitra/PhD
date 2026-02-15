import { useCallback, useEffect, useRef, useState } from 'react'

const randomDirection = () => (Math.random() < 0.5 ? 'left' : 'right')
const randomDelay = () => 2000 + Math.floor(Math.random() * 2001)

function useFinalTestEngine({ durationMs = 60000, onComplete }) {
    const [isRunning, setIsRunning] = useState(false)
    const [activeDirection, setActiveDirection] = useState(null)
    const [timeLeftMs, setTimeLeftMs] = useState(durationMs)

    const onCompleteRef = useRef(onComplete)
    const runningRef = useRef(false)
    const endedRef = useRef(false)
    const endTimeRef = useRef(0)
    const activePromptRef = useRef(null)
    const recordsRef = useRef([])
    const promptCounterRef = useRef(0)
    const promptTimeoutRef = useRef(null)
    const endTimeoutRef = useRef(null)
    const animationFrameRef = useRef(null)

    onCompleteRef.current = onComplete

    const clearTimers = useCallback(() => {
        if (promptTimeoutRef.current) {
            clearTimeout(promptTimeoutRef.current)
            promptTimeoutRef.current = null
        }

        if (endTimeoutRef.current) {
            clearTimeout(endTimeoutRef.current)
            endTimeoutRef.current = null
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
    }, [])

    const markMissedIfPending = useCallback(() => {
        const pending = activePromptRef.current

        if (!pending || pending.responded) return

        recordsRef.current.push({
            directionShown: pending.direction,
            userResponse: null,
            reactionTime: 0,
            result: 'missed',
        })

        activePromptRef.current = null
        setActiveDirection(null)
    }, [])

    const finish = useCallback(() => {
        if (!runningRef.current || endedRef.current) return

        endedRef.current = true
        runningRef.current = false

        clearTimers()
        markMissedIfPending()

        setIsRunning(false)
        setActiveDirection(null)
        setTimeLeftMs(0)

        onCompleteRef.current?.([...recordsRef.current])
    }, [clearTimers, markMissedIfPending])

    const scheduleNextPrompt = useCallback(() => {
        if (!runningRef.current || endedRef.current) return

        const delay = randomDelay()

        promptTimeoutRef.current = setTimeout(() => {
            if (!runningRef.current || endedRef.current) return

            const now = performance.now()
            if (now >= endTimeRef.current) {
                finish()
                return
            }

            markMissedIfPending()

            const direction = randomDirection()
            const prompt = {
                id: ++promptCounterRef.current,
                direction,
                shownAt: now,
                responded: false,
            }

            activePromptRef.current = prompt
            setActiveDirection(direction)

            scheduleNextPrompt()
        }, delay)
    }, [finish, markMissedIfPending])

    const respond = useCallback((userDirection) => {
        if (!runningRef.current || endedRef.current) return

        const now = performance.now()
        if (now >= endTimeRef.current) return

        const prompt = activePromptRef.current
        if (!prompt || prompt.responded) return

        prompt.responded = true

        const reactionTime = Math.round(now - prompt.shownAt)
        const result = userDirection === prompt.direction ? 'correct' : 'wrong'

        recordsRef.current.push({
            directionShown: prompt.direction,
            userResponse: userDirection,
            reactionTime,
            result,
        })

        activePromptRef.current = null
        setActiveDirection(null)
    }, [])

    useEffect(() => {
        runningRef.current = true
        endedRef.current = false
        recordsRef.current = []
        promptCounterRef.current = 0
        activePromptRef.current = null

        const startTime = performance.now()
        endTimeRef.current = startTime + durationMs

        setIsRunning(true)
        setActiveDirection(null)
        setTimeLeftMs(durationMs)

        const updateClock = () => {
            if (!runningRef.current || endedRef.current) return

            const remaining = Math.max(0, endTimeRef.current - performance.now())
            setTimeLeftMs(remaining)

            if (remaining <= 0) {
                finish()
                return
            }

            animationFrameRef.current = requestAnimationFrame(updateClock)
        }

        animationFrameRef.current = requestAnimationFrame(updateClock)

        endTimeoutRef.current = setTimeout(() => {
            finish()
        }, durationMs)

        scheduleNextPrompt()

        return () => {
            runningRef.current = false
            clearTimers()
        }
    }, [clearTimers, durationMs, finish, scheduleNextPrompt])

    return {
        isRunning,
        activeDirection,
        timeLeftMs,
        respond,
    }
}

export default useFinalTestEngine