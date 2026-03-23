"use client"

import { useActionState } from "react";
import { loginAdmin } from "../actions";

const initialState = { error: null as string | null };

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 font-sans">
      <div className="text-center mb-8">
        <div className="inline-flex w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
        <p className="text-slate-500 mt-2 font-medium">Secure access to manage stories</p>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Admin ID</label>
          <input 
            type="text" 
            name="id" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Enter Admin ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Secret Key</label>
          <input 
            type="password" 
            name="secret" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Enter your Secret Key"
          />
        </div>

        {state?.error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium text-center">
            {state.error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isPending ? "Authenticating..." : "Secure Login"}
        </button>
      </form>
    </div>
  );
}
