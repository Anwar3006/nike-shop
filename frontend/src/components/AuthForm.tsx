'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthForm = ({ type }: { type: 'sign-in' | 'sign-up' }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic will be implemented separately
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="mb-2 text-3xl font-bold text-foreground">
        {type === 'sign-in' ? 'Sign In' : 'Join Nike Today!'}
      </h2>
      <p className="mb-8 text-muted-foreground">
        {type === 'sign-in'
          ? 'Welcome back to your account'
          : 'Create your account to start your fitness journey'}
      </p>

      {type === 'sign-up' && (
        <div className="mb-4">
          <label
            htmlFor="full-name"
            className="mb-2 block text-sm font-medium text-muted-foreground"
          >
            Full Name
          </label>
          <input
            type="text"
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent p-3 text-foreground"
            placeholder="Enter your full name"
            required
          />
        </div>
      )}

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
          className="w-full rounded-md border border-input bg-transparent p-3 text-foreground"
          placeholder="johndoe@gmail.com"
          required
        />
      </div>
      <div className="relative mb-6">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-muted-foreground"
        >
          Password
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-input bg-transparent p-3 text-foreground"
          placeholder="minimum 8 characters"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 pt-8 text-gray-400"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-black px-5 py-3 text-center font-medium text-white hover:bg-gray-800"
      >
        {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
