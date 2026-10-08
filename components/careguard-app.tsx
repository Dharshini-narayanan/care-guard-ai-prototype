'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  HeartPulse,
  Home,
  Languages,
  LayoutDashboard,
  Menu,
  Mic,
  MoreHorizontal,
  Pill,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Upload,
  Users,
  Volume2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Role = 'caregiver' | 'senior'
type View = 'dashboard' | 'seniors' | 'medications' | 'prescription' | 'notifications' | 'voice' | 'home'
type Status = 'TAKEN' | 'DELAYED' | 'MISSED' | 'PENDING'

type Senior = {
  id: number
  name: string
  initials: string
  age: number
  priority: number
  reason: string
  status: 'Normal' | 'Watch' | 'Support required'
  medications: { id: number; name: string; dosage: string; time: string; instruction: string; status: Status }[]
  history: { date: string; time: string; medicine: string; status: Status; note: string }[]
}

const seedSeniors: Senior[] = [
  { id: 1, name: 'Eleanor Martin', initials: 'EM', age: 74, priority: 18, reason: 'Routine is consistent', status: 'Normal', medications: [{ id: 11, name: 'Metformin', dosage: '500 mg', time: '08:00', instruction: 'After breakfast', status: 'TAKEN' }, { id: 12, name: 'Vitamin D3', dosage: '1000 IU', time: '13:00', instruction: 'With lunch', status: 'PENDING' }, { id: 13, name: 'Amlodipine', dosage: '5 mg', time: '20:00', instruction: 'With water', status: 'PENDING' }], history: [{ date: 'Today', time: '08:12', medicine: 'Metformin', status: 'TAKEN', note: 'Confirmed by senior' }, { date: 'Yesterday', time: '08:05', medicine: 'Metformin', status: 'TAKEN', note: 'Confirmed by senior' }, { date: 'Yesterday', time: '13:20', medicine: 'Vitamin D3', status: 'DELAYED', note: '20 minute delay' }] },
  { id: 2, name: 'Robert Williams', initials: 'RW', age: 81, priority: 63, reason: 'Repeated delays', status: 'Watch', medications: [{ id: 21, name: 'Lisinopril', dosage: '10 mg', time: '08:00', instruction: 'Before breakfast', status: 'DELAYED' }, { id: 22, name: 'Warfarin', dosage: '2.5 mg', time: '18:00', instruction: 'With dinner', status: 'PENDING' }], history: [{ date: 'Today', time: '08:31', medicine: 'Lisinopril', status: 'DELAYED', note: '31 minute delay' }, { date: 'Yesterday', time: '08:27', medicine: 'Lisinopril', status: 'DELAYED', note: '27 minute delay' }] },
  { id: 3, name: 'Margaret Chen', initials: 'MC', age: 78, priority: 42, reason: 'One missed confirmation', status: 'Watch', medications: [{ id: 31, name: 'Levothyroxine', dosage: '50 mcg', time: '07:30', instruction: 'On an empty stomach', status: 'MISSED' }, { id: 32, name: 'Calcium', dosage: '600 mg', time: '12:30', instruction: 'With lunch', status: 'PENDING' }], history: [{ date: 'Today', time: '07:30', medicine: 'Levothyroxine', status: 'MISSED', note: 'No confirmation received' }] },
  { id: 4, name: 'Lakshmi', initials: 'L', age: 72, priority: 88, reason: 'Missed confirmations', status: 'Support required', medications: [{ id: 41, name: 'Metformin', dosage: '500 mg', time: '08:00 AM', instruction: 'Take 1 tablet after breakfast', status: 'PENDING' }, { id: 42, name: 'Vitamin D', dosage: '1000 IU', time: '01:00 PM', instruction: 'Take 1 tablet after lunch', status: 'PENDING' }, { id: 43, name: 'Amlodipine', dosage: '5 mg', time: '08:00 PM', instruction: 'Take 1 tablet', status: 'PENDING' }], history: [] },
  { id: 5, name: 'Patricia Davis', initials: 'PD', age: 76, priority: 12, reason: 'Normal routine', status: 'Normal', medications: [{ id: 51, name: 'Aspirin', dosage: '81 mg', time: '09:00', instruction: 'With breakfast', status: 'TAKEN' }, { id: 52, name: 'Pravastatin', dosage: '40 mg', time: '21:00', instruction: 'At bedtime', status: 'PENDING' }], history: [{ date: 'Today', time: '09:03', medicine: 'Aspirin', status: 'TAKEN', note: 'Confirmed by senior' }] },
]

const statusStyles: Record<Status, string> = { TAKEN: 'bg-emerald-50 text-emerald-700', DELAYED: 'bg-amber-50 text-amber-700', MISSED: 'bg-rose-50 text-rose-700', PENDING: 'bg-sky-50 text-sky-700' }

