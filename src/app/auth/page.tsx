'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LoginForm } from './LoginForm'; 
import { RegisterForm } from './RegisterForm'; 

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="bg-shape-top"></div>
      <Image
        src="/images/leaves-background.png"
        alt="Hiasan daun"
        width={300}
        height={400}
        className="bg-leaves-bottom"
        style={{ objectFit: 'contain' }}
      />

      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          
          <div className="flex justify-center mb-6">
            <Image
              src="/images/becycle-logo.png"
              alt="Logo Becycle"
              width={80}
              height={80}
            />
          </div>

          <div className="flex w-full rounded-full bg-slate-100 p-1 mb-8">
            <button
              onClick={() => setAuthMode('login')}
              className={`w-1/2 rounded-full py-2 text-sm font-semibold transition-colors duration-300 ${
                authMode === 'login' ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`w-1/2 rounded-full py-2 text-sm font-semibold transition-colors duration-300 ${
                authMode === 'signup' ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
          
        </div>
      </main>
    </div>
  );
}