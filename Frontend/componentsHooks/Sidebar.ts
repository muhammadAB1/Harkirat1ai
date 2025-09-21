import { api } from "@/api";

export const allChats = async () => {
    const response = await api.get(`/ai/conversations`,{
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    );
    return response
}