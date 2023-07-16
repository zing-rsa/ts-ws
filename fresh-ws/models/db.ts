import { ObjectId} from "$mongo"

export interface Session {
    _id?: ObjectId,
    username: string,
    sessionId: string,
    accent: string,
    createdAt: Date
}