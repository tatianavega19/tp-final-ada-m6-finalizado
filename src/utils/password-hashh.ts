import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto"

import { PEPPER } from "../constants"

const getSalt = () => randomBytes(15).toString("hex")

const hashSeasonPassword = (password: string, salt: string) =>
    scryptSync(password, salt + PEPPER, 45)

const compareHashes = (storedHash: string, incomingHash: Buffer) => {
    const storedHashedPasswordBuffer = Buffer.from(storedHash, "hex")
    const match = timingSafeEqual(incomingHash, storedHashedPasswordBuffer)
    return match
}
export { getSalt, hashSeasonPassword, compareHashes }
