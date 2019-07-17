const bs58 = require('bs58')

export function getDefaultAvatar (address: string) {
  const buffer: Buffer = bs58.decode(address)
  const hex = buffer.toString('hex')
  const char = hex.charAt(4)
  return require(`../assets/avatar-${char}.png`)
}