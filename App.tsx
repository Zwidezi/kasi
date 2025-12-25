
import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, Truck, BarChart3, LayoutDashboard, History, ShieldAlert, 
  Menu, X, PlusCircle, Clock, CheckCircle2, TrendingUp, DollarSign, 
  Users, AlertTriangle, MapPin, Store, Navigation, MessageSquare, 
  Send, Download, ShieldCheck, Zap, Camera, ScanLine, ArrowRight, UserPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import TownshipMap from './components/TownshipMap';
import LandmarkInput from './components/LandmarkInput';
import { UserRole, Landmark, Incident, Delivery } from './types';
import { MOCK_LANDMARKS, MOCK_INCIDENTS, COLORS } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('kasi-role');
    return saved ? (saved as UserRole) : null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [activeRouteText, setActiveRouteText] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('kasi-deliveries');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'd1', title: 'Bulk Meal-Meal', from: 'Township Plaza', to: 'Ma-Zulu Shop', status: 'in-transit', fee: 45, landmarkDescription: 'Yellow Spaza', pickupCoords: {x: 200, y: 400}, dropoffCoords: {x: 450, y: 300} },
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('kasi-deliveries', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    if (role) localStorage.setItem('kasi-role', role);
  }, [role]);

  useEffect(() => {
    const checkSafety = async () => {
      const warning = await geminiService.assessRouteSafety(MOCK_INCIDENTS);
      setSafetyAlert(warning);
    };
    checkSafety();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleLandmarkClick = (item: any) => {
    if ('category' in item) {
      setSelectedLandmark(item);
    } else {
      setSafetyAlert(`URGENT: ${item.description}`);
    }
  };

  const handleMapClick = (coords: { x: number; y: number }) => {
    const newLandmark: Landmark = {
      id: `custom-${Date.now()}`,
      name: "New Pin Location",
      description: "Custom point selected on map. Ready for AI parsing.",
      category: 'other',
      coordinates: coords
    };
    setSelectedLandmark(newLandmark);
  };

  const generateRoute = async (delivery: Delivery) => {
    setIsRouting(true);
    const text = await geminiService.generateLandmarkRoute(delivery.from, delivery.landmarkDescription);
    setActiveRouteText(text);
    setIsRouting(false);
  };

  const createDelivery = (parsedData: any) => {
    const newDelivery: Delivery = {
      id: `d-${Date.now()}`,
      title: `${parsedData.mainLandmark} Order`,
      from: 'Nearby Hub',
      to: parsedData.mainLandmark,
      status: 'pending',
      fee: 35,
      landmarkDescription: `${parsedData.spatialRelation} ${parsedData.mainLandmark}`,
      pickupCoords: { x: 500, y: 400 },
      dropoffCoords: selectedLandmark?.coordinates || { x: 450, y: 300 }
    };
    setDeliveries(prev => [newDelivery, ...prev]);
    setSelectedLandmark(null);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setIsBotTyping(true);
    const response = await geminiService.getSupportResponse(userMsg);
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsBotTyping(false);
  };

  // Onboarding Screen
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-orange-500 p-6 rounded-3xl shadow-2xl mb-8 animate-bounce">
          <Package size={64} />
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-4">Kasi-Nav</h1>
        <p className="text-slate-400 max-w-sm mb-12 text-lg leading-relaxed">
          Logistics for the people. Landmark-based delivery for areas where GPS fails.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { id: UserRole.CONSUMER, title: "I want to Send", desc: "Get anything delivered using local landmarks.", icon: UserPlus, color: "bg-white text-slate-900" },
            { id: UserRole.COURIER, title: "I want to Earn", desc: "Join our trolley-pusher network and start gigs.", icon: Truck, color: "bg-orange-500 text-white" },
            { id: UserRole.BUSINESS, title: "Business Data", desc: "Licensing landmark data for retailers.", icon: BarChart3, color: "bg-blue-600 text-white" }
          ].map((opt) => (
            <button 
              key={opt.id}
              onClick={() => setRole(opt.id)}
              className={`${opt.color} p-8 rounded-3xl text-left transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between h-64 border border-white/10`}
            >
              <opt.icon size={32} />
              <div>
                <h3 className="text-xl font-extrabold mb-1">{opt.title}</h3>
                <p className="text-xs opacity-70 leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="mt-12 text-slate-500 text-sm">Powered by Gemini AI Addressing System</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-sans selection:bg-orange-100">
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-slate-50 border-r border-slate-200 z-50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 flex flex-col
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2.5 rounded-2xl text-white shadow-xl shadow-orange-200">
              <Package size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-800">Kasi-Nav</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          <p className="text-[10px] uppercase font-black text-slate-400 px-4 mb-4 tracking-widest">Navigation</p>
          {[
            { id: UserRole.CONSUMER, label: 'Marketplace', icon: LayoutDashboard },
            { id: UserRole.COURIER, label: 'Earning Center', icon: Truck },
            { id: UserRole.BUSINESS, label: 'Enterprise Hub', icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setRole(item.id); setIsSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all
                ${role === item.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-100'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => { setRole(null); localStorage.removeItem('kasi-role'); }}
            className="w-full flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Switch Role <X size={14} />
          </button>
        </div>
      </aside>

      {/* Main App Window */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={24}/></button>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {role === UserRole.CONSUMER && 'Deliver Anything'}
                  {role === UserRole.COURIER && 'Start Earning Today'}
                  {role === UserRole.BUSINESS && 'Retail Insights'}
                </h2>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Active: 1,240 Couriers</p>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">My Kasi-Wallet</span>
                <span className="text-xl font-black text-slate-900">R 1,240.50</span>
             </div>
             <button className="bg-slate-900 p-4 rounded-2xl text-white shadow-2xl hover:bg-slate-800 transition-all hover:scale-105">
               <PlusCircle size={24} />
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-8 overflow-hidden">
          
          <div className="flex-1 flex flex-col gap-8 overflow-hidden">
            {/* Safety Ticker */}
            {safetyAlert && (
              <div className="bg-red-50 border border-red-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm animate-in slide-in-from-top duration-700">
                <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-200">
                  <AlertTriangle size={24} />
                </div>
                <p className="text-red-800 text-sm font-extrabold leading-tight italic">"{safetyAlert}"</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-8 pb-12">
              {role === UserRole.CONSUMER && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-900">New Order</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dropoff Hub (Safe point)</label>
                        <select className="w-full p-4 rounded-2xl bg-slate-50 border-none text-sm font-bold focus:ring-4 focus:ring-orange-100 outline-none">
                          {MOCK_LANDMARKS.filter(l => (l as any).isHub).map(hub => (
                            <option key={hub.id}>{hub.name} Hub</option>
                          ))}
                        </select>
                      </div>
                      <LandmarkInput onParsed={createDelivery} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      <Clock size={20} className="text-orange-500" /> Active Tracking
                    </h3>
                    {deliveries.map(d => (
                      <div key={d.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-200 group hover:border-orange-500 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="p-4 bg-white rounded-2xl text-orange-500 shadow-sm">
                             <Package size={28}/>
                           </div>
                           <div className="flex-1">
                              <h4 className="font-black text-slate-900">{d.title}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.status}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-slate-900">R{d.fee}</p>
                           </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">En route via Courier Thabo</span>
                           </div>
                           <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest">View Path</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {role === UserRole.COURIER && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { label: "Today", value: "R245", color: "text-green-600" },
                       { label: "Trips", value: "08", color: "text-slate-900" },
                       { label: "Trust", value: "98%", color: "text-blue-600" },
                       { label: "Status", value: "Vetted", color: "text-orange-500" }
                     ].map((s, i) => (
                       <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                       </div>
                     ))}
                  </div>

                  {/* Gig List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-black flex items-center gap-2">
                      <Zap size={20} className="text-orange-500" /> Nearby Jobs
                    </h3>
                    <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {[
                        { title: "Medication Drop", from: "Section B Clinic", to: "Blue House #4", fee: 40, landmark: "Near Red Gate" },
                        { title: "Maize Bag 25kg", from: "Ma-Zulu Shop", to: "Hub #21", fee: 25, landmark: "Behind Church" }
                      ].map((gig, i) => (
                        <div key={i} className="p-8 flex items-center gap-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                           <div className="p-5 bg-slate-100 rounded-3xl text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                             <ScanLine size={32} />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-black text-lg">{gig.title}</h4>
                              <p className="text-sm text-slate-500 font-bold mb-1">Target: {gig.landmark}</p>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black px-2 py-1 bg-slate-900 text-white rounded-md tracking-widest">TROLLEY NEEDED</span>
                                 <span className="text-[10px] font-bold text-slate-400">1.2km away</span>
                              </div>
                           </div>
                           <div className="text-right flex flex-col items-end gap-3">
                              <p className="text-2xl font-black">R{gig.fee}</p>
                              <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-xl">Accept Gig</button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Side */}
          <div className="w-full lg:w-[450px] xl:w-[600px] flex flex-col gap-8 shrink-0">
             <div className="flex-1 relative">
                <TownshipMap 
                  landmarks={MOCK_LANDMARKS}
                  incidents={MOCK_INCIDENTS}
                  activeDelivery={deliveries[0]}
                  onPinClick={handleLandmarkClick}
                  onMapClick={handleMapClick}
                  isOffline={isOffline}
                />
             </div>

             {/* Detail Panel */}
             <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                
                {selectedLandmark ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-white/10 rounded-2xl text-orange-500">
                          <Store size={28} />
                        </div>
                        <div>
                           <h4 className="text-xl font-black tracking-tight">{selectedLandmark.name}</h4>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedLandmark.category} Landmark</p>
                        </div>
                     </div>
                     <p className="text-sm text-slate-300 leading-relaxed mb-8">"{selectedLandmark.description}"</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            if (role === UserRole.CONSUMER) createDelivery({mainLandmark: selectedLandmark.name, spatialRelation: 'Next to'});
                          }}
                          className="flex items-center justify-center gap-2 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all"
                        >
                          Deliver Here <ArrowRight size={14} />
                        </button>
                        <button className="flex items-center justify-center gap-2 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/5 hover:bg-white/20 transition-all">
                          Add Photo <Camera size={14} />
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-4 space-y-4">
                     <div className="p-4 bg-white/5 rounded-full text-slate-600">
                        <Navigation size={32} />
                     </div>
                     <div>
                        <p className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-1">Explorer Mode</p>
                        <p className="text-sm text-slate-400 font-bold leading-relaxed">Tap a point to verify its identity or start a shipment.</p>
                     </div>
                  </div>
                )}
             </div>
          </div>

        </div>
      </main>

      {/* Support Overlay */}
      <div className={`fixed bottom-8 right-8 z-[70] transition-all duration-500 ${showSupport ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
          <div className="w-96 h-[600px] bg-white rounded-[40px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
             <div className="bg-slate-900 p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-orange-500 p-2 rounded-xl text-white"><MessageSquare size={20}/></div>
                   <div>
                      <h4 className="text-white font-black text-sm tracking-tight">Kasi-Bot</h4>
                      <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Always Listening</p>
                   </div>
                </div>
                <button onClick={() => setShowSupport(false)}><X size={24} className="text-white/20 hover:text-white transition-colors"/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar bg-slate-50/50">
                {chatHistory.map((c, i) => (
                  <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`p-5 rounded-3xl text-sm leading-relaxed max-w-[85%] font-bold shadow-sm ${c.role === 'user' ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                        {c.text}
                     </div>
                  </div>
                ))}
                {isBotTyping && <div className="animate-pulse flex gap-2"><div className="w-2 h-2 rounded-full bg-slate-300"></div><div className="w-2 h-2 rounded-full bg-slate-300"></div></div>}
                <div ref={chatEndRef} />
             </div>
             <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask for directions..." 
                  className="flex-1 bg-slate-50 p-4 rounded-2xl text-sm font-bold border border-slate-100 outline-none focus:border-orange-500 transition-all" 
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-4 bg-orange-500 text-white rounded-2xl shadow-xl hover:bg-orange-600 active:scale-95 transition-all"
                >
                  <Send size={20} />
                </button>
             </div>
          </div>
      </div>

      <button 
        onClick={() => setShowSupport(true)}
        className={`fixed bottom-8 right-8 p-6 bg-slate-900 text-white rounded-[32px] shadow-2xl hover:bg-orange-600 transition-all z-60 group ${showSupport ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default App;
