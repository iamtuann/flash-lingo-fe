
export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${secs}s`
}

export const secondToHourMinute = (seconds: number | null | undefined) => {
  if (!seconds) {
    return ""
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`
}

export const milisecondToSecond = (ms: number) => {
  return (ms / 1000).toFixed(1);
}

export type DateFormat = 'dd/MM/yyyy' | 'dd/MM' | 'yyyy-MM-dd'

export function formatDate(format: DateFormat = 'dd/MM/yyyy', date: Date): string {
  if (!date) {
    return ""
  }
  const day = "2-digit";
  const month = "2-digit";
  const year = "numeric";
  switch (format) {
    case 'dd/MM/yyyy':
      return date.toLocaleDateString('vi-VI', {day, month, year});
    case 'dd/MM': 
      return date.toLocaleDateString('us-US', {day, month});
    case 'yyyy-MM-dd': 
      return date.toISOString().slice(0, 10);
    default:
      return date.toLocaleDateString('vi-VI')
  }
}