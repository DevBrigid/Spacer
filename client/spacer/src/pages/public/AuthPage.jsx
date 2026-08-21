import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addUser, loginUser, socialLoginUser } from '../../store/usersSlice';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const updateField = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const action = isLogin ? loginUser({ email: formData.email, password: formData.password }) : addUser(formData);
    dispatch(action).unwrap().then(() => navigate('/')).catch(() => undefined);
  };
  const socialLogin = (provider) => dispatch(socialLoginUser(provider)).unwrap().then(() => navigate('/')).catch(() => undefined);

  return (
    <div className="mx-auto min-h-screen max-w-md px-6 py-12">
      <button className="text-sm text-stone-600 underline" onClick={() => navigate('/')}>← Previous</button>
      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">SPACER</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome to Spacer</h1>
        <p className="mt-3 text-sm text-stone-600">Find a space, or list your own, in a few clicks.</p>
      </div>
      {error && <p className="mt-6 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-8 space-y-3">
        <button className="w-full border border-stone-300 py-3 text-sm hover:border-black" onClick={() => socialLogin('google')}>Continue with Google</button>
        <button className="w-full border border-stone-300 py-3 text-sm hover:border-black" onClick={() => socialLogin('facebook')}>Continue with Facebook</button>
      </div>
      <div className="my-7 flex items-center gap-3 text-xs text-stone-500"><span className="h-px flex-1 bg-stone-200" />or<span className="h-px flex-1 bg-stone-200" /></div>
      <form onSubmit={submit} className="space-y-4">
        {!isLogin && <label className="block text-sm text-stone-600">Full name<input name="name" value={formData.name} onChange={updateField} required className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" /></label>}
        <label className="block text-sm text-stone-600">Email address<input type="email" name="email" value={formData.email} onChange={updateField} placeholder="you@email.com" required className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" /></label>
        <label className="block text-sm text-stone-600"><span className="flex justify-between">Password{isLogin && <a href="https://spacer.com/forgot" className="underline">Forgot?</a>}</span><input type="password" name="password" value={formData.password} onChange={updateField} required className="mt-2 w-full border border-stone-300 px-3 py-3 text-sm" /></label>
        <button disabled={loading} className="w-full bg-black py-3 text-sm font-medium text-white hover:bg-stone-700">{loading ? 'Processing...' : isLogin ? 'Log in' : 'Register'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-600">{isLogin ? "Don't have an account?" : 'Already have an account?'} <button className="font-medium text-black underline" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Log in'}</button></p>
      <footer className="mt-16 border-t border-stone-200 pt-6 text-center text-xs text-stone-500"><strong className="text-black">Spacer©</strong><p className="mt-2">Connecting people with open spaces and like-minded people</p><p className="mt-1">spacer©2026</p></footer>
    </div>
  );
}
