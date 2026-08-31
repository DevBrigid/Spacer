#!/usr/bin/env python3
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import User

client = TestClient(app)

EMAIL = os.environ.get('SMOKE_EMAIL')
if not EMAIL:
    print('Set SMOKE_EMAIL env')
    sys.exit(1)

# login
r = client.post('/auth/login', params={'email': EMAIL, 'password': 'secret123'})
print('login', r.status_code, r.text)
TOKEN = r.json().get('access_token')
headers = {'Authorization': f'Bearer {TOKEN}'}

# promote
with SessionLocal() as db:
    u=db.query(User).filter(User.email==EMAIL).first()
    print('found user', u and u.id)
    if u:
        u.is_admin = True
        db.commit()

# create space
r = client.post('/admin/spaces', json={'title':'TC','description':'d','location':'here','capacity':2,'pricePerHour':5}, headers=headers)
print('create space', r.status_code, r.text)
space = r.json()
space_id = space.get('id')

# create booking
booking_payload = {"spaceId": space_id, "startTime": "2026-08-27T12:00:00Z", "durationHours": 1.0, "totalAmount": 5.0}
rb = client.post(f'/spaces/{space_id}/bookings', json=booking_payload, headers=headers)
print('create booking', rb.status_code, rb.text)

# print DB booking rows
from app.database import SessionLocal
from app.models.booking import Booking
with SessionLocal() as db:
    rows = db.query(Booking).all()
    print('bookings in db:', [(b.id, b.start_time, b.end_time, float(b.total_price)) for b in rows])
