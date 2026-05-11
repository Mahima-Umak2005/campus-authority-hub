import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const noticesList = [
    { id: 1, title: "Winter Semester Examination Schedule 2026", date: "May 15, 2026", department: "Academic", priority: "high", icon: "fas fa-chalkboard" },
    { id: 2, title: "Faculty Development Program on AI/ML", date: "May 12, 2026", department: "Training & Placement", priority: "medium", icon: "fas fa-laptop-code" },
    { id: 3, title: "Library Timings Extended During Exams", date: "May 10, 2026", department: "Library Services", priority: "low", icon: "fas fa-book" },
    { id: 4, title: "Placement Drive: TCS, Infosys & Microsoft", date: "May 08, 2026", department: "Placement Cell", priority: "high", icon: "fas fa-briefcase" },
    { id: 5, title: "Holiday Notice: College Closed on May 20", date: "May 05, 2026", department: "Administration", priority: "medium", icon: "fas fa-calendar-week" },
    { id: 6, title: "Project Expo 2026 Registrations Open", date: "May 18, 2026", department: "Innovation Hub", priority: "high", icon: "fas fa-microchip" },
    { id: 7, title: "Research Grant Proposal Call", date: "May 14, 2026", department: "R&D Cell", priority: "urgent", icon: "fas fa-flask" }
];

const documentsData = [
    { id: 1, name: "Academic_Calendar_2026-27.pdf", size: "2.4 MB", date: "May 14, 2026", type: "Calendar" },
    { id: 2, name: "Even_Sem_Timetable_2026.pdf", size: "1.8 MB", date: "May 12, 2026", type: "Examination" },
    { id: 3, name: "Fee_Structure_2026-27_Revised.pdf", size: "856 KB", date: "May 10, 2026", type: "Finance" },
    { id: 4, name: "Anti_Ragging_Committee_Report.pdf", size: "1.2 MB", date: "May 08, 2026", type: "Policy" },
    { id: 5, name: "Sports_Registration_Form_2026.pdf", size: "523 KB", date: "May 05, 2026", type: "Events" },
    { id: 6, name: "Internship_Brochure_Bajaj.pdf", size: "3.1 MB", date: "May 02, 2026", type: "Placement" },
    { id: 7, name: "Digital_Library_Resource_Guide.pdf", size: "1.5 MB", date: "Apr 28, 2026", type: "Library" },
    { id: 8, name: "Research_Grant_Proposal_Form.pdf", size: "998 KB", date: "Apr 25, 2026", type: "Research" },
    { id: 9, name: "Alumni_Meet_Registration.pdf", size: "1.1 MB", date: "Apr 22, 2026", type: "Events" }
];

