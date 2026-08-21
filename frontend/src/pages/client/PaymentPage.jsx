import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initiatePayment } from '../../store/paymentsSlice';

export default function PaymentPage() {
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.payments);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', address: '' });
  const subtotal = 20000;
  const serviceFee = 1500;
  const tax = 3440;
  const total = subtotal + serviceFee + tax;
  const handleChange = (event) => setCard({ ...card, [event.target.name]: event.target.value });
  const handleSubmit = (event) => { event.preventDefault(); dispatch(initiatePayment({ bookingId: 1, amount: total, phoneNumber: '' })); };

  return (
    <div className="public-page checkout-page">
      <header className="checkout-header"><p className="eyebrow">SPACER / PAYMENT</p><h1>Secure Checkout</h1><p>Complete your booking reservation with encrypted payment</p></header>
      {payment.status === 'success' && <div className="payment-success">Payment successful. Your reservation is confirmed.</div>}
      <div className="checkout-grid"><section className="checkout-form"><h2>Payment details</h2><div className="saved-payment"><span className="card-icon">VISA</span><div><strong>Visa ending in 4242</strong><small>Expires 12/28</small></div><span>Saved</span></div><h3>Or enter new card details</h3><form onSubmit={handleSubmit}><label>Card number<input name="number" value={card.number} onChange={handleChange} placeholder="0000 0000 0000 0000" required /></label><div className="checkout-row"><label>Expiration date<input name="expiry" value={card.expiry} onChange={handleChange} placeholder="MM / YY" required /></label><label>CVV<input name="cvv" value={card.cvv} onChange={handleChange} placeholder="•••" required /></label></div><label>Billing Address<input name="address" value={card.address} onChange={handleChange} placeholder="Street Address, Apt, Suite" required /></label><button className="primary-button pay-button" disabled={payment.status === 'pending'}>{payment.status === 'pending' ? 'Processing...' : `Pay Now (KES ${total.toLocaleString()}.00)`}</button></form></section><aside className="order-summary"><h2>Order Summary</h2><div className="summary-space"><strong>The Creative Floor</strong><span>Studio B • Westlands</span></div><p className="summary-label">RESERVATION DATE</p><p>August 24, 2026 (10:00 AM - 2:00 PM)</p><dl><div><dt>Subtotal</dt><dd>KES 20,000.00</dd></div><div><dt>Service fee</dt><dd>KES 1,500.00</dd></div><div><dt>Tax</dt><dd>KES 3,440.00</dd></div><div className="total"><dt>Total Due</dt><dd>KES 24,940.00</dd></div></dl></aside></div><footer className="site-footer"><strong>Spacer©</strong><span>Connecting people with open spaces and like-minded people</span><small>spacer©2026</small></footer>
    </div>
  );
}
