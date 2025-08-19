import { auth } from "@/auth";
import LoginForm from "@/components/auth/login-form"
import { redirect } from "next/navigation";
import { Suspense } from "react"

const LoginPage = async () => {
    const session = await auth();
  
    if (session) {
      redirect('/dashboard');
    }
    return (
        <div className="flex justify-center items-center h-full">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}

export default LoginPage