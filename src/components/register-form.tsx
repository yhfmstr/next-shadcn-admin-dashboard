import Link from "next/link"

import { PhoneOtpForm } from "@/app/(main)/auth/_components/phone-otp-form"

export function RegisterForm() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">Enter your phone number to continue</p>
      </div>
      <PhoneOtpForm />
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  )
}


