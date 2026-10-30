import crypto from "crypto"

const sessionSeed = "admin-session"

export const isAuthConfigured = () => {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET)
}

export const getSessionToken = () => {
  const secret = process.env.ADMIN_SECRET ?? ""
  return crypto.createHmac("sha256", secret).update(sessionSeed).digest("hex")
}

export const verifyPassword = (password: string) => {
  const expected = process.env.ADMIN_PASSWORD ?? ""
  if (!expected) return false
  const expectedBuffer = Buffer.from(expected)
  const passwordBuffer = Buffer.from(password)
  if (expectedBuffer.length !== passwordBuffer.length) return false
  return crypto.timingSafeEqual(expectedBuffer, passwordBuffer)
}
