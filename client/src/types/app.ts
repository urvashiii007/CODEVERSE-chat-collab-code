import { RemoteUser, User, USER_STATUS } from "./user"

// ❌ tldraw types hata diye (problematic)
// type DrawingData = StoreSnapshot<TLRecord> | null

// ✅ SAFE fallback type
export type DrawingData = any

export enum ACTIVITY_STATE {
    CODING = "coding",
    DRAWING = "drawing",
}

export interface AppContext {
    users: RemoteUser[]
    setUsers: (
        users: RemoteUser[] | ((users: RemoteUser[]) => RemoteUser[]),
    ) => void
    currentUser: User
    setCurrentUser: (user: User) => void
    status: USER_STATUS
    setStatus: (status: USER_STATUS) => void
    activityState: ACTIVITY_STATE
    setActivityState: (state: ACTIVITY_STATE) => void
    drawingData: DrawingData
    setDrawingData: (data: DrawingData) => void
}
