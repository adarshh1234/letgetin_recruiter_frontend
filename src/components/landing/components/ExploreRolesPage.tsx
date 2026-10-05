import React, { useState } from 'react';
import { 
  Compass, 
  Home, 
  Users2, 
  CreditCard, 
  User, 
  Bell, 
  ArrowLeft, 
  Search, 
  Check, 
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface ExploreRolesPageProps {
  onBackToHome: () => void;
  onOpenDemo: () => void;
}

interface RoleCardData {
  id: string;
  title: string;
  rate: string;
  isOneClickApply?: boolean;
  statusType: 'new' | 'hired';
  hiredCount?: string;
  hiredAvatars?: { text: string; bg: string }[];
  referralBonus: string;
  category: string;
}

export const ExploreRolesPage: React.FC<ExploreRolesPageProps> = ({ onBackToHome, onOpenDemo }) => {
  const [activeTab, setActiveTab] = useState('Explore');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedRoles, setAppliedRoles] = useState<string[]>([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'All',
    'AI & Research',
    'Engineering & Systems',
    'Finance & Economics',
    'Product & Design',
    'Legal & Compliance',
    'Writing & Translation'
  ];

  const rolesData: RoleCardData[] = [
    {
      id: '1',
      title: 'B2B Sales Expert (3+ YOE, US Only)',
      rate: '$50 - $70 / hour',
      statusType: 'new',
      referralBonus: '$280',
      category: 'Product & Design',
    },
    {
      id: '2',
      title: 'Pricing / ROI / revenue economics Evaluator',
      rate: '$80 - $120 / hour',
      statusType: 'hired',
      hiredCount: '444 hired this month',
      hiredAvatars: [
        { text: 'P', bg: 'bg-rose-400' },
        { text: 'V', bg: 'bg-amber-400' },
        { text: 'N', bg: 'bg-emerald-400' }
      ],
      referralBonus: '$480',
      category: 'Finance & Economics',
    },
    {
      id: '3',
      title: "Biology Research Scientist (BA, MS, PhD's)",
      rate: '$60 - $100 / hour',
      statusType: 'hired',
      hiredCount: '655 hired this month',
      hiredAvatars: [
        { text: 'B', bg: 'bg-indigo-500' },
        { text: 'R', bg: 'bg-sky-500' },
        { text: 'S', bg: 'bg-purple-500' }
      ],
      referralBonus: '$500',
      category: 'AI & Research',
    },
    {
      id: '4',
      title: 'Legal / compliance Evaluator',
      rate: '$80 - $120 / hour',
      statusType: 'hired',
      hiredCount: '444 hired this month',
      hiredAvatars: [
        { text: 'M', bg: 'bg-orange-400' },
        { text: 'K', bg: 'bg-cyan-500' },
        { text: 'C', bg: 'bg-blue-600' }
      ],
      referralBonus: '$480',
      category: 'Legal & Compliance',
    },
    {
      id: '5',
      title: 'Medicare Advantage Member...',
      rate: '$120 / hour',
      isOneClickApply: true,
      statusType: 'hired',
      hiredCount: '325 hired this month',
      hiredAvatars: [
        { text: 'K', bg: 'bg-amber-500' },
        { text: 'F', bg: 'bg-red-400' },
        { text: 'V', bg: 'bg-blue-500' }
      ],
      referralBonus: '$480',
      category: 'Finance & Economics',
    },
    {
      id: '6',
      title: 'Audit & Controls Specialist (E...',
      rate: '$80 - $120 / hour',
      isOneClickApply: true,
      statusType: 'hired',
      hiredCount: '233 hired this month',
      hiredAvatars: [
        { text: 'A', bg: 'bg-blue-600' },
        { text: 'R', bg: 'bg-indigo-500' },
        { text: 'B', bg: 'bg-violet-600' }
      ],
      referralBonus: '$480',
      category: 'Finance & Economics',
    },
    {
      id: '7',
      title: 'Financial Crime, AML & KYC Analyst',
      rate: '$75 - $100 / hour',
      statusType: 'hired',
      hiredCount: '716 hired this month',
      hiredAvatars: [
        { text: 'I', bg: 'bg-yellow-400' },
        { text: 'F', bg: 'bg-blue-500' },
        { text: 'A', bg: 'bg-emerald-500' }
      ],
      referralBonus: '$400',
      category: 'Finance & Economics',
    },
    {
      id: '8',
      title: 'Technical Accounting & SEC ...',
      rate: '$80 - $120 / hour',
      isOneClickApply: true,
      statusType: 'hired',
      hiredCount: '299 hired this month',
      hiredAvatars: [
        { text: 'T', bg: 'bg-amber-500' },
        { text: 'F', bg: 'bg-indigo-500' },
        { text: 'P', bg: 'bg-rose-500' }
      ],
      referralBonus: '$480',
      category: 'Finance & Economics',
    },
    {
      id: '9',
      title: 'Compliance / regulatory response with finan...',
      rate: '$80 - $120 / hour',
      statusType: 'hired',
      hiredCount: '118 hired this month',
      hiredAvatars: [
        { text: 'P', bg: 'bg-purple-600' },
        { text: 'A', bg: 'bg-blue-500' },
        { text: 'P', bg: 'bg-indigo-600' }
      ],
      referralBonus: '$480',
      category: 'Legal & Compliance',
    },
    {
      id: '10',
      title: 'Corporate / Controllership Ac...',
      rate: '$80 - $120 / hour',
      isOneClickApply: true,
      statusType: 'hired',
      hiredCount: '200 hired this month',
      hiredAvatars: [
        { text: 'C', bg: 'bg-rose-400' },
        { text: 'R', bg: 'bg-amber-500' },
        { text: 'I', bg: 'bg-orange-400' }
      ],
      referralBonus: '$480',
      category: 'Finance & Economics',
    },
    {
      id: '11',
      title: 'Bilingual Writer - Thai (Thailand)',
      rate: '$12.6 / task',
      statusType: 'new',
      referralBonus: '$250',
      category: 'Writing & Translation',
    },
    {
      id: '12',
      title: 'Bilingual Writer - Portuguese (Brazil)',
      rate: '$12.6 / task',
      statusType: 'new',
      referralBonus: '$250',
      category: 'Writing & Translation',
    },
    {
      id: '13',
      title: 'Bilingual Writer - Korean (South Korea)',
      rate: '$18 / hour',
      statusType: 'new',
      referralBonus: '$100',
      category: 'Writing & Translation',
    },
    {
      id: '14',
      title: 'Bilingual Writer - Japanese (Japan)',
      rate: '$18 / task',
      statusType: 'new',
      referralBonus: '$250',
      category: 'Writing & Translation',
    },
    {
      id: '15',
      title: 'Bilingual Writer - Italian (Italy)',
      rate: '$15.75 / task',
      statusType: 'new',
      referralBonus: '$250',
      category: 'Writing & Translation',
    },
    {
      id: '16',
      title: 'Bilingual Writer - Mandarin Chinese (Traditio...',
      rate: '$18 / task',
      statusType: 'new',
      referralBonus: '$250',
      category: 'Writing & Translation',
    }
  ];

  const filteredRoles = rolesData.filter((role) => {
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          role.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApply = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!appliedRoles.includes(id)) {
      setAppliedRoles([...appliedRoles, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased">
      
      {/* 1. LEFT SIDEBAR (Matching reference image) */}
      <aside className="w-16 sm:w-20 bg-white border-r border-slate-200/80 flex flex-col justify-between items-center py-6 fixed top-0 bottom-0 left-0 z-40">
        
        {/* Brand Logo icon */}
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={onBackToHome}
            className="w-10 h-10 rounded-2xl bg-[#063970] text-white flex items-center justify-center font-extrabold text-lg shadow-sm hover:opacity-90 transition-all cursor-pointer"
            title="Return to LetGetIn Home"
          >
            <span className="font-display">L</span>
          </button>

          {/* Navigation Items from reference image */}
          <nav className="flex flex-col items-center gap-4 mt-2">
            
            <button
              onClick={() => setActiveTab('Explore')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'Explore'
                  ? 'text-[#0066cc] bg-sky-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Explore</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('Home');
                onBackToHome();
              }}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'Home'
                  ? 'text-[#0066cc] bg-sky-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('Referrals')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'Referrals'
                  ? 'text-[#0066cc] bg-sky-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users2 className="w-5 h-5" />
              <span className="text-[10px] font-medium">Referrals</span>
            </button>

            <button
              onClick={() => setActiveTab('Earnings')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'Earnings'
                  ? 'text-[#0066cc] bg-sky-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-[10px] font-medium">Earnings</span>
            </button>

            <button
              onClick={() => setActiveTab('Profile')}
              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'Profile'
                  ? 'text-[#0066cc] bg-sky-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium">Profile</span>
            </button>

          </nav>
        </div>

        {/* Bottom Avatar and Notifications */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <button className="p-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 border-2 border-white" />
          </div>

          <div className="w-8 h-8 rounded-lg bg-amber-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            A
          </div>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 pl-16 sm:pl-20 flex flex-col min-h-screen">
        
        {/* Top Referral Notification Bar (Matching Screenshot) */}
        {!bannerDismissed && (
          <div className="bg-white border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">☼</span>
              <span>You've already been referred by <strong className="text-slate-900 font-semibold">Bùi Thị Minh Lý</strong></span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setBannerDismissed(true)}
                className="text-slate-500 hover:text-slate-800 transition-colors"
              >
                I don't know Bùi Thị Minh Lý
              </button>
              <button 
                onClick={() => setBannerDismissed(true)}
                className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                <span>Dismiss</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Top Search & Filter Header Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-10 py-4 sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#063970] hover:bg-sky-50 border border-slate-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="relative w-72 sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 8.2k+ active opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-900 font-bold">{filteredRoles.length}</strong> roles
            </span>
            <button
              onClick={onOpenDemo}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all"
            >
              Get In — Free
            </button>
          </div>
        </header>

        {/* Category Pills */}
        <div className="px-6 sm:px-10 py-4 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#063970] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. ROLES GRID (4 COLUMNS MATCHING EXACT SCREENSHOT) */}
        <main className="flex-1 px-6 sm:px-10 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRoles.map((role) => {
              const isApplied = appliedRoles.includes(role.id);

              return (
                <div
                  key={role.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-sky-300 hover:shadow-sm transition-all group"
                >
                  {/* Top section */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0066cc] transition-colors">
                        {role.title}
                      </h3>
                      {role.isOneClickApply && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md shrink-0">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span>1-click apply</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-medium text-slate-600 mb-6">
                      {role.rate}
                    </div>
                  </div>

                  {/* Bottom info row */}
                  <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs">
                    
                    {/* Left status: avatars or purple new opportunity */}
                    <div className="flex items-center gap-1.5">
                      {role.statusType === 'new' ? (
                        <div className="flex items-center gap-1.5 text-[#6366f1] font-medium text-[11px]">
                          <div className="w-4 h-4 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-[10px] font-bold">
                            +
                          </div>
                          <span>New opportunity</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {role.hiredAvatars?.map((av, idx) => (
                              <div
                                key={idx}
                                className={`inline-block h-4 w-4 rounded-full text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white ${av.bg}`}
                              >
                                {av.text}
                              </div>
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[90px]">
                            {role.hiredCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right referral reward */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 font-mono flex items-center">
                        <span className="text-slate-400 mr-0.5 text-[10px]">&</span> {role.referralBonus}
                      </span>

                      {/* Quick Apply Button on hover or state */}
                      <button
                        onClick={(e) => handleApply(role.id, e)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-all ${
                          isApplied
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-sky-50 text-[#0066cc] hover:bg-sky-100'
                        }`}
                      >
                        {isApplied ? 'Applied ✓' : 'Apply'}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. PAGINATION (Matching Screenshot) */}
          <div className="mt-12 mb-6 flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-[#063970] text-white shadow-xs'
                    : 'border border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-1 text-slate-400">...</span>

            {[24, 25].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-[#063970] text-white shadow-xs'
                    : 'border border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(Math.min(25, currentPage + 1))}
              disabled={currentPage === 25}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>

      </div>

    </div>
  );
};
