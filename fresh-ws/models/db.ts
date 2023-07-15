import { ObjectId, UUID } from "https://deno.land/x/mongo/mod.ts"

export interface Session {
    _id?: ObjectId,
    username: string,
    sessionId: string,
    accent: string
}