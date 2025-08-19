import { auth } from "@/auth";
import SignUpForm from "@/components/auth/sign-up-form"
import { redirect } from "next/navigation";

const SignUpPage = async () => {
    const session = await auth();

    if (session) {
        redirect('/dashboard');
    }
    return (
        <div className="flex justify-center items-center h-full"><SignUpForm /></div>
    )
}

export default SignUpPage