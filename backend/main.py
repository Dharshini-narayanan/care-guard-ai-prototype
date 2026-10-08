from datetime import datetime
from pathlib import Path
import sqlite3
from typing import Optional
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .ml_service import predict_support_priority
from .voice_service import VoiceService

DB_PATH = Path(__file__).parent / 'careguard.db'
app = FastAPI(title='CareGuard AI API', version='0.1.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
voice_service = VoiceService()

class MedicationEvent(BaseModel):
    senior_id: int
    medication_id: int
    status: str
    scheduled_time: str

class MLPayload(BaseModel):
    delay_minutes: int = 0
    missed_last_7_days: int = 0
    delayed_last_7_days: int = 0
    consecutive_missed: int = 0
    average_delay_30_days: float = 0

def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with connect() as db:
        db.executescript('''
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password_hash TEXT, role TEXT, language TEXT DEFAULT 'EN', created_at TEXT);
        CREATE TABLE IF NOT EXISTS seniors (id INTEGER PRIMARY KEY, user_id INTEGER, name TEXT, date_of_birth TEXT, caregiver_id INTEGER, created_at TEXT);
        CREATE TABLE IF NOT EXISTS medications (id INTEGER PRIMARY KEY, senior_id INTEGER, medicine_name TEXT, dosage TEXT, frequency TEXT, scheduled_time TEXT, instructions TEXT, active INTEGER DEFAULT 1, created_at TEXT);
        CREATE TABLE IF NOT EXISTS medication_events (id INTEGER PRIMARY KEY, senior_id INTEGER, medication_id INTEGER, scheduled_time TEXT, actual_time TEXT, status TEXT, delay_minutes INTEGER DEFAULT 0, created_at TEXT);
        CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY, senior_id INTEGER, priority INTEGER, reason TEXT, status TEXT DEFAULT 'OPEN', created_at TEXT);
        ''')
        if db.execute('SELECT COUNT(*) FROM users').fetchone()[0] == 0:
            now = datetime.utcnow().isoformat()
            db.execute("INSERT INTO users (name,email,password_hash,role,created_at) VALUES (?,?,?,?,?)", ('Sarah Collins','caregiver@test.com','demo123','caregiver',now))
            for index, name in enumerate(['Eleanor Martin','Robert Williams','Margaret Chen','James Anderson','Patricia Davis'], 1):
                db.execute("INSERT INTO seniors (id,user_id,name,date_of_birth,caregiver_id,created_at) VALUES (?,?,?,?,?,?)", (index, 1, name, '1948-01-01', 1, now))
            db.executemany("INSERT INTO medications (id,senior_id,medicine_name,dosage,frequency,scheduled_time,instructions,created_at) VALUES (?,?,?,?,?,?,?,?)", [(11,1,'Metformin','500 mg','Once daily','08:00','After breakfast',now),(21,2,'Lisinopril','10 mg','Once daily','08:00','Before breakfast',now),(31,3,'Levothyroxine','50 mcg','Once daily','07:30','On an empty stomach',now),(41,4,'Metformin','500 mg','Once daily','08:00','After breakfast',now),(42,4,'Amlodipine','5 mg','Once daily','13:00','With water',now),(51,5,'Aspirin','81 mg','Once daily','09:00','With breakfast',now)])

@app.on_event('startup')
def startup(): init_db()

@app.get('/api/health')
def health(): return {'status': 'ok', 'service': 'careguard-api'}

@app.post('/api/auth/login')
def login(email: str, password: str):
    with connect() as db:
        row = db.execute('SELECT id,name,email,role,language FROM users WHERE email=? AND password_hash=?', (email,password)).fetchone()
    return dict(row) if row else {'error': 'Invalid demo credentials'}

@app.get('/api/seniors')
def get_seniors():
    with connect() as db: return [dict(row) for row in db.execute('SELECT * FROM seniors ORDER BY id')]

@app.post('/api/seniors')
def create_senior(name: str, caregiver_id: int = 1):
    with connect() as db:
        cursor = db.execute('INSERT INTO seniors (name,caregiver_id,created_at) VALUES (?,?,?)', (name, caregiver_id, datetime.utcnow().isoformat()))
        return {'id': cursor.lastrowid, 'name': name}

@app.get('/api/seniors/{senior_id}')
def get_senior(senior_id: int):
    with connect() as db:
        senior = db.execute('SELECT * FROM seniors WHERE id=?', (senior_id,)).fetchone()
        medications = db.execute('SELECT * FROM medications WHERE senior_id=? AND active=1', (senior_id,)).fetchall()
        events = db.execute('SELECT * FROM medication_events WHERE senior_id=? ORDER BY created_at DESC', (senior_id,)).fetchall()
    return {'senior': dict(senior) if senior else None, 'medications': [dict(x) for x in medications], 'events': [dict(x) for x in events]}

@app.post('/api/medication-events')
def create_event(event: MedicationEvent):
    now = datetime.utcnow().isoformat()
    with connect() as db:
        db.execute('INSERT INTO medication_events (senior_id,medication_id,scheduled_time,actual_time,status,created_at) VALUES (?,?,?,?,?,?)', (event.senior_id,event.medication_id,event.scheduled_time,now,event.status,now))
    return {'saved': True, 'actual_time': now, 'status': event.status}

@app.get('/api/medication-events/{senior_id}')
def get_events(senior_id: int):
    with connect() as db: return [dict(row) for row in db.execute('SELECT * FROM medication_events WHERE senior_id=? ORDER BY created_at DESC', (senior_id,))]

@app.get('/api/dashboard')
def dashboard():
    with connect() as db:
        return {'seniors': [dict(x) for x in db.execute('SELECT * FROM seniors')], 'alerts': [dict(x) for x in db.execute("SELECT * FROM alerts WHERE status='OPEN'")]}

@app.get('/api/alerts')
def alerts():
    with connect() as db: return [dict(row) for row in db.execute('SELECT * FROM alerts ORDER BY created_at DESC')]

@app.post('/api/prescriptions/upload')
def upload_prescription(file: UploadFile = File(...)):
    return {'filename': file.filename, 'status': 'extracted', 'verified': False, 'medications': [{'medicine_name':'Metformin','dosage':'500 mg','scheduled_time':'08:00','frequency':'Once daily','instructions':'After breakfast'}]}

@app.post('/api/ml/predict')
def ml_predict(payload: MLPayload): return predict_support_priority(payload.model_dump())

@app.post('/api/voice/respond')
def voice_respond(text: str, context: Optional[str] = None): return voice_service.generate_response(text, context or '')
