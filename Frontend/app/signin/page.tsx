"use client";
import { signIn } from "./SigninHook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function SignPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/chat');
        }
    }, [router]);
    const handleSignin = async () => {
        const result = await signIn({ email: "abrarjpj7@gmail.com", otp: '123' });
        if (result?.success) {
            router.push('/chat');
        }
    };

    return (
        <div>
            <button onClick={handleSignin}>
                signin
            </button>

        </div>
    );
}