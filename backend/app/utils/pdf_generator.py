from datetime import datetime
from weasyprint import HTML


def generate_invoice_pdf_bytes(invoice_data: dict) -> bytes:
    """
    invoice_data expects: invoice_number, client_name, space_name,
    amount_paid, phone_number, receipt_number, paid_at
    """
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: sans-serif; padding: 40px; }}
            h1 {{ color: #333; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            td {{ padding: 8px 0; border-bottom: 1px solid #eee; }}
            .label {{ color: #666; }}
        </style>
    </head>
    <body>
        <h1>Spacer Invoice</h1>
        <p>Invoice #{invoice_data['invoice_number']}</p>
        <table>
            <tr><td class="label">Client</td><td>{invoice_data['client_name']}</td></tr>
            <tr><td class="label">Space</td><td>{invoice_data['space_name']}</td></tr>
            <tr><td class="label">Amount Paid</td><td>KES {invoice_data['amount_paid']}</td></tr>
            <tr><td class="label">Phone Number</td><td>{invoice_data['phone_number']}</td></tr>
            <tr><td class="label">M-Pesa Receipt</td><td>{invoice_data['receipt_number']}</td></tr>
            <tr><td class="label">Paid At</td><td>{invoice_data['paid_at']}</td></tr>
        </table>
    </body>
    </html>
    """
    return HTML(string=html_content).write_pdf()