function StatusBadge({ status }: { status: Status }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${statusStyles[status]}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>
}

function Logo() {
  return <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#103f4a] text-white shadow-sm"><ShieldCheck /></div><div><p className="text-[15px] font-bold leading-none tracking-tight text-[#12333c]">CareGuard <span className="text-[#2d9c8c]">AI</span></p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78939a]">Care with confidence</p></div></div>
}

export default function CareguardApp() {
  const [role, setRole] = useState<Role>('caregiver')
  const [view, setView] = useState<View>('dashboard')
  const [selectedId, setSelectedId] = useState(4)
  const [seniors, setSeniors] = useState(seedSeniors)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)
  const [language, setLanguage] = useState('EN')
  const selected = seniors.find((senior) => senior.id === selectedId) ?? seniors[0]

  const stats = useMemo(() => ({ seniors: seniors.length, medications: seniors.flatMap((s) => s.medications).filter((m) => m.status !== 'MISSED').length, pending: seniors.flatMap((s) => s.medications).filter((m) => m.status === 'PENDING').length, support: seniors.filter((s) => s.priority >= 70).length }), [seniors])

  function navigate(nextView: View) { setView(nextView); setSidebarOpen(false) }
  function chooseSenior(id: number) { setSelectedId(id); navigate('seniors') }
  async function confirmMedication(status: 'TAKEN' | 'MISSED', medId?: number) {
    const medication = medId ? selected.medications.find((item) => item.id === medId) : (selected.medications.find((item) => item.status === 'PENDING') ?? selected.medications[0])
    if (!medication) return
    setSeniors((current) => current.map((senior) => senior.id === selected.id ? { ...senior, medications: senior.medications.map((item) => item.id === medication.id ? { ...item, status } : item), history: [{ date: 'Today', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), medicine: medication.name, status, note: status === 'TAKEN' ? 'Confirmed by senior' : 'Senior selected not yet' }, ...senior.history] } : senior))
    try { await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/medication-events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senior_id: selected.id, medication_id: medication.id, status, scheduled_time: medication.time }) }) } catch { /* local demo remains usable when API is offline */ }
  }

  if (role === 'senior') return <SeniorExperience senior={selected} language={language} setLanguage={setLanguage} onBack={() => setRole('caregiver')} onConfirm={confirmMedication} voiceActive={voiceActive} setVoiceActive={setVoiceActive} />

  return <div className="min-h-screen bg-[#f5f8f7] text-[#18363e]">
    <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-[#dfeae7] bg-white/95 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-4"><button className="rounded-lg p-2 hover:bg-[#f0f6f4] md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu /></button><Logo /></div><div className="flex items-center gap-3"><button onClick={() => setLanguage(language === 'EN' ? 'தமிழ்' : 'EN')} className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#668187] hover:bg-[#f0f6f4] sm:flex"><Languages /> {language}</button><button onClick={() => navigate('notifications')} className="relative rounded-lg p-2.5 text-[#668187] hover:bg-[#f0f6f4]" aria-label="Notifications"><Bell /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#e66c55] ring-2 ring-white" /></button><div className="hidden h-8 w-px bg-[#e1ebe8] sm:block" /><div className="flex items-center gap-2"><div className="flex size-9 items-center justify-center rounded-full bg-[#dcefeb] text-xs font-bold text-[#267b72]">SC</div><div className="hidden text-left sm:block"><p className="text-xs font-bold">Sarah Collins</p><p className="text-[11px] text-[#78939a]">Caregiver</p></div></div><Link href="/" className="ml-2 rounded-lg border border-[#dfeae7] px-3 py-1.5 text-xs font-bold text-[#668187] hover:bg-[#f0f6f4]">Log out</Link></div></header>
    <div className="flex"><aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-[74px] left-0 z-30 w-[248px] border-r border-[#dfeae7] bg-white p-4 transition-transform md:sticky md:top-[74px] md:block md:h-[calc(100vh-74px)] md:translate-x-0`}><nav className="flex h-full flex-col"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#91a7aa]">Workspace</p><NavItem icon={LayoutDashboard} label="Overview" active={view === 'dashboard'} onClick={() => navigate('dashboard')} /><NavItem icon={Users} label="My seniors" active={view === 'seniors'} onClick={() => navigate('seniors')} /><NavItem icon={Pill} label="Medications" active={view === 'medications'} onClick={() => navigate('medications')} /><NavItem icon={FileText} label="Prescriptions" active={view === 'prescription'} onClick={() => navigate('prescription')} /><NavItem icon={Bell} label="Notifications" active={view === 'notifications'} onClick={() => navigate('notifications')} /><div className="mt-auto flex flex-col gap-1 border-t border-[#edf2f0] pt-4"><NavItem icon={Settings} label="Settings" /><div className="mt-3 rounded-xl bg-[#edf8f5] p-3"><div className="mb-2 flex items-center gap-2 text-[#2a8a7c]"><CircleHelp /><span className="text-xs font-bold">Need a hand?</span></div><p className="text-[11px] leading-relaxed text-[#688d8e]">Our care team is here if you need support.</p><button className="mt-2 text-[11px] font-bold text-[#267b72]">Contact support <ChevronRight className="inline size-3" /></button></div></div></nav></aside>{sidebarOpen && <button className="fixed inset-0 z-20 bg-[#18363e]/20 md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <main className="min-w-0 flex-1 p-5 md:p-8"><div className="mx-auto max-w-[1240px]">{view === 'dashboard' && <Dashboard seniors={seniors} stats={stats} onSenior={chooseSenior} onViewAll={() => navigate('seniors')} />} {view === 'seniors' && <SeniorDetails senior={selected} onBack={() => navigate('dashboard')} onVoice={() => { setRole('senior'); setView('home') }} onConfirm={confirmMedication} />} {view === 'medications' && <MedicationPage seniors={seniors} onSenior={chooseSenior} />} {view === 'prescription' && <PrescriptionPage />} {view === 'notifications' && <Notifications seniors={seniors} />} {view === 'voice' && <VoicePage senior={selected} />} </div></main></div>
  </div>
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: typeof Home; label: string; active?: boolean; onClick?: () => void }) { return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${active ? 'bg-[#e8f4f1] text-[#237c72]' : 'text-[#71898e] hover:bg-[#f4f8f7] hover:text-[#34545b]'}`}><Icon className="size-[18px]" />{label}</button> }

function Dashboard({ seniors, stats, onSenior, onViewAll }: { seniors: Senior[]; stats: { seniors: number; medications: number; pending: number; support: number }; onSenior: (id: number) => void; onViewAll: () => void }) { return <><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#76a19d]">Wednesday, October 8, 2026</p><h1 className="text-3xl font-bold tracking-tight text-[#12333c] md:text-[34px]">Good morning, Sarah</h1><p className="mt-2 text-sm text-[#70888d]">Here&apos;s how your care circle is doing today.</p></div><Button onClick={onViewAll} className="w-fit gap-2 bg-[#103f4a] hover:bg-[#185866]"><Users /> View senior list</Button></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total seniors" value={stats.seniors} detail="Across your care circle" icon={Users} tone="teal" /><StatCard label="Today&apos;s medications" value={stats.medications} detail="On track today" icon={Pill} tone="blue" /><StatCard label="Pending confirmations" value={stats.pending} detail="Need a response" icon={Clock3} tone="amber" /><StatCard label="Support required" value={stats.support} detail="Priority is high" icon={HeartPulse} tone="rose" /></div><section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]"><div className="rounded-2xl border border-[#dfeae7] bg-white p-5 shadow-[0_2px_8px_rgba(33,76,82,0.03)] md:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold">Care priority</h2><p className="mt-1 text-xs text-[#82999c]">Support signals based on recent medication behavior</p></div><button onClick={onViewAll} className="text-xs font-bold text-[#2b887d]">View all <ChevronRight className="inline size-3" /></button></div><div className="flex flex-col gap-2">{seniors.map((senior) => <PriorityRow key={senior.id} senior={senior} onClick={() => onSenior(senior.id)} />)}</div></div><div className="rounded-2xl border border-[#dfeae7] bg-[#103f4a] p-6 text-white"><div className="flex items-center justify-between"><div className="flex size-10 items-center justify-center rounded-xl bg-white/10"><Sparkles /></div><span className="rounded-full bg-[#2d9c8c]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#87d8c4]">Demo score</span></div><p className="mt-8 text-sm text-[#a8c7c7]">Caregiver support priority</p><div className="mt-2 flex items-end gap-2"><span className="text-5xl font-bold">64</span><span className="mb-2 text-sm text-[#8eb0b1]">/ 100</span></div><div className="mt-5 h-2 rounded-full bg-white/10"><div className="h-2 w-[64%] rounded-full bg-[#63c8b2]" /></div><p className="mt-4 text-xs leading-relaxed text-[#b4cdcc]">James&apos;s missed confirmations are the main signal today. Review his timeline and check in if needed.</p><button onClick={() => onSenior(4)} className="mt-5 flex items-center gap-1 text-xs font-bold text-[#9ce5d2]">Review James&apos;s care plan <ChevronRight className="size-3" /></button></div></section><section className="mt-5 rounded-2xl border border-[#dfeae7] bg-white p-5 md:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold">Today&apos;s activity</h2><p className="mt-1 text-xs text-[#82999c]">Medication confirmations across your care circle</p></div><div className="flex items-center gap-4 text-[11px] font-semibold text-[#80979b]"><span><i className="mr-1.5 inline-block size-2 rounded-full bg-[#49ad8e]" />Taken</span><span><i className="mr-1.5 inline-block size-2 rounded-full bg-[#e8ad57]" />Delayed</span><span><i className="mr-1.5 inline-block size-2 rounded-full bg-[#e27769]" />Missed</span></div></div><div className="flex h-36 items-end gap-2 px-2">{['6 AM','8 AM','10 AM','12 PM','2 PM','4 PM','6 PM','8 PM','10 PM'].map((time, index) => <div key={time} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex w-full items-end justify-center gap-1">{[index % 3 === 0 ? 50 : 75, index % 4 === 0 ? 35 : 62, index % 5 === 0 ? 22 : 10].map((height, i) => <div key={i} className={`w-2.5 rounded-t-sm ${i === 0 ? 'bg-[#49ad8e]' : i === 1 ? 'bg-[#e8ad57]' : 'bg-[#e27769]'}`} style={{ height: `${height}%` }} />)}</div><span className="text-[10px] text-[#9aadae]">{time}</span></div>)}</div></section></> }

function StatCard({ label, value, detail, icon: Icon, tone }: { label: string; value: number; detail: string; icon: typeof Users; tone: string }) { const tones: Record<string, string> = { teal: 'bg-[#e6f5f1] text-[#2c8c7e]', blue: 'bg-[#eaf2fb] text-[#5084b5]', amber: 'bg-[#fff5e5] text-[#bd8027]', rose: 'bg-[#fff0ee] text-[#c96559]' }; return <div className="rounded-2xl border border-[#dfeae7] bg-white p-5 shadow-[0_2px_8px_rgba(33,76,82,0.03)]"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-[#81989b]">{label}</p><p className="mt-3 text-3xl font-bold text-[#183c44]">{value}</p></div><div className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon /></div></div><p className="mt-3 text-[11px] text-[#91a5a7]">{detail}</p></div> }

function PriorityRow({ senior, onClick }: { senior: Senior; onClick: () => void }) { const color = senior.priority >= 70 ? 'bg-[#e47769]' : senior.priority >= 40 ? 'bg-[#e7ad58]' : 'bg-[#4bad91]'; return <button onClick={onClick} className="group flex items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#f6faf9]"><div className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${senior.priority >= 70 ? 'bg-[#fbe8e5] text-[#c46155]' : senior.priority >= 40 ? 'bg-[#fff3df] text-[#b27b2d]' : 'bg-[#e4f5ef] text-[#358b77]'}`}>{senior.initials}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-bold">{senior.name}</p><span className={`size-2 rounded-full ${color}`} /></div><p className="mt-1 text-xs text-[#84999c]">{senior.reason}</p></div><div className="hidden text-right sm:block"><p className="text-[10px] font-bold uppercase tracking-wider text-[#a0b0b2]">Priority</p><p className="text-lg font-bold">{senior.priority}</p></div><ChevronRight className="size-4 text-[#a5b5b6] transition-transform group-hover:translate-x-1" /></button> }

function SeniorDetails({ senior, onBack, onVoice, onConfirm }: { senior: Senior; onBack: () => void; onVoice: () => void; onConfirm: (status: 'TAKEN' | 'MISSED') => void }) { return <><button onClick={onBack} className="mb-5 flex items-center gap-1 text-xs font-bold text-[#6d9291] hover:text-[#267b72]"><ChevronRight className="size-3 rotate-180" /> Back to overview</button><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div className="flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-2xl bg-[#dcefeb] text-lg font-bold text-[#287d73]">{senior.initials}</div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#76a19d]">Senior profile</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{senior.name}</h1><p className="mt-1 text-sm text-[#81979b]">Age {senior.age} · Care plan active</p></div></div><Link href="/senior" className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 bg-[#103f4a] text-white hover:bg-[#185866]"><Mic className="size-4"/> Open senior view</Link></div><div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]"><div className="rounded-2xl border border-[#dfeae7] bg-white p-5 md:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold">Today&apos;s medication</h2><p className="mt-1 text-xs text-[#82999c]">Wednesday, October 8</p></div><button className="rounded-lg p-2 text-[#8ba2a3] hover:bg-[#f1f7f5]" aria-label="More options"><MoreHorizontal /></button></div><div className="flex flex-col gap-3">{senior.medications.map((medication) => <div key={medication.id} className="flex items-center gap-4 rounded-xl border border-[#e7efed] p-4"><div className="flex size-10 items-center justify-center rounded-xl bg-[#eff7f5] text-[#3b9588]"><Pill /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{medication.time}</p><span className="text-sm text-[#83989b]">{medication.name} {medication.dosage}</span></div><p className="mt-1 text-xs text-[#9aabad]">{medication.instruction}</p></div><StatusBadge status={medication.status} /></div>)}</div></div><div className="rounded-2xl border border-[#dfeae7] bg-white p-5 md:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Support signal</h2><p className="mt-1 text-xs text-[#82999c]">Placeholder ML score</p></div><Sparkles className="text-[#e2ad59]" /></div><div className="mt-6 flex items-center gap-5"><div className="relative flex size-24 items-center justify-center rounded-full" style={{ background: `conic-gradient(${senior.priority >= 70 ? '#e47769' : '#e7ad58'} ${senior.priority}%, #edf2f0 0)` }}><div className="flex size-[76px] items-center justify-center rounded-full bg-white text-2xl font-bold">{senior.priority}</div></div><div><p className="font-bold">{senior.status}</p><p className="mt-1 text-xs leading-relaxed text-[#84999c]">{senior.reason}. This score is a demo placeholder for the future ML service.</p></div></div><div className="mt-6 rounded-xl bg-[#f7faf9] p-3 text-xs leading-relaxed text-[#789093]">The model will learn patterns from confirmations, delays, and missed doses. It never changes medication instructions.</div></div></div><div className="mt-5 rounded-2xl border border-[#dfeae7] bg-white p-5 md:p-6"><div className="mb-6"><h2 className="text-lg font-bold">Medication history</h2><p className="mt-1 text-xs text-[#82999c]">A clear timeline of recent confirmations</p></div><div className="relative flex flex-col gap-6 pl-7 before:absolute before:bottom-1 before:left-[9px] before:top-1 before:w-px before:bg-[#dceae6]">{senior.history.map((event, index) => <div key={`${event.time}-${index}`} className="relative flex items-start justify-between gap-4"><div className={`absolute -left-7 top-0.5 flex size-[19px] items-center justify-center rounded-full border-4 border-white ${event.status === 'TAKEN' ? 'bg-[#4bad91]' : event.status === 'MISSED' ? 'bg-[#e47769]' : 'bg-[#e7ad58]'}`} /> <div><p className="text-xs font-bold text-[#6a8588]">{event.date} <span className="mx-1 text-[#b6c5c5]">·</span> {event.time}</p><p className="mt-1 text-sm font-bold">{event.medicine}</p><p className="mt-1 text-xs text-[#91a3a5]">{event.note}</p></div><StatusBadge status={event.status} /></div>)}</div></div></> }

function SeniorExperience({ senior, language, setLanguage, onBack, onConfirm, voiceActive, setVoiceActive }: { senior: Senior; language: string; setLanguage: (value: string) => void; onBack: () => void; onConfirm: (status: 'TAKEN' | 'MISSED', medId?: number) => void; voiceActive: boolean; setVoiceActive: (value: boolean) => void }) {
  const [successMsg, setSuccessMsg] = useState<{name: string, time: string} | null>(null);

  if (voiceActive) {
     const next = senior.medications.find(m => m.status === 'PENDING') ?? senior.medications[0];
     return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4faf8] p-6 text-center text-[#153c45]">
         <div className="mb-10 flex size-32 items-center justify-center rounded-full bg-[#d8f1eb] text-[#2a887b]">
           <Mic className="size-16 animate-pulse" />
         </div>
         <p className="text-xl font-bold uppercase tracking-widest text-[#79a09f]">Medicine Reminder</p>
         <h2 className="mt-6 max-w-lg text-4xl font-bold leading-tight">
           &ldquo;It&apos;s time for your {next.name} {next.dosage}.&rdquo;
         </h2>
         <p className="mt-8 text-2xl font-bold text-[#2a887b]">Listening...</p>
         <p className="mt-12 text-3xl font-bold">Did you take it?</p>
         <div className="mt-8 flex w-full max-w-md flex-col gap-5">
           <button onClick={() => { onConfirm('TAKEN', next.id); setVoiceActive(false); }} className="flex min-h-[90px] w-full items-center justify-center gap-4 rounded-3xl bg-[#2e9b87] text-3xl font-bold text-white shadow-lg"><Check className="size-10" /> YES</button>
           <button onClick={() => { onConfirm('MISSED', next.id); setVoiceActive(false); }} className="flex min-h-[90px] w-full items-center justify-center gap-4 rounded-3xl border-4 border-[#e0b164] bg-[#fffaf0] text-3xl font-bold text-[#a9762a]"><X className="size-10" /> NOT YET</button>
         </div>
       </div>
     )
  }

  if (successMsg) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4faf8] p-6 text-center text-[#153c45]">
         <div className="mb-8 flex size-32 items-center justify-center rounded-full bg-[#2e9b87] text-white shadow-lg">
           <Check className="size-20" />
         </div>
         <h2 className="text-5xl font-bold">WELL DONE!</h2>
         <p className="mt-6 text-3xl text-[#6a898e]">{successMsg.name} recorded</p>
         <p className="mt-2 text-3xl text-[#6a898e]">at {successMsg.time}</p>
         <button onClick={() => setSuccessMsg(null)} className="mt-16 min-h-[80px] min-w-[240px] rounded-2xl bg-[#103f4a] px-10 text-2xl font-bold text-white shadow-lg">DONE</button>
      </div>
    )
  }

  const pendingMeds = senior.medications.filter((med) => med.status === 'PENDING');
  
  const getTimelineMeds = (period: 'Morning' | 'Afternoon' | 'Night') => {
     return senior.medications.filter(m => {
       const isAM = m.time.toLowerCase().includes('am');
       const isPM = m.time.toLowerCase().includes('pm');
       let hour = parseInt(m.time.split(':')[0]);
       
       if (isPM && hour < 12) hour += 12;
       if (isAM && hour === 12) hour = 0;
       
       if (period === 'Morning') return hour < 12;
       if (period === 'Afternoon') return hour >= 12 && hour < 17;
       return hour >= 17;
     });
  };

  const isDueNow = (med: any) => pendingMeds.some(p => p.id === med.id);

  const handleConfirm = (status: 'TAKEN' | 'MISSED', med: any) => {
    onConfirm(status, med.id);
    if (status === 'TAKEN') {
       const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
       setSuccessMsg({ name: med.name, time: now });
    }
  }

  return (
    <main className="min-h-screen bg-[#f4faf8] text-[#153c45] pb-24">
      <div className="bg-white px-5 py-4 shadow-sm md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-2xl border-2 border-[#e7f0ee] bg-white px-5 py-3 text-lg font-bold text-[#65878a]">Caregiver</button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-3xl px-5">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-[#2a8b7d] md:text-5xl">GOOD MORNING 👋</h1>
        <p className="mt-4 text-3xl font-bold text-[#153c45]">Your medicine for now</p>
        <div className="mt-8 rounded-[40px] border-4 border-[#d7ebe5] bg-white p-8 shadow-xl md:p-12">
          <div className="mb-8 flex items-center justify-center gap-4">
             <Pill className="size-12 text-[#2a8b7d]" />
             <h2 className="text-3xl font-bold tracking-widest text-[#79a09f] uppercase">YOUR MEDICINE TRAY</h2>
          </div>
          <div className="flex flex-col gap-8">
            {pendingMeds.length === 0 ? (
              <div className="py-10 text-center">
                <Check className="mx-auto mb-6 size-24 text-[#4bad91]" />
                <p className="text-4xl font-bold text-[#153c45]">All Done!</p>
                <p className="mt-4 text-2xl text-[#6a898e]">You took all your medicines for now.</p>
              </div>
            ) : (
              pendingMeds.map((med, idx) => (
                <div key={med.id} className="flex flex-col gap-6 rounded-3xl border-4 border-[#f0f6f4] bg-[#fbfdfc] p-6 shadow-md md:flex-row md:items-center">
                  <img src={idx % 2 === 0 ? "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=80" : "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=200&h=200&fit=crop&q=80"} alt={med.name} className="size-32 shrink-0 rounded-2xl object-cover shadow-sm md:size-40" />
                  <div className="flex-1 text-left">
                    <h3 className="text-4xl font-bold text-[#153c45]">{med.name}</h3>
                    <p className="mt-2 text-2xl font-bold text-[#2e9b87]">{med.dosage} • {med.instruction.includes('tablet') ? med.instruction.match(/\d+ tablets?/i)?.[0] || '1 tablet' : '1 dose'}</p>
                    <div className="mt-4 flex items-center gap-2 text-xl font-bold text-[#6a898e]">
                      <Clock3 className="size-6"/> {med.time}
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-4 md:w-auto">
                    <button onClick={() => handleConfirm('TAKEN', med)} className="flex min-h-[80px] w-full items-center justify-center gap-3 rounded-2xl bg-[#2e9b87] px-8 text-2xl font-bold text-white shadow-md hover:bg-[#26806f] md:w-auto"><Check className="size-8" /> YES, I TOOK IT</button>
                    <button onClick={() => handleConfirm('MISSED', med)} className="flex min-h-[64px] w-full items-center justify-center gap-3 rounded-2xl border-4 border-[#e0b164] bg-[#fffaf0] px-8 text-xl font-bold text-[#a9762a] md:w-auto">NOT YET</button>
                  </div>
                </div>
              ))
            )}
          </div>
          {pendingMeds.length > 0 && (
            <button onClick={() => setVoiceActive(true)} className="mx-auto mt-10 flex min-h-[80px] items-center justify-center gap-4 rounded-3xl bg-[#103f4a] px-10 text-2xl font-bold text-white shadow-md">
              <Volume2 className="size-8" /> Voice Reminder
            </button>
          )}
        </div>
        <div className="mt-16">
          <h2 className="text-3xl font-bold uppercase tracking-widest text-[#79a09f]">TODAY&apos;S MEDICINES</h2>
          <div className="mt-8 flex flex-col gap-10">
            {['Morning', 'Afternoon', 'Night'].map((period) => {
               const meds = getTimelineMeds(period as any);
               if (meds.length === 0) return null;
               return (
                 <div key={period}>
                   <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-[#153c45]">
                     {period === 'Morning' ? '🌅' : period === 'Afternoon' ? '☀️' : '🌙'} {period.toUpperCase()}
                   </h3>
                   <div className="flex flex-col gap-5">
                     {meds.map(med => (
                       <div key={med.id} className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:gap-8">
                         <div className="text-2xl font-bold text-[#6a898e] md:w-32">{med.time}</div>
                         <div className="flex-1">
                           <p className="text-3xl font-bold text-[#153c45]"><Pill className="mr-2 inline size-8 align-bottom text-[#2a8b7d]"/> {med.name}</p>
                           <p className="mt-2 text-xl font-bold text-[#6a898e]">{med.dosage}</p>
                         </div>
                         <div>
                           {med.status === 'TAKEN' && <span className="inline-flex items-center gap-2 rounded-2xl bg-[#e6f5f1] px-5 py-3 text-xl font-bold text-[#2c8c7e]"><Check className="size-6" /> TAKEN</span>}
                           {med.status === 'PENDING' && isDueNow(med) && <span className="inline-flex items-center gap-2 rounded-2xl bg-[#eaf2fb] px-5 py-3 text-xl font-bold text-[#5084b5]"><span className="size-4 rounded-full bg-[#5084b5]"></span> DUE NOW</span>}
                           {med.status === 'PENDING' && !isDueNow(med) && <span className="inline-flex items-center gap-2 rounded-2xl bg-[#f0f6f4] px-5 py-3 text-xl font-bold text-[#6a898e]"><span className="size-4 rounded-full border-4 border-[#6a898e]"></span> UPCOMING</span>}
                           {med.status === 'MISSED' && (
                             <div className="flex flex-col gap-3">
                               <span className="inline-flex w-fit items-center gap-2 rounded-2xl bg-[#fff0ee] px-5 py-3 text-xl font-bold text-[#c96559]">⚠ MISSED</span>
                               <p className="text-lg font-medium text-[#c96559]">This medicine was not confirmed. Please follow your prescribed instructions or contact your caregiver.</p>
                             </div>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )
            })}
          </div>
        </div>
        <div className="mt-16 rounded-[40px] border-4 border-[#e7f0ee] bg-white p-10 text-center shadow-sm">
          <p className="text-xl font-bold uppercase tracking-widest text-[#79a09f]">YOUR CAREGIVER</p>
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#dcefeb] text-3xl font-bold text-[#267b72]">S</div>
            <div className="text-left">
              <p className="text-3xl font-bold text-[#153c45]">Sarah</p>
              <p className="text-xl font-bold text-[#4bad91]">Available</p>
            </div>
          </div>
          <button className="mt-8 flex min-h-[80px] w-full items-center justify-center gap-3 rounded-2xl border-4 border-[#e7f0ee] bg-[#f4faf8] px-8 text-2xl font-bold text-[#153c45]">CONTACT CAREGIVER</button>
        </div>
      </div>
    </main>
  );
}

function MedicationPage({ seniors, onSenior }: { seniors: Senior[]; onSenior: (id: number) => void }) { return <><PageHeading eyebrow="Medication plans" title="Medication library" description="Review verified medication schedules for every senior." action={<Button className="gap-2 bg-[#103f4a]"><Plus /> Add medication</Button>} /><div className="grid gap-4 md:grid-cols-2">{seniors.flatMap((senior) => senior.medications.map((medication) => <button key={medication.id} onClick={() => onSenior(senior.id)} className="rounded-2xl border border-[#dfeae7] bg-white p-5 text-left transition-shadow hover:shadow-md"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#e9f6f2] text-[#2f8d80]"><Pill /></div><div><p className="font-bold">{medication.name} <span className="font-normal text-[#81979b]">{medication.dosage}</span></p><p className="mt-1 text-xs text-[#91a5a6]">{senior.name} · {medication.instruction}</p></div></div><StatusBadge status={medication.status} /></div><div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#41666b]"><Clock3 className="size-4 text-[#79a5a6]" /> {medication.time} <span className="ml-auto text-xs font-semibold text-[#9aacad]">Daily</span></div></button>))}</div></> }

function PrescriptionPage() { const [uploaded, setUploaded] = useState(false); return <><PageHeading eyebrow="Medication intake" title="Upload prescription" description="Add a prescription and verify extracted details before activating it." /><div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><label className="flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c9dfd9] bg-white p-8 text-center hover:bg-[#fbfefd]"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={() => setUploaded(true)} /><div className="flex size-14 items-center justify-center rounded-2xl bg-[#e8f5f1] text-[#2f8c80]"><Upload /></div><p className="mt-5 font-bold">Drop a prescription here</p><p className="mt-2 text-xs text-[#91a5a6]">PDF, JPG or PNG up to 10MB</p><Button variant="outline" className="mt-6">Choose file</Button></label><div className="rounded-2xl border border-[#dfeae7] bg-white p-6"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#f1f6f5] text-[#759295]"><FileText /></div><div><h2 className="font-bold">{uploaded ? 'Extraction ready' : 'Detected medication'}</h2><p className="mt-1 text-xs text-[#91a5a6]">{uploaded ? 'Review these details before confirming' : 'Your OCR result will appear here'}</p></div></div><div className="mt-6 rounded-xl border border-[#e4eeeb] p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#7b9b9a]">Metformin</p><p className="mt-2 text-2xl font-bold">500 mg</p><div className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><p className="text-xs text-[#91a5a6]">Schedule</p><p className="mt-1 font-bold">08:00 · Once daily</p></div><div><p className="text-xs text-[#91a5a6]">Instructions</p><p className="mt-1 font-bold">After breakfast</p></div></div></div><div className="mt-5 flex gap-3"><Button className="flex-1 gap-2 bg-[#2e9b87] hover:bg-[#267f70]"><Check /> Confirm medication</Button><Button variant="outline">Edit</Button></div><p className="mt-4 text-[11px] leading-relaxed text-[#91a5a6]">CareGuard never activates an extracted medication without your confirmation.</p></div></div></> }

function Notifications({ seniors }: { seniors: Senior[] }) { const alerts = [{ icon: Bell, title: 'Support check recommended', text: 'James Anderson has 2 missed confirmations today.', time: '12 min ago', tone: 'rose' }, { icon: Clock3, title: 'Medication delayed', text: 'Robert Williams confirmed Lisinopril 31 minutes late.', time: '34 min ago', tone: 'amber' }, { icon: Check, title: 'Medication confirmed', text: 'Eleanor Martin confirmed Metformin.', time: '1 hr ago', tone: 'teal' }]; return <><PageHeading eyebrow="Stay informed" title="Notifications" description="Important updates from your care circle." /><div className="max-w-3xl rounded-2xl border border-[#dfeae7] bg-white p-3">{alerts.map((alert) => <div key={alert.title} className="flex gap-4 rounded-xl p-4 hover:bg-[#f8fbfa]"><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${alert.tone === 'rose' ? 'bg-[#fff0ee] text-[#c96559]' : alert.tone === 'amber' ? 'bg-[#fff5e5] text-[#bd8027]' : 'bg-[#e6f5f1] text-[#2c8c7e]'}`}><alert.icon /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold">{alert.title}</p><p className="mt-1 text-xs text-[#81979b]">{alert.text}</p><p className="mt-2 text-[11px] font-semibold text-[#a0b0b2]">{alert.time}</p></div><button className="text-[#a5b5b6]" aria-label="Dismiss notification"><X /></button></div>)}</div><div className="mt-5 rounded-2xl border border-[#dfeae7] bg-white p-5"><h2 className="font-bold">Alert coverage</h2><p className="mt-2 text-xs text-[#81979b]">All {seniors.length} seniors are connected to medication reminders and caregiver alerts.</p></div></> }

function VoicePage({ senior }: { senior: Senior }) { return <><PageHeading eyebrow="Senior support" title="Voice assistant" description="A simple, safe way to confirm medications by voice." /><div className="mx-auto max-w-xl rounded-3xl border border-[#dfeae7] bg-white p-8 text-center"><div className="mx-auto flex size-28 items-center justify-center rounded-full bg-[#e5f5f1] text-[#2a8b7d] ring-8 ring-[#f2faf8]"><Mic className="size-12" /></div><p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#75a09b]">Ready for {senior.name.split(' ')[0]}</p><h2 className="mt-3 text-2xl font-bold">“Good morning. It&apos;s time for your medication.”</h2><Button className="mt-8 gap-2 rounded-xl bg-[#103f4a] px-8"><Play className="size-4" /> Start reminder</Button><p className="mt-6 text-xs leading-relaxed text-[#91a5a6]">The assistant only uses verified medication information. It cannot diagnose, prescribe, or change dosage.</p></div></> }

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#76a19d]">{eyebrow}</p><h1 className="text-3xl font-bold tracking-tight text-[#12333c]">{title}</h1><p className="mt-2 text-sm text-[#70888d]">{description}</p></div>{action}</div> }
