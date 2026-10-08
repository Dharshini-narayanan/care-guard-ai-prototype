import Link from 'next/link'
import { ShieldCheck, UserCircle, Users } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4faf8] p-6 text-[#153c45]">
      
      {/* Logo */}
      <div className="mb-16 flex flex-col items-center gap-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-[#103f4a] text-white shadow-lg">
          <ShieldCheck className="size-10" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#12333c]">
            CareGuard <span className="text-[#2d9c8c]">AI</span>
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-[#78939a]">
            Care with confidence
          </p>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">Welcome to CareGuard</h2>
        <p className="mt-2 text-lg text-[#6a898e]">Please select how you would like to log in:</p>
      </div>

      {/* Login Options */}
      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
        {/* Caregiver Login */}
        <Link 
          href="/caregiver" 
          className="group flex flex-col items-center justify-center gap-6 rounded-[32px] border-4 border-[#e7f0ee] bg-white p-10 text-center shadow-sm transition-all hover:border-[#2d9c8c] hover:shadow-lg"
        >
          <div className="flex size-24 items-center justify-center rounded-full bg-[#f0f6f4] text-[#2d9c8c] transition-colors group-hover:bg-[#e6f3f0]">
            <Users className="size-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Caregiver</h3>
            <p className="mt-2 text-base font-medium text-[#78939a]">Manage care plans, check statuses, and configure alerts.</p>
          </div>
          <div className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#103f4a] py-4 text-lg font-bold text-white transition-colors group-hover:bg-[#185866]">
            Log in as Caregiver
          </div>
        </Link>

        {/* Senior Login */}
        <Link 
          href="/senior" 
          className="group flex flex-col items-center justify-center gap-6 rounded-[32px] border-4 border-[#e7f0ee] bg-white p-10 text-center shadow-sm transition-all hover:border-[#2d9c8c] hover:shadow-lg"
        >
          <div className="flex size-24 items-center justify-center rounded-full bg-[#f0f6f4] text-[#2d9c8c] transition-colors group-hover:bg-[#e6f3f0]">
            <UserCircle className="size-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Senior User</h3>
            <p className="mt-2 text-base font-medium text-[#78939a]">View your daily medication tray and confirm doses.</p>
          </div>
          <div className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#2e9b87] py-4 text-lg font-bold text-white transition-colors group-hover:bg-[#26806f]">
            Log in as Senior
          </div>
        </Link>
      </div>
      
    </div>
  )
}
