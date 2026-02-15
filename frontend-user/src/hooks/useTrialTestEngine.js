import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_SEQUENCE = ['left', 'right', 'left', 'right', 'left', 'right', 'left', 'right']

const randomDelay = () => 2000 + Math.floor(Math.random() * 2001)

function useTrialTestEngine({ durationMs = 30000, sequence = DEFAULT_SEQUENCE, onComplete }) {
    const [isRunning, setIsRunning] = useState(false)
    const [currentDirection, setCurrentDirection] = useState(null)
    const [timeLeftMs, setTimeLeftMs] = useState(durationMs)
    const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 })

    const onCompleteRef = useRef(onComplete)
    const runningRef = useRef(false)
    const endTimeRef = useRef(0)
    const timeoutIdsRef = useRef([])
    const animationFrameRef = useRef(null)
    const sequenceIndexRef = useRef(0)
    const currentDirectionRef = useRef(null)
    const sequenceRef = useRef(sequence)

    onCompleteRef.current = onComplete

    useEffect(() => {
        sequenceRef.current = Array.isArray(sequence) && sequence.length > 0 ? sequence : DEFAULT_SEQUENCE
    }, [sequence])

    const clearTimers = useCallback(() => {
        timeoutIdsRef.current.forEach((id) => clearTimeout(id))
        timeoutIdsRef.current = []

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
    }, [])

    const finish = useCallback(() => {
        if (!runningRef.current) return

        runningRef.current = false
        setIsRunning(false)
        setCurrentDirection(null)
        setTimeLeftMs(0)
        currentDirectionRef.current = null
        clearTimers()
        onCompleteRef.current?.()
    }, [clearTimers])

    const scheduleNextPrompt = useCallback(() => {
        if (!runningRef.current) return

        const now = performance.now()
        if (now >= endTimeRef.current) {
            finish()
            return
        }

        const timeoutId = setTimeout(() => {
            if (!runningRef.current) return

            const currentNow = performance.now()
            if (currentNow >= endTimeRef.current) {
                finish()
                return
            }

            const activeSequence = sequenceRef.current
            const nextDirection = activeSequence[sequenceIndexRef.current % activeSequence.length]
            sequenceIndexRef.current += 1

            currentDirectionRef.current = nextDirection
            setCurrentDirection(nextDirection)
            scheduleNextPrompt()
        }, randomDelay())

        timeoutIdsRef.current.push(timeoutId)
    }, [finish])

    const respond = useCallback((direction) => {
        if (!runningRef.current) return

        const shownDirection = currentDirectionRef.current
        if (!shownDirection) return

        const isCorrect = direction === shownDirection
        setScore((prev) => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            wrong: prev.wrong + (isCorrect ? 0 : 1),
            total: prev.total + 1,
        }))

        currentDirectionRef.current = null
        setCurrentDirection(null)
    }, [])

    useEffect(() => {
        runningRef.current = true
        setIsRunning(true)
        sequenceIndexRef.current = 0
        setScore({ correct: 0, wrong: 0, total: 0 })

        const startTime = performance.now()
        endTimeRef.current = startTime + durationMs

        const updateClock = () => {
            if (!runningRef.current) return

            const remaining = Math.max(0, endTimeRef.current - performance.now())
            setTimeLeftMs(remaining)

            if (remaining <= 0) {
                finish()
                return
            }

            animationFrameRef.current = requestAnimationFrame(updateClock)
        }

        animationFrameRef.current = requestAnimationFrame(updateClock)
        scheduleNextPrompt()

        return () => {
            runningRef.current = false
            clearTimers()
        }
    }, [clearTimers, durationMs, finish, scheduleNextPrompt])

    return {
        isRunning,
        currentDirection,
        timeLeftMs,
        score,
        respond,
    }
}

export default useTrialTestEngine