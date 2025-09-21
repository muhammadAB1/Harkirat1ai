import { api } from "@/api"

export const signIn = async ({ email, otp }: { email: string, otp: string }) => {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
    const response = await api.post('/auth/signin', {
        email: email,
        otp: otp
    })
    if (!response.data.success) {
        console.error("Signin failed")
        return false
    }
    localStorage.setItem('token', response.data.token)
    return response.data
}