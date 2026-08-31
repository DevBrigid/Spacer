const sections = [
  { title: 'Bookings and payments', body: 'A booking is confirmed only after payment is successfully processed. Prices, service fees, taxes, cancellation terms, and any space-specific requirements are shown before payment.' },
  { title: 'Using a booked space', body: 'Arrive and leave at the agreed times, follow the host’s listing rules, keep the space clean, and do not exceed the stated capacity. You are responsible for your guests and for damage caused during your reservation.' },
  { title: 'Cancellations and changes', body: 'Cancellation and refund eligibility depends on the host’s policy and the timing of your request. Contact Spacer promptly if you need to change a reservation or encounter an issue with a space.' },
  { title: 'Safety and conduct', body: 'Use Spacer lawfully and respectfully. We may suspend access or cancel a booking where there is unsafe, abusive, fraudulent, or prohibited activity.' },
  { title: 'Privacy and account information', body: 'Keep your account details accurate and protect your password. We handle personal information as described in our Privacy Policy.' },
];

function AgreementPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-stone-800 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Spacer / Client agreement</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">Terms for booking with Spacer</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">Please read these client policies before creating an account or reserving a space. By agreeing, you confirm that you understand and accept them.</p>
      <div className="mt-10 space-y-7">{sections.map((section, index) => <section key={section.title} className="border-t border-stone-200 pt-6"><p className="text-xs font-medium text-stone-400">{String(index + 1).padStart(2, '0')}</p><h2 className="mt-2 text-lg font-semibold text-stone-950">{section.title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{section.body}</p></section>)}</div>
      <aside className="mt-10 border border-stone-200 bg-stone-50 p-5 text-sm leading-6 text-stone-700">These client policies form part of Spacer’s Terms of Service.</aside>
      <p className="mt-6 text-xs text-stone-500">Last updated: August 21, 2026</p>
    </main>
  );
}

export default AgreementPage;
