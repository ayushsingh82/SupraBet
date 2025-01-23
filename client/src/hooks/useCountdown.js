import { useState, useEffect } from 'react'

const useCountdown = (initialTime) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const [hours, minutes, seconds] = prevTime.split(':').map(Number)
        let totalSeconds = hours * 3600 + minutes * 60 + seconds

        if (totalSeconds <= 0) {
          clearInterval(timer)
          return '00:00:00'
        }

        totalSeconds -= 1
        const newHours = Math.floor(totalSeconds / 3600)
        const newMinutes = Math.floor((totalSeconds % 3600) / 60)
        const newSeconds = totalSeconds % 60

        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return timeLeft
}

export default useCountdown 