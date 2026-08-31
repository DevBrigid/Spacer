import base64
from datetime import datetime
import requests
from app.config import settings


def get_access_token() -> str:
    credentials = f"{settings.daraja_consumer_key}:{settings.daraja_consumer_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    response = requests.get(
        f"{settings.daraja_base_url}/oauth/v1/generate?grant_type=client_credentials",
        headers={"Authorization": f"Basic {encoded_credentials}"},
    )
    response.raise_for_status()
    return response.json()["access_token"]


def _generate_password_and_timestamp() -> tuple[str, str]:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    raw = f"{settings.daraja_shortcode}{settings.daraja_passkey}{timestamp}"
    password = base64.b64encode(raw.encode()).decode()
    return password, timestamp


def initiate_stk_push(phone_number: str, amount: float, account_reference: str) -> dict:
    """
    phone_number must already be normalized to 2547XXXXXXXX format.
    account_reference is typically your booking/payment reference.
    """
    token = get_access_token()
    password, timestamp = _generate_password_and_timestamp()

    payload = {
        "BusinessShortCode": settings.daraja_shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": settings.daraja_shortcode,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.daraja_callback_url,
        "AccountReference": account_reference,
        "TransactionDesc": "Spacer booking payment",
    }

    response = requests.post(
        f"{settings.daraja_base_url}/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    response.raise_for_status()
    return response.json()