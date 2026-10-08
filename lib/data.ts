export type Role = 'caregiver' | 'senior'
export type View = 'dashboard' | 'seniors' | 'medications' | 'prescription' | 'notifications' | 'voice' | 'home'
export type Status = 'TAKEN' | 'DELAYED' | 'MISSED' | 'PENDING'

export type Senior = {
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

export const seedSeniors: Senior[] = [
  { id: 1, name: 'Eleanor Martin', initials: 'EM', age: 74, priority: 18, reason: 'Routine is consistent', status: 'Normal', medications: [{ id: 11, name: 'Metformin', dosage: '500 mg', time: '08:00', instruction: 'After breakfast', status: 'TAKEN' }, { id: 12, name: 'Vitamin D3', dosage: '1000 IU', time: '13:00', instruction: 'With lunch', status: 'PENDING' }, { id: 13, name: 'Amlodipine', dosage: '5 mg', time: '20:00', instruction: 'With water', status: 'PENDING' }], history: [{ date: 'Today', time: '08:12', medicine: 'Metformin', status: 'TAKEN', note: 'Confirmed by senior' }, { date: 'Yesterday', time: '08:05', medicine: 'Metformin', status: 'TAKEN', note: 'Confirmed by senior' }, { date: 'Yesterday', time: '13:20', medicine: 'Vitamin D3', status: 'DELAYED', note: '20 minute delay' }] },
  { id: 2, name: 'Robert Williams', initials: 'RW', age: 81, priority: 63, reason: 'Repeated delays', status: 'Watch', medications: [{ id: 21, name: 'Lisinopril', dosage: '10 mg', time: '08:00', instruction: 'Before breakfast', status: 'DELAYED' }, { id: 22, name: 'Warfarin', dosage: '2.5 mg', time: '18:00', instruction: 'With dinner', status: 'PENDING' }], history: [{ date: 'Today', time: '08:31', medicine: 'Lisinopril', status: 'DELAYED', note: '31 minute delay' }, { date: 'Yesterday', time: '08:27', medicine: 'Lisinopril', status: 'DELAYED', note: '27 minute delay' }] },
  { id: 3, name: 'Margaret Chen', initials: 'MC', age: 78, priority: 42, reason: 'One missed confirmation', status: 'Watch', medications: [{ id: 31, name: 'Levothyroxine', dosage: '50 mcg', time: '07:30', instruction: 'On an empty stomach', status: 'MISSED' }, { id: 32, name: 'Calcium', dosage: '600 mg', time: '12:30', instruction: 'With lunch', status: 'PENDING' }], history: [{ date: 'Today', time: '07:30', medicine: 'Levothyroxine', status: 'MISSED', note: 'No confirmation received' }] },
  { id: 4, name: 'Lakshmi', initials: 'L', age: 72, priority: 88, reason: 'Missed confirmations', status: 'Support required', medications: [{ id: 41, name: 'Metformin', dosage: '500 mg', time: '08:00 AM', instruction: 'Take 1 tablet after breakfast', status: 'PENDING' }, { id: 42, name: 'Vitamin D', dosage: '1000 IU', time: '01:00 PM', instruction: 'Take 1 tablet after lunch', status: 'PENDING' }, { id: 43, name: 'Amlodipine', dosage: '5 mg', time: '08:00 PM', instruction: 'Take 1 tablet', status: 'PENDING' }], history: [] },
  { id: 5, name: 'Patricia Davis', initials: 'PD', age: 76, priority: 12, reason: 'Normal routine', status: 'Normal', medications: [{ id: 51, name: 'Aspirin', dosage: '81 mg', time: '09:00', instruction: 'With breakfast', status: 'TAKEN' }, { id: 52, name: 'Pravastatin', dosage: '40 mg', time: '21:00', instruction: 'At bedtime', status: 'PENDING' }], history: [{ date: 'Today', time: '09:03', medicine: 'Aspirin', status: 'TAKEN', note: 'Confirmed by senior' }] },
]
