import re
from fastapi import HTTPException


def normalize_phone_number(phone: str) -> str:
    """
    Converts common Kenyan phone number formats into Daraja's required
    2547XXXXXXXX (12-digit, no +, no leading 0) format.

    Accepts: 0712345678, 712345678, 254712345678, +254712345678
    """
    if not phone:
        raise HTTPException(status_code=400, detail="Phone number is required")

    digits = re.sub(r"\D", "", phone)  # strip spaces, dashes, +, parentheses, etc.

    if digits.startswith("0") and len(digits) == 10:
        normalized = "254" + digits[1:]
    elif digits.startswith("254") and len(digits) == 12:
        normalized = digits
    elif digits.startswith("7") and len(digits) == 9:
        normalized = "254" + digits
    elif digits.startswith("1") and len(digits) == 9:
        # Safaricom also issues 01... numbers now (newer prefix range)
        normalized = "254" + digits
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid phone number format. Use a valid Kenyan number (e.g. 0712345678 or 254712345678)"
        )

    if not re.match(r"^254(7|1)\d{8}$", normalized):
        raise HTTPException(status_code=400, detail="Phone number must be a valid Safaricom/Kenyan mobile number")

    return normalized