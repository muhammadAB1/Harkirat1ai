import { api } from "@/api";

export const allMessages = async (conversationId: string) => {
    const response = await api.get(`/ai/conversations/${conversationId}`, {

        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    return response
}