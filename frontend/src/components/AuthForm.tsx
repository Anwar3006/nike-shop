'use client';

import { useState } from 'react';

const AuthForm = ({ type }: { type: 'sign-in' | 'sign-up' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic will be implemented separately
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg"
    >
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
        {type === 'sign-in' ? 'Welcome Back' : 'Create an Account'}
      </h2>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-muted-foreground"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border bg-input p-2.5 text-foreground focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-muted-foreground"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border bg-input p-2.5 text-foreground focus:border-primary focus:ring-primary"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50"
      >
        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
