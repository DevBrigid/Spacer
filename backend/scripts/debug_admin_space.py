#!/usr/bin/env python3
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import requests
from app.database import SessionLocal
from app.models.user import User

BASE='http://127.0.0.1:8000'
EMAIL = os.environ.get('SMOKE_EMAIL')
if not EMAIL:
    print('Set SMOKE_EMAIL env to existing user email')
    sys.exit(1)
PASS='secret123'

# login
r = requests.post(f"{BASE}/auth/login", params={'email': EMAIL, 'password': PASS})
print('login status', r.status_code, r.text)
if r.status_code!=200:
    sys.exit(2)
TOKEN = r.json().get('access_token')

# promote via DB
with SessionLocal() as db:
    u=db.query(User).filter(User.email==EMAIL).first()
    print('found user', u and u.id)
    u.is_admin = True
    db.commit()

headers={'Authorization': f'Bearer {TOKEN}'}
payload={"title":"Debug Space","description":"desc","location":"here","capacity":2,"pricePerHour":5}
r = requests.post(f"{BASE}/admin/spaces", json=payload, headers=headers)
print('POST /admin/spaces', r.status_code)
print('response text:', r.text)
try:
    print('json:', r.json())
except:
    pass
