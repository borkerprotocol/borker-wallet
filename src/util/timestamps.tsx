import moment from 'moment'

export function fromNow (timestamp: string) {
  const now = moment(timestamp)
  const diff = moment().diff(now, 'minute')
  if (diff < 1) {
    return 'now'
  } else if (diff < 60) {
    return `${diff}m`
  } else if (diff < 1440) {
    return `${Math.floor(diff/60)}h`
  } else {
    return `${Math.floor(diff/1440)}d`
  }
}

export function calendar (timestamp: string) {
  return moment(timestamp).calendar()
}

export function formatShort (timestamp: string) {
  return moment().format("MMM D YYYY, h:mm a")
}
