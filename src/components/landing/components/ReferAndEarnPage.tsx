import React, { useState } from 'react';
import { 
  Coins, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  TrendingUp, 
  Gift, 
  Sparkles, 
  Link as LinkIcon 
} from 'lucide-react';

interface ReferAndEarnPageProps {
  onOpenDemo: () => void;
  onNavigate?: (path: string) => void;
}

export const ReferAndEarnPage: React.FC<ReferAndEarnPageProps> = ({ onOpenDemo }) => {
  const [copied, setCopied] = useState(false);
  const [calculatorCount, setCalculatorCount] = useState<number>(5);

  // Referral rule: 150 coins per successful referral
  const COINS_PER_REFERRAL = 150;

  // Mock initial stats structured for future backend API integration
  const mockUserData = {
    referralCode: 'LETGETIN-AI-7829',
    referralLink: 'https://letgetin.com/join?ref=LETGETIN-AI-7829',
    totalReferrals: 8,
    totalCoinsEarned: 8 * COINS_PER_REFERRAL, // 1,200 coins
    pendingReferrals: 3,
    recentReferrals: [
      { name: 'Sarah Jenkins', role: 'Full Stack Engineer', status: 'Completed', coins: 150, date: '2 days ago' },
      { name: 'Alex Rivera', role: 'AI / ML Researcher', status: 'Completed', coins: 150, date: '4 days ago' },
      { name: 'Marcus Chen', role: 'Product Designer', status: 'Completed', coins: 150, date: '1 week ago' },
      { name: 'Elena Rostova', role: 'Quantitative Analyst', status: 'In Verification', coins: 0, date: 'Just now' },
    ]
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockUserData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Join LetGetIn using my referral link and get your skills verified by AI with zero CV bias! #LetGetIn #TechCareers`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(mockUserData.referralLink)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(mockUserData.referralLink)}`, '_blank');
  };

  const calculatedCoins = calculatorCount * COINS_PER_REFERRAL;

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>COMMUNITY GROWTH REWARDS</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Refer & Earn <span className="text-gradient-blue">150 Coins</span> per Friend
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Invite top engineers, researchers, and creators to LetGetIn. For every person who joins and verifies their profile, you automatically earn <strong className="text-[#061f3d] font-bold">150 coins</strong> with uncapped reward multipliers.
            </p>

            {/* Quick Stat Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-[#e2edf8] shadow-xs text-xs font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multiplied Rewards: <strong>1 referral = 150 coins</strong> · <strong>10 referrals = 1,500 coins</strong></span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. REFERRAL LINK & STATS DASHBOARD */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Shareable Link Card (2 Columns on large) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-8 shadow-card-clean flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc]">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#061f3d] tracking-tight">
                        Your Unique Referral Link
                      </h3>
                      <p className="text-xs text-slate-500">
                        Share this link with peers, colleagues, or your network.
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                    Active & Verified
                  </span>
                </div>

                {/* Link Input Box */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      readOnly
                      value={mockUserData.referralLink}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-mono rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-6 py-3 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Quick Share
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on X</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-xs font-semibold text-[#0077b5] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on LinkedIn</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Total Balance / Coins Card */}
            <div className="bg-gradient-to-br from-[#062b63] via-[#07498c] to-[#087bc1] rounded-3xl p-6 sm:p-8 text-white shadow-hero-card flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-200">
                    REWARDS BALANCE
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white mb-1">
                  {mockUserData.totalCoinsEarned.toLocaleString()}
                </div>
                <span className="text-xs text-sky-200 font-medium">
                  Total LetGetIn Coins Earned
                </span>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-sky-200 block">Successful Referrals</span>
                  <strong className="text-base text-white font-bold">{mockUserData.totalReferrals}</strong>
                </div>
                <div>
                  <span className="text-sky-200 block">Pending Verification</span>
                  <strong className="text-base text-white font-bold">{mockUserData.pendingReferrals}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* 3. COIN REWARD CALCULATOR */}
          <div className="bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-10 shadow-card-clean mb-12">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>MULTIPLICATION ENGINE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#061f3d] tracking-tight">
                Calculate Your Potential Coins
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Every successful referral gives you 150 coins with zero limits on how many friends you can invite.
              </p>
            </div>

            {/* Interactive Slider */}
            <div className="max-w-2xl mx-auto bg-[#f8fbfe] border border-[#e2edf8] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-slate-700">
                  Number of Friends Invited:
                </label>
                <span className="px-3.5 py-1 bg-[#063970] text-white text-sm font-bold rounded-lg font-mono">
                  {calculatorCount} friends
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="50"
                value={calculatorCount}
                onChange={(e) => setCalculatorCount(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0066cc]"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-2">
                <span>1 friend (150 coins)</span>
                <span>25 friends (3,750 coins)</span>
                <span>50 friends (7,500 coins)</span>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-slate-500 font-medium block">
                    Formula: {calculatorCount} friends × 150 coins
                  </span>
                  <div className="text-3xl font-black text-[#0066cc] font-display">
                    = {calculatedCoins.toLocaleString()} Coins
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  Start Inviting Now
                </button>
              </div>
            </div>
          </div>

          {/* 4. HOW IT WORKS (4 SIMPLE STEPS) */}
          <div className="mb-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
                How It Works
              </h2>
              <p className="text-sm sm:text-base text-slate-500">
                Four clear steps to turn your network into verified skills and reward coins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Share your link',
                  desc: 'Copy your unique referral link and send it to your colleagues, classmates, or community.',
                  icon: Share2,
                },
                {
                  step: '02',
                  title: 'Friend joins LetGetIn',
                  desc: 'They sign up and complete their initial AI-verified skill profile with zero bias.',
                  icon: Users,
                },
                {
                  step: '03',
                  title: 'You earn 150 coins',
                  desc: '150 coins are instantly credited to your LetGetIn rewards balance upon verification.',
                  icon: Gift,
                },
                {
                  step: '04',
                  title: 'Keep earning',
                  desc: 'Repeat as often as you want. There is no ceiling on your referral coin earnings.',
                  icon: TrendingUp,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#e2edf8] p-6 shadow-xs flex flex-col justify-between relative group hover:border-[#bae6fd] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-[#0066cc]">
                          Step {item.step}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-[#061f3d] mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. RECENT REFERRAL ACTIVITY (MOCK TABLE) */}
          <div className="bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-8 shadow-card-clean">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#061f3d]">
                  Referral Activity
                </h3>
                <p className="text-xs text-slate-500">
                  Track the status of your referred peers in real time.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Live Status
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Candidate</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockUserData.recentReferrals.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-bold text-slate-800">{row.name}</td>
                      <td className="py-3.5 text-slate-600">{row.role}</td>
                      <td className="py-3.5 text-slate-400 font-mono">{row.date}</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            row.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-[#0066cc]">
                        {row.coins > 0 ? `+${row.coins}` : 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-16 bg-[#061a33] text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Invite Your Network?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Start referring talented peers today and accumulate coins that unlock exclusive platform perks and priority matching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              {copied ? 'Link Copied to Clipboard!' : 'Copy My Referral Link'}
            </button>
            <button
              type="button"
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Learn More About Rewards
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
