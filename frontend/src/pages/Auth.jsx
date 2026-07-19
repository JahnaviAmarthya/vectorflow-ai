import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiGithub, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { login, register } from '../services/authService';
import './Auth.css';

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="vf-auth">
      <div className="vf-auth__glow" />
      <Link to="/" className="vf-auth__logo gradient-text">VectorFlow</Link>
      <motion.div
        className="glass-panel vf-auth__card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1>{title}</h1>
        <p className="vf-auth__subtitle">{subtitle}</p>
        {children}
        {footer}
      </motion.div>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="vf-auth__social">
      <button type="button" className="vf-auth__socialbtn" onClick={() => toast('Social login is a UI demo in this build.')}>
        <FcGoogle size={16} /> Google
      </button>
      <button type="button" className="vf-auth__socialbtn" onClick={() => toast('Social login is a UI demo in this build.')}>
        <FiGithub size={16} /> GitHub
      </button>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { register: field, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(values) {
    try {
      login(values);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep building your pipelines."
      footer={<p className="vf-auth__switch">No account? <Link to="/register">Create one</Link></p>}
    >
      <SocialButtons />
      <div className="vf-auth__divider"><span>or</span></div>
      <form onSubmit={handleSubmit(onSubmit)} className="vf-auth__form">
        <label className="vf-auth__field">
          <FiMail size={14} />
          <input placeholder="Email" type="email" {...field('email', { required: true })} />
        </label>
        {errors.email && <span className="vf-auth__error">Email is required</span>}

        <label className="vf-auth__field">
          <FiLock size={14} />
          <input placeholder="Password" type="password" {...field('password', { required: true })} />
        </label>
        {errors.password && <span className="vf-auth__error">Password is required</span>}

        <div className="vf-auth__row">
          <label className="vf-auth__remember">
            <input type="checkbox" {...field('remember')} /> Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="vf-auth__submit" disabled={isSubmitting}>
          Log in <FiArrowRight size={14} />
        </button>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { register: field, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  async function onSubmit(values) {
    try {
      register(values);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start building AI pipelines in minutes."
      footer={<p className="vf-auth__switch">Already have an account? <Link to="/login">Log in</Link></p>}
    >
      <SocialButtons />
      <div className="vf-auth__divider"><span>or</span></div>
      <form onSubmit={handleSubmit(onSubmit)} className="vf-auth__form">
        <label className="vf-auth__field">
          <FiUser size={14} />
          <input placeholder="Full name" {...field('name', { required: true })} />
        </label>
        {errors.name && <span className="vf-auth__error">Name is required</span>}

        <label className="vf-auth__field">
          <FiMail size={14} />
          <input placeholder="Email" type="email" {...field('email', { required: true })} />
        </label>
        {errors.email && <span className="vf-auth__error">Email is required</span>}

        <label className="vf-auth__field">
          <FiLock size={14} />
          <input placeholder="Password" type="password" {...field('password', { required: true, minLength: 6 })} />
        </label>
        {errors.password && <span className="vf-auth__error">Minimum 6 characters</span>}

        <button type="submit" className="vf-auth__submit" disabled={isSubmitting}>
          Create account <FiArrowRight size={14} />
        </button>
      </form>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register: field, handleSubmit } = useForm();

  function onSubmit() {
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send a reset link to your email."
      footer={<p className="vf-auth__switch"><Link to="/login">Back to login</Link></p>}
    >
      {sent ? (
        <p className="vf-auth__sent">If an account exists for that email, a reset link is on its way.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="vf-auth__form">
          <label className="vf-auth__field">
            <FiMail size={14} />
            <input placeholder="Email" type="email" {...field('email', { required: true })} />
          </label>
          <button type="submit" className="vf-auth__submit">Send reset link <FiArrowRight size={14} /></button>
        </form>
      )}
    </AuthShell>
  );
}
