#!/usr/bin/env python3
import time
import requests
import sys
from pprint import pprint

BASE = "http://127.0.0.1:8000"
EMAIL = f"smoke+{int(time.time())}@example.com"
PASS = "secret123"

print('EMAIL', EMAIL)

def try_register():
    url = f"{BASE}/auth/register"
    r = requests.post(url, json={"email": EMAIL, "password": PASS})
    print('REGISTER', r.status_code)
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
    return r


def try_login():
    url = f"{BASE}/auth/login"
    # Try query params first (API historically accepted this)
    r = requests.post(url, params={"email": EMAIL, "password": PASS})
    print('LOGIN (params)', r.status_code)
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
    token = r.json().get('access_token') if r.status_code == 200 else None
    if not token:
        # try JSON body
        r2 = requests.post(url, json={"email": EMAIL, "password": PASS})
        print('LOGIN (json)', r2.status_code)
        try:
            pprint(r2.json())
        except Exception:
            print(r2.text)
        token = r2.json().get('access_token') if r2.status_code == 200 else None
    return token


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


if __name__ == '__main__':
    try:
        r = try_register()
        token = try_login()
        if not token:
            print('Login failed, abort')
            sys.exit(2)

        print('GET /')
        print(requests.get(f"{BASE}/").status_code)

        print('GET /spaces')
        print(requests.get(f"{BASE}/spaces").status_code)

        print('GET /spacer/dashboard')
        print(requests.get(f"{BASE}/spacer/dashboard", headers=auth_headers(token)).status_code)

        print('GET /spacer/my/bookings')
        print(requests.get(f"{BASE}/spacer/my/bookings", headers=auth_headers(token)).status_code)

        # promote to admin via DB
        # ensure backend package root is on sys.path
        import os, sys as _sys
        _sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
        from app.database import SessionLocal
        from app.models.user import User
        with SessionLocal() as db:
            u = db.query(User).filter(User.email == EMAIL).first()
            if not u:
                print('User not found in DB')
            else:
                u.is_admin = True
                db.commit()
                print('Promoted to admin', u.id)

        # create a space
        payload = {"title": "Smoke Space", "description": "test", "location": "nowhere", "capacity": 4, "pricePerHour": 10}
        r = requests.post(f"{BASE}/admin/spaces", json=payload, headers=auth_headers(token))
        print('POST /admin/spaces', r.status_code)
        space = r.json() if r.status_code in (200,201) else {}
        pprint(space)
        space_id = space.get('id')

        if space_id:
            # create booking via nested endpoint
            booking_payload = {"spaceId": space_id, "startTime": "2026-08-27T12:00:00Z", "durationHours": 1.0, "totalAmount": 10.0}
            r = requests.post(f"{BASE}/spaces/{space_id}/bookings", json=booking_payload, headers=auth_headers(token))
            print(f'POST /spaces/{space_id}/bookings', r.status_code)
            try:
                pprint(r.json())
            except Exception:
                print(r.text)

        print('GET /spaces/{id}/bookings (public)')
        if space_id:
            print(requests.get(f"{BASE}/spaces/{space_id}/bookings").status_code)

        print('GET /bookings?all=true')
        print(requests.get(f"{BASE}/bookings?all=true", headers=auth_headers(token)).status_code)

        print('SMOKE TEST COMPLETE')
    except Exception as e:
        print('ERROR', e)
        sys.exit(1)
