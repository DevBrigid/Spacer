import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Apartments',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Villas',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Offices',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const steps = [
    {
      title: 'Browse Spaces',
      desc: 'Discover carefully selected unique spaces designed to fit your needs',
    },
    {
      title: 'Register/ Login',
      desc: 'Sign up or login to make booking quick and seamless',
    },
    {
      title: 'Book Spaces',
      desc: 'Choose your preferred space, select your date and time, and complete your booking securely in just a few clicks',
    },
    {
      title: 'Enjoy the Space',
      desc: 'Arrive, settle in, and enjoy a comfortable experience in a space that feels right for you',
    },
  ];

  const reviews = [
    {
      quote: '“A terrific idea to meet people with similar interests”',
      name: 'Adam',
      role: 'Spacer Client',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    },
    {
      quote: '“A fantastic way to lease out your space”',
      name: 'Amani',
      role: 'Spacer Host',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    },
    {
      quote: '“A genuine way to collaborate with colleagues”',
      name: 'Max',
      role: 'Spacer Client',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-6xl px-6 py-6 md:px-16 lg:px-24">
        {/* Hero Section */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            MEET, CREATE, CELEBRATE!
          </h1>
          <p className="max-w-xl text-xs leading-relaxed text-gray-500">
            A platform that enables people to meet, create (collaborate with colleagues), and celebrate!
          </p>
          <div>
            <button
              onClick={() => navigate('/spaces')}
              className="rounded bg-black px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800"
            >
              GET STARTED
            </button>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="Living space"
              className="h-80 w-full object-cover sm:h-96 md:h-[420px]"
            />
          </div>
        </section>

        {/* Popular Space Categories */}
        <section className="mt-16">
          <h2 className="text-base font-semibold">Popular Space Categories</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.name} className="group cursor-pointer" onClick={() => navigate('/spaces')}>
                <div className="overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-800">{cat.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/spaces')}
              className="rounded bg-neutral-200 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:bg-neutral-300"
            >
              BROWSE SPACES
            </button>
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-20">
          <h2 className="text-base font-semibold">How It Works!</h2>
          <div className="mt-8 grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.title} className="space-y-1">
                  <h3 className="text-xs font-bold text-neutral-900">{step.title}</h3>
                  <p className="max-w-sm text-xs leading-relaxed text-gray-500">{step.desc}</p>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={() => navigate('/spaces')}
                  className="rounded bg-black px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
                >
                  Browse Spaces Now
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80"
                alt="Friends celebrating outside"
                className="h-96 w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-20">
          <h2 className="text-base font-bold uppercase tracking-wider">REVIEWS</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((rev) => (
              <div
                key={rev.name}
                className="flex flex-col justify-between rounded-lg border border-gray-100 bg-neutral-50 p-6 shadow-sm"
              >
                <p className="text-xs font-medium leading-relaxed text-gray-800">
                  {rev.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{rev.name}</h4>
                    <p className="text-[10px] text-gray-400">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Spacer Today */}
        <section className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-10 sm:flex-row">
          <h2 className="text-base font-bold uppercase tracking-wide">JOIN SPACER TODAY!</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/login')}
              className="rounded bg-black px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded bg-neutral-200 px-5 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-300"
            >
              Register
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto mt-20 max-w-6xl border-t border-gray-100 px-6 py-8 md:px-16 lg:px-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase">Spacer&copy;</span>
            <div className="flex gap-3 text-xs text-neutral-600">
              <span className="cursor-pointer hover:text-black">🌐</span>
              <span className="cursor-pointer hover:text-black">📷</span>
              <span className="cursor-pointer hover:text-black">▶</span>
              <span className="cursor-pointer hover:text-black">in</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11px] text-gray-500">
              Connecting people with open spaces and like-minded people
            </p>
            <p className="mt-1 text-[10px] text-gray-400">spacer &copy; 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
