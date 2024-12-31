import { meApi } from "./api/me"

export const fetchCurrentUser = async () => {
    try {
        const response =  await meApi.getMe()
        return response
    } catch (error) {
        console.error('Failed to fetch current user:', error)
    }
}