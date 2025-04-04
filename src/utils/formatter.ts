
export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${secs}s`
}

export const milisecondToSecond = (ms: number) => {
  return (ms / 1000).toFixed(1);
}