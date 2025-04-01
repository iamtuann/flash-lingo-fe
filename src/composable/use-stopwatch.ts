import { computed, onUnmounted, ref } from "vue"

export function useStopwatch(step: number, formatTime?: (v: number) => string) {
  let timer: ReturnType<typeof setInterval> | null = null
  const elapsedTime = ref(0)
  const timeFormatted = computed<string>(() => {
    if (formatTime) {
      return formatTime(elapsedTime.value)
    } else {
      return elapsedTime.value.toString()
    }
  })

  function start() {
    if (timer) clearInterval(timer)
    elapsedTime.value = 0;
    timer = setInterval(() => {
      elapsedTime.value += step
    }, step)
  }

  function plusTime(value: number) {
    elapsedTime.value += value
  }

  function minusTime(value: number) {
    elapsedTime.value -= value
  }

  function stop() {
    if (timer) clearInterval(timer)
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return {
    elapsedTime,
    timeFormatted,
    start,
    plusTime,
    minusTime,
    stop
  }
}