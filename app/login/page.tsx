import LoginForm from "@/components/auth/login-form"
import { Suspense } from "react"

const LoginPage = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}

export default LoginPage