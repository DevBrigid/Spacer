#!/usr/bin/env python3
import os, sys, traceback
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

# register/login
r = client.post('/auth/login', params={'email': EMAIL, 'password': 'secret123'})
print('login', r.status_code, r.text)
if r.status_code != 200:
    sys.exit(2)
TOKEN = r.json().get('access_token')

# promote
with SessionLocal() as db:
    u=db.query(User).filter(User.email==EMAIL).first()
    print('found user', u and u.id, 'is_admin', u and u.is_admin)
    if u:
        u.is_admin = True
        db.commit()

headers = {'Authorization': f'Bearer {TOKEN}'}

payload = {"title":"TC Space","description":"desc","location":"here","capacity":2,"pricePerHour":5}
try:
    resp = client.post('/admin/spaces', json=payload, headers=headers)
    print('resp', resp.status_code, resp.text)
except Exception:
    print('EXC TRACEBACK')
    traceback.print_exc()
