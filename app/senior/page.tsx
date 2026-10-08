'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Clock3,
  Languages,
  Mic,
  Pill,
  ShieldCheck,
  Volume2,
  X
} from 'lucide-react'
import { seedSeniors } from '@/lib/data'

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#103f4a] text-white shadow-sm">
        <ShieldCheck />
      </div>
      <div>
        <p className="text-[15px] font-bold leading-none tracking-tight text-[#12333c]">
          CareGuard <span className="text-[#2d9c8c]">AI</span>
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#78939a]">
          Care with confidence
        </p>
      </div>
    </div>
  )
}

export default function SeniorPage() {
  const [seniors, setSeniors] = useState(seedSeniors)
  const [language, setLanguage] = useState('EN')
  const [voiceActive, setVoiceActive] = useState(false)
  const [successMsg, setSuccessMsg] = useState<{name: string, time: string} | null>(null);
  
  // Default to Lakshmi for the demo on this page
  const selectedId = 4
  const senior = seniors.find((s) => s.id === selectedId) ?? seniors[0]

  async function onConfirm(status: 'TAKEN' | 'MISSED', medId?: number) {
    const medication = medId 
       ? senior.medications.find((item) => item.id === medId) 
       : (senior.medications.find((item) => item.status === 'PENDING') ?? senior.medications[0])
    
    if (!medication) return

    setSeniors((current) => current.map((s) => s.id === senior.id ? { 
        ...s, 
        medications: s.medications.map((item) => item.id === medication.id ? { ...item, status } : item), 
        history: [{ date: 'Today', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), medicine: medication.name, status, note: status === 'TAKEN' ? 'Confirmed by senior' : 'Senior selected not yet' }, ...s.history] 
    } : s))

    if (status === 'TAKEN') {
       const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
       setSuccessMsg({ name: medication.name, time: now });
    }

    try { 
      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/medication-events`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ senior_id: senior.id, medication_id: medication.id, status, scheduled_time: medication.time }) 
      }) 
    } catch { /* local demo remains usable when API is offline */ }
  }

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

  return (
    <main className="min-h-screen bg-[#f4faf8] text-[#153c45] pb-24">
      <div className="bg-white px-5 py-4 shadow-sm md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <button onClick={() => setLanguage(language === 'EN' ? 'தமிழ்' : 'EN')} className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#65878a] shadow-sm"><Languages className="size-5" /> {language}</button>
            <Link href="/" className="rounded-2xl border-2 border-[#e7f0ee] bg-white px-6 py-3 text-lg font-bold text-[#65878a] hover:bg-[#f8fbfb]">Log out</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-3xl px-5">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-[#2a8b7d] md:text-5xl">{language === 'EN' ? 'GOOD MORNING 👋' : 'காலை வணக்கம் 👋'}</h1>
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
                    <button onClick={() => onConfirm('TAKEN', med.id)} className="flex min-h-[80px] w-full items-center justify-center gap-3 rounded-2xl bg-[#2e9b87] px-8 text-2xl font-bold text-white shadow-md hover:bg-[#26806f] md:w-auto"><Check className="size-8" /> YES, I TOOK IT</button>
                    <button onClick={() => onConfirm('MISSED', med.id)} className="flex min-h-[64px] w-full items-center justify-center gap-3 rounded-2xl border-4 border-[#e0b164] bg-[#fffaf0] px-8 text-xl font-bold text-[#a9762a] md:w-auto">NOT YET</button>
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