const Home = () => {
    const [currentTab, setCurrentTab] = useState('notices');
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredNotices = noticesList.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDocs = documentsData.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col antialiased bg-[#f5f7fb]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            
            <style>{`
                .notice-card { transition: all 0.2s ease; border: 1px solid #eef2f8; }
                .notice-card:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.12); border-color: #cbdde9; }
                .tab-active { position: relative; color: #1e40af; font-weight: 600; }
                .tab-active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2.5px; background: #2563eb; border-radius: 2px; }
                .doc-row { transition: background 0.15s; }
                .doc-row:hover { background: #fafcff; }
                .btn-outline-icon { transition: all 0.2s; }
                .btn-outline-icon:hover { background: #f1f5f9; border-color: #94a3b8; }
                input:focus { box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); outline: none; }
            `}</style>

            {/* Header */}
            <header className={`fixed top-0 left-0 w-full z-50 transition-all border-b border-gray-200/70 ${scrolled ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                            <i className="fas fa-university text-white text-lg"></i>
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Bajaj <span className="text-blue-700">Technology</span></h1>
                            <p className="text-[11px] md:text-xs text-gray-500 font-medium">Campus Authority Hub</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <a href="#" className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition hidden sm:block"><i className="fas fa-question-circle mr-1"></i> Help</a>
                        <Link to="/login" className="text-gray-700 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition text-sm"><i className="fas fa-sign-in-alt mr-1"></i> Login</Link>
                        <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl font-semibold transition shadow-sm text-sm"><i className="fas fa-user-plus mr-1"></i> Register</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22 opacity=%220.05%22%3E%3Cpath fill=%22white%22 d=%22M40 12L8 28v24l32 16 32-16V28L40 12z%22/%3E%3C/svg%3E')] bg-repeat"></div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 text-blue-100 text-sm font-medium border border-white/20">
                        <i className="fas fa-bullhorn text-xs"></i> <span>Official Notice Portal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">Notice Board &<br /> Document Repository</h1>
                    <p className="text-blue-100/90 text-base md:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">Centralized platform for college announcements, circulars, exam schedules, and official records.</p>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-8 lg:px-10 py-10 md:py-12">
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input 
                                type="text" 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                placeholder="Search notices, documents, department or file type..." 
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-gray-50/40 text-gray-700 transition text-sm outline-none" 
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-medium transition border border-gray-200/60" onClick={() => alert("Date filtering coming soon.")}><i className="far fa-calendar-alt"></i> Date</button>
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-medium transition border border-gray-200/60" onClick={() => alert("Category filters coming soon.")}><i className="fas fa-tag"></i> Category</button>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 gap-1 mb-7">
                    <button onClick={() => setCurrentTab('notices')} className={`tab-button px-6 py-3 text-sm md:text-base font-semibold transition-all flex items-center gap-2 rounded-t-lg ${currentTab === 'notices' ? 'tab-active' : 'text-gray-600 hover:text-blue-700'}`}>
                        <i className="fas fa-newspaper"></i> College Notices
                    </button>
                    <button onClick={() => setCurrentTab('docs')} className={`tab-button px-6 py-3 text-sm md:text-base font-semibold transition-all flex items-center gap-2 rounded-t-lg ${currentTab === 'docs' ? 'tab-active' : 'text-gray-600 hover:text-blue-700'}`}>
                        <i className="fas fa-folder-open"></i> Document Repository
                    </button>
                </div>

                {currentTab === 'notices' && (
                    <div>
                        {filteredNotices.length > 0 ? (
                            <div className="space-y-4">
                                {filteredNotices.map((notice) => {
                                    let badgeClass = 'bg-gray-100 text-gray-600';
                                    let priorityBadge = 'General';
                                    if (notice.priority === 'high') { badgeClass = 'bg-red-100 text-red-700'; priorityBadge = 'Urgent'; }
                                    else if (notice.priority === 'medium') { badgeClass = 'bg-amber-100 text-amber-700'; priorityBadge = 'Important'; }
                                    else if (notice.priority === 'urgent') { badgeClass = 'bg-rose-200 text-rose-800'; priorityBadge = 'Critical'; }
                                    
                                    return (
                                        <div key={notice.id} className="notice-card bg-white rounded-xl border border-gray-200 p-5 transition-all">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl flex-shrink-0"><i className={notice.icon}></i></div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                        <h3 className="text-lg font-bold text-gray-800">{notice.title}</h3>
                                                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeClass}`}>{priorityBadge}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                                                        <span><i className="fas fa-building mr-1 text-gray-400"></i> {notice.department}</span>
                                                        <span><i className="far fa-calendar-alt mr-1 text-gray-400"></i> {notice.date}</span>
                                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition" onClick={() => alert("📄 Full notice content would appear here.")}><i className="fas fa-arrow-right mr-1"></i> View details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <i className="fas fa-inbox text-5xl text-gray-300 mb-3"></i>
                                <h3 className="text-lg font-semibold text-gray-700">No matching notices</h3>
                                <p className="text-gray-500 text-sm mt-1">Try different keywords or clear search.</p>
                            </div>
                        )}
                    </div>
                )}

                {currentTab === 'docs' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 gap-3 bg-gray-50/80 px-6 py-3.5 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-6 md:col-span-6 flex items-center gap-2"><i className="fas fa-file-alt"></i> Document Name</div>
                            <div className="col-span-3 md:col-span-3">Type</div>
                            <div className="col-span-2 md:col-span-2">Uploaded</div>
                            <div className="col-span-1 md:col-span-1 text-right">Size</div>
                        </div>
                        {filteredDocs.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredDocs.map(doc => (
                                    <div key={doc.id} className="doc-row grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-gray-50/60 transition-all">
                                        <div className="col-span-6 flex items-center gap-3 overflow-hidden">
                                            <i className="fas fa-file-pdf text-red-500 text-lg"></i>
                                            <span className="font-medium text-gray-800 truncate text-sm">{doc.name}</span>
                                        </div>
                                        <div className="col-span-3"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold"><i className="fas fa-tag text-[10px]"></i> {doc.type}</span></div>
                                        <div className="col-span-2 text-sm text-gray-500 flex items-center gap-1"><i className="far fa-calendar-alt text-gray-400"></i> {doc.date}</div>
                                        <div className="col-span-1 text-right text-sm text-gray-500 font-mono">{doc.size}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-16 text-center text-gray-500">
                                <i className="fas fa-folder-open text-3xl text-gray-300 mb-2 block"></i> No documents found.
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14">
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow transition">
                        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center"><i className="fas fa-bullhorn text-xl"></i></div>
                        <div><p className="text-2xl font-bold text-gray-800">168</p><p className="text-xs text-gray-500">Active Notices</p></div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow transition">
                        <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><i className="fas fa-database text-xl"></i></div>
                        <div><p className="text-2xl font-bold text-gray-800">2.9K</p><p className="text-xs text-gray-500">Archived Records</p></div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow transition">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center"><i className="fas fa-building text-xl"></i></div>
                        <div><p className="text-2xl font-bold text-gray-800">26</p><p className="text-xs text-gray-500">Departments</p></div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 mt-14 pt-12 pb-6 px-6 md:px-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <i className="fas fa-university text-blue-400 text-xl"></i>
                            <span className="text-white font-bold text-lg">Bajaj Technology</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">Official notice & document portal. Streamlining campus communication.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-3"><i className="fas fa-link mr-1 text-gray-400"></i> Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition">About Institute</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Contact Admin</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Student Support</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-3"><i className="fas fa-file-contract mr-1 text-gray-400"></i> Policies</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Security Guidelines</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-3"><i className="fas fa-envelope mr-1 text-gray-400"></i> Connect</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition">help@bajajtech.edu</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">+91 1800 202 6500</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">© 2026 Bajaj Technology Campus Hub — Official Notice Portal & Centralized Repository</div>
            </footer>
        </div>
    );
};

export default Home;