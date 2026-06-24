import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiLockClosed, HiMail, HiOutlineClipboardList, HiPhotograph, HiSpeakerphone, HiCog, HiLogout, HiPlus, HiTrash, HiCheck, HiAcademicCap, HiViewGrid, HiBriefcase, HiMenu, HiChevronRight } from 'react-icons/hi';
import SEO from '../components/SEO';

import { API_BASE_URL as API_BASE } from '../config';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin View state
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, hero, services, portfolio, testimonials, inquiries, settings
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data States
  const [inquiries, setInquiries] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({
    company_name: '', email: '', phone: '', address: '',
    social_links: { facebook: '', instagram: '', whatsapp: '' },
    seo_settings: { metaTitle: '', metaDescription: '', keywords: '' }
  });

  // Loading States
  const [dataLoading, setDataLoading] = useState(false);

  // Modal / Form States for CRUD
  const [crudModal, setCrudModal] = useState(null); // 'add' or 'edit' or null
  const [activeItem, setActiveItem] = useState(null); // Item being edited/deleted
  const [uploadFile, setUploadFile] = useState(null);

  // Form states for items
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', cta_text: 'Get Quote', cta_link: '/contact', order: 0, image_url: '' });
  const [serviceForm, setServiceForm] = useState({ category: 'Graphic Design', name: '', description: '', benefits: '', image_url: '' });
  const [portfolioForm, setPortfolioForm] = useState({ category: 'Wedding Cards', title: '', description: '', image_url: '', is_international: 0 });
  const [testimonialForm, setTestimonialForm] = useState({ client_name: '', review: '', image_url: '' });

  // Axios Authorization Header config
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Verify token on load
  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE}/auth/verify`, axiosConfig)
        .then(res => {
          setUser(res.data.user);
        })
        .catch(err => {
          console.warn('Session expired or invalid. Logging out.');
          handleLogout();
        });
    }
  }, [token]);

  // Load view-specific data
  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token, currentView]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      if (currentView === 'dashboard') {
        const [inqRes, svcRes, portRes, testRes] = await Promise.all([
          axios.get(`${API_BASE}/inquiries`, axiosConfig),
          axios.get(`${API_BASE}/services`),
          axios.get(`${API_BASE}/portfolio`),
          axios.get(`${API_BASE}/testimonials`)
        ]);
        setInquiries(inqRes.data);
        setServices(svcRes.data);
        setPortfolio(portRes.data);
        setTestimonials(testRes.data);
      } else if (currentView === 'inquiries') {
        const res = await axios.get(`${API_BASE}/inquiries`, axiosConfig);
        setInquiries(res.data);
      } else if (currentView === 'hero') {
        const res = await axios.get(`${API_BASE}/hero`);
        setHeroSlides(res.data);
      } else if (currentView === 'services') {
        const res = await axios.get(`${API_BASE}/services`);
        setServices(res.data);
      } else if (currentView === 'portfolio') {
        const res = await axios.get(`${API_BASE}/portfolio`);
        setPortfolio(res.data);
      } else if (currentView === 'testimonials') {
        const res = await axios.get(`${API_BASE}/testimonials`);
        setTestimonials(res.data);
      } else if (currentView === 'settings') {
        const res = await axios.get(`${API_BASE}/settings`);
        setSettings(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  // Auth Functions
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: loginEmail,
        password: loginPassword
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setCurrentView('dashboard');
  };

  // Inquiry actions
  const handleInquiryStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/inquiries/${id}`, { status }, axiosConfig);
      fetchData();
    } catch (err) {
      alert('Failed to update inquiry status');
    }
  };

  // CRUD actions helper for image upload
  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    const formData = new FormData();
    let endpoint = `${API_BASE}/${type}`;

    if (uploadFile) {
      formData.append('image', uploadFile);
    }

    let payload = {};
    if (type === 'hero') {
      payload = heroForm;
      if (crudModal === 'edit') endpoint += `/${activeItem.id}`;
    } else if (type === 'services') {
      payload = serviceForm;
      if (crudModal === 'edit') endpoint += `/${activeItem.id}`;
    } else if (type === 'portfolio') {
      payload = portfolioForm;
      if (crudModal === 'edit') endpoint += `/${activeItem.id}`;
    } else if (type === 'testimonials') {
      payload = testimonialForm;
      if (crudModal === 'edit') endpoint += `/${activeItem.id}`;
    }

    Object.keys(payload).forEach(key => {
      formData.append(key, payload[key]);
    });

    try {
      if (crudModal === 'add') {
        await axios.post(endpoint, formData, {
          headers: {
            ...axiosConfig.headers,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.put(endpoint, formData, {
          headers: {
            ...axiosConfig.headers,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setCrudModal(null);
      setActiveItem(null);
      setUploadFile(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing request');
    }
  };

  // Delete Action
  const handleDeleteItem = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API_BASE}/${type}/${id}`, axiosConfig);
      fetchData();
    } catch (err) {
      alert('Error deleting item');
    }
  };

  // Settings Save
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (uploadFile) {
      formData.append('logo', uploadFile);
    }
    formData.append('company_name', settings.company_name);
    formData.append('email', settings.email);
    formData.append('phone', settings.phone);
    formData.append('address', settings.address);
    formData.append('social_links', JSON.stringify(settings.social_links));
    formData.append('seo_settings', JSON.stringify(settings.seo_settings));

    try {
      await axios.put(`${API_BASE}/settings`, formData, {
        headers: {
          ...axiosConfig.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Settings updated successfully!');
      setUploadFile(null);
      fetchData();
    } catch (err) {
      alert('Failed to update website settings');
    }
  };

  // If NOT Logged In, Render Login Page
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
        <SEO title="Admin Login" description="Admin authentication console panel login." />
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-brand-red/10 shadow-2xl space-y-6">
          
          {/* Logo Mark */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-red/20">
              <span className="font-poppins font-extrabold text-2xl text-brand-cream">AG</span>
            </div>
            <h2 className="font-poppins font-extrabold text-2xl text-brand-charcoal mt-4">
              Akshar Graphics Admin
            </h2>
            <p className="text-xs text-brand-charcoal/50 uppercase tracking-widest font-semibold">Authorized Access Only</p>
          </div>

          {loginError && (
            <div className="bg-brand-red/10 border-l-4 border-brand-red text-brand-red p-3 rounded-lg text-xs font-semibold text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-charcoal/40">
                  <HiMail size={18} />
                </span>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-charcoal/10 bg-brand-grey focus:outline-none focus:border-brand-red focus:bg-white text-sm"
                  placeholder="admin@akshargraphics.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-brand-charcoal/40">
                  <HiLockClosed size={18} />
                </span>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-charcoal/10 bg-brand-grey focus:outline-none focus:border-brand-red focus:bg-white text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-brand-red hover:bg-brand-deepRed disabled:bg-brand-red/50 text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase py-4 rounded-xl shadow-xl shadow-brand-red/20 transition-all duration-200"
            >
              {loginLoading ? 'Signing In...' : 'Verify & Enter'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Dashboard Sidebar Layout
  return (
    <div className="min-h-screen bg-brand-grey flex flex-col md:flex-row text-left font-sans">
      <SEO title="Admin Console" description="Site management console dashboard." />

      {/* Admin Sidebar Navigation */}
      <aside className={`bg-brand-charcoal text-white shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col justify-between py-8 border-r border-white/5`}>
        <div className="space-y-8">
          
          {/* Logo Brand Header */}
          <div className="px-6 flex items-center justify-between">
            {sidebarOpen && (
              <span className="font-poppins font-extrabold text-lg text-white tracking-widest uppercase">
                Console <span className="text-brand-red">AG</span>
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded bg-white/5 hover:bg-brand-red hover:text-white transition-colors"
            >
              <HiMenu size={18} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col space-y-1">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: <HiViewGrid size={20} /> },
              { id: 'hero', name: 'Hero Slides', icon: <HiPhotograph size={20} /> },
              { id: 'services', name: 'Services', icon: <HiBriefcase size={20} /> },
              { id: 'portfolio', name: 'Portfolio', icon: <HiPhotograph size={20} /> },
              { id: 'testimonials', name: 'Testimonials', icon: <HiSpeakerphone size={20} /> },
              { id: 'inquiries', name: 'Inquiries', icon: <HiOutlineClipboardList size={20} /> },
              { id: 'settings', name: 'Settings', icon: <HiCog size={20} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center px-6 py-4 space-x-4 text-sm font-semibold tracking-wide transition-all duration-200 ${
                  currentView === item.id 
                    ? 'border-l-4 border-brand-red bg-brand-red/10 text-brand-cream' 
                    : 'border-l-4 border-transparent text-brand-grey/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-4 space-x-4 text-sm font-semibold text-brand-red/80 hover:text-brand-red hover:bg-brand-red/5 rounded-xl transition-all duration-200"
          >
            <HiLogout size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Console Workspace */}
      <main className="flex-grow p-8 md:p-12 overflow-x-auto">
        {dataLoading ? (
          <div className="text-center py-20 font-poppins font-semibold text-brand-charcoal/50">
            Loading registry logs...
          </div>
        ) : (
          <>
            {/* VIEW 1: DASHBOARD OVERVIEW */}
            {currentView === 'dashboard' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">Console Dashboard</h2>
                  <p className="text-sm text-brand-charcoal/50">Overview of Akshar Graphics live website metrics.</p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'New Inquiries', val: inquiries.filter(i => i.status === 'New').length, desc: 'Requires followup call', color: 'border-brand-red text-brand-red' },
                    { title: 'Total Services', val: services.length, desc: 'Active services list', color: 'border-brand-charcoal text-brand-charcoal' },
                    { title: 'Portfolio Works', val: portfolio.length, desc: 'Showcase designs', color: 'border-brand-charcoal text-brand-charcoal' },
                    { title: 'Reviews', val: testimonials.length, desc: 'Client reviews live', color: 'border-brand-charcoal text-brand-charcoal' }
                  ].map((card, idx) => (
                    <div key={idx} className={`bg-white p-6 rounded-2xl border-l-4 ${card.color} shadow-sm shadow-brand-charcoal/5`}>
                      <span className="text-xs font-poppins font-bold uppercase tracking-wider text-brand-charcoal/50">{card.title}</span>
                      <span className="block text-3xl font-poppins font-extrabold mt-1">{card.val}</span>
                      <span className="text-xs text-brand-charcoal/60 mt-1 block">{card.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Recent Inquiries List */}
                <div className="bg-white rounded-3xl p-6 border border-brand-red/5 shadow-md shadow-brand-charcoal/5">
                  <h3 className="font-poppins font-extrabold text-xl text-brand-charcoal mb-4">Recent Inquiries</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-brand-charcoal/10 text-brand-charcoal/50 uppercase text-[10px] font-poppins font-bold">
                          <th className="pb-3 text-left">Client</th>
                          <th className="pb-3 text-left">Phone</th>
                          <th className="pb-3 text-left">Service Required</th>
                          <th className="pb-3 text-left">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.slice(0, 5).map(inq => (
                          <tr key={inq.id} className="border-b border-brand-charcoal/5 last:border-0 hover:bg-brand-grey/30">
                            <td className="py-3 font-semibold">{inq.name}</td>
                            <td className="py-3">{inq.phone}</td>
                            <td className="py-3 font-medium text-brand-red">{inq.service}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                inq.status === 'New' ? 'bg-red-100 text-red-700' :
                                inq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {inq.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button onClick={() => setCurrentView('inquiries')} className="text-xs text-brand-charcoal hover:underline">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                        {inquiries.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-brand-charcoal/40 font-medium">No inquiries received yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: HERO SLIDES CRUD */}
            {currentView === 'hero' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">Hero Slider</h2>
                    <p className="text-sm text-brand-charcoal/50">Manage homepage background sliders.</p>
                  </div>
                  <button
                    onClick={() => {
                      setHeroForm({ title: '', subtitle: '', cta_text: 'Get Quote', cta_link: '/contact', order: 0, image_url: '' });
                      setCrudModal('add');
                    }}
                    className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg flex items-center space-x-2"
                  >
                    <HiPlus size={16} />
                    <span>Add Slide</span>
                  </button>
                </div>

                {/* Slides Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heroSlides.map(slide => (
                    <div key={slide.id} className="bg-white rounded-2xl overflow-hidden shadow-md border border-brand-red/5 flex flex-col justify-between">
                      <div className="h-44 relative bg-brand-charcoal">
                        <img
                          src={slide.image_url.startsWith('/') ? `${API_BASE.replace('/api', '')}${slide.image_url}` : slide.image_url}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-4 left-4 bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded">
                          Order: {slide.order}
                        </span>
                      </div>
                      <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-poppins font-bold text-lg text-brand-charcoal">{slide.title}</h4>
                          <p className="text-xs text-brand-charcoal/60 leading-relaxed font-sans">{slide.subtitle}</p>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-brand-grey">
                          <button
                            onClick={() => {
                              setHeroForm(slide);
                              setActiveItem(slide);
                              setCrudModal('edit');
                            }}
                            className="text-xs text-brand-charcoal hover:underline font-bold"
                          >
                            Edit Slide
                          </button>
                          <button
                            onClick={() => handleDeleteItem(slide.id, 'hero')}
                            className="text-xs text-brand-red hover:underline font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Modal */}
                {crudModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-charcoal/50" onClick={() => setCrudModal(null)} />
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 relative z-10 shadow-2xl">
                      <h3 className="font-poppins font-extrabold text-xl mb-4">{crudModal === 'add' ? 'Add Hero Slide' : 'Edit Hero Slide'}</h3>
                      <form onSubmit={(e) => handleFormSubmit(e, 'hero')} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold mb-1">Slide Title</label>
                          <input type="text" className="w-full px-3 py-2 border rounded" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Slide Subtitle / Description</label>
                          <textarea className="w-full px-3 py-2 border rounded" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold mb-1">CTA Button Text</label>
                            <input type="text" className="w-full px-3 py-2 border rounded" value={heroForm.cta_text} onChange={e => setHeroForm({...heroForm, cta_text: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">CTA Button Link</label>
                            <input type="text" className="w-full px-3 py-2 border rounded" value={heroForm.cta_link} onChange={e => setHeroForm({...heroForm, cta_link: e.target.value})} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold mb-1">Display Order</label>
                            <input type="number" className="w-full px-3 py-2 border rounded" value={heroForm.order} onChange={e => setHeroForm({...heroForm, order: parseInt(e.target.value) || 0})} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">Image Upload</label>
                            <input type="file" className="w-full text-xs" onChange={e => setUploadFile(e.target.files[0])} required={crudModal === 'add'} />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <button type="button" className="px-4 py-2 border rounded text-xs" onClick={() => setCrudModal(null)}>Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded">Save Slide</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: SERVICES CRUD */}
            {currentView === 'services' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">Services</h2>
                    <p className="text-sm text-brand-charcoal/50">Manage dynamic service modules.</p>
                  </div>
                  <button
                    onClick={() => {
                      setServiceForm({ category: 'Graphic Design', name: '', description: '', benefits: '', image_url: '' });
                      setCrudModal('add');
                    }}
                    className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg flex items-center space-x-2"
                  >
                    <HiPlus size={16} />
                    <span>Add Service</span>
                  </button>
                </div>

                {/* Table list */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-red/5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-brand-charcoal/50 uppercase text-[10px] font-poppins font-bold">
                        <th className="pb-3 text-left">Service Name</th>
                        <th className="pb-3 text-left">Category</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(svc => (
                        <tr key={svc.id} className="border-b last:border-0 hover:bg-brand-grey/30">
                          <td className="py-3 font-semibold">{svc.name}</td>
                          <td className="py-3"><span className="bg-brand-cream border border-brand-red/20 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">{svc.category}</span></td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                // Convert benefits array back to comma-separated string for editing
                                let benefitsStr = '';
                                if (svc.benefits) {
                                  benefitsStr = Array.isArray(svc.benefits) ? svc.benefits.join(', ') : svc.benefits;
                                }
                                setServiceForm({ ...svc, benefits: benefitsStr });
                                setActiveItem(svc);
                                setCrudModal('edit');
                              }}
                              className="text-xs text-brand-charcoal hover:underline font-bold"
                            >
                              Edit
                            </button>
                            <button onClick={() => handleDeleteItem(svc.id, 'services')} className="text-xs text-brand-red hover:underline font-bold">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add/Edit Modal */}
                {crudModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-charcoal/50" onClick={() => setCrudModal(null)} />
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 relative z-10 shadow-2xl">
                      <h3 className="font-poppins font-extrabold text-xl mb-4">{crudModal === 'add' ? 'Add Service' : 'Edit Service'}</h3>
                      <form onSubmit={(e) => handleFormSubmit(e, 'services')} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold mb-1">Service Name</label>
                          <input type="text" className="w-full px-3 py-2 border rounded" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold mb-1">Category</label>
                            <select className="w-full px-3 py-2 border rounded" value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})}>
                              <option value="Graphic Design">Graphic Design</option>
                              <option value="Printing Solutions">Printing Solutions</option>
                              <option value="Wedding Printing">Wedding Printing</option>
                              <option value="Corporate Printing">Corporate Printing</option>
                              <option value="Educational Printing">Educational Printing</option>
                              <option value="Healthcare Printing">Healthcare Printing</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">Image File</label>
                            <input type="file" className="w-full text-xs" onChange={e => setUploadFile(e.target.files[0])} required={crudModal === 'add'} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Benefits (Comma-separated)</label>
                          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="High resolution, 24h delivery, Premium cardstock" value={serviceForm.benefits} onChange={e => setServiceForm({...serviceForm, benefits: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Service Description</label>
                          <textarea className="w-full px-3 py-2 border rounded" rows="3" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <button type="button" className="px-4 py-2 border rounded text-xs" onClick={() => setCrudModal(null)}>Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded">Save Service</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: PORTFOLIO CRUD */}
            {currentView === 'portfolio' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">Portfolio</h2>
                    <p className="text-sm text-brand-charcoal/50">Manage work showcase catalogs.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPortfolioForm({ category: 'Wedding Cards', title: '', description: '', image_url: '', is_international: 0 });
                      setCrudModal('add');
                    }}
                    className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg flex items-center space-x-2"
                  >
                    <HiPlus size={16} />
                    <span>Add Design</span>
                  </button>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {portfolio.map(item => (
                    <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border flex flex-col justify-between">
                      <div className="h-32 bg-brand-charcoal">
                        <img
                          src={item.image_url.startsWith('/') ? `${API_BASE.replace('/api', '')}${item.image_url}` : item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-brand-red font-bold uppercase">{item.category}</span>
                            {(item.is_international == 1 || item.is_international === true) && (
                              <span className="text-[9px] bg-brand-charcoal text-white font-extrabold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                                <span>Intl 🌍</span>
                              </span>
                            )}
                          </div>
                          <h4 className="font-poppins font-bold text-sm text-brand-charcoal truncate">{item.title}</h4>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <button
                            onClick={() => {
                              setPortfolioForm(item);
                              setActiveItem(item);
                              setCrudModal('edit');
                            }}
                            className="text-xs font-bold text-brand-charcoal hover:underline"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteItem(item.id, 'portfolio')} className="text-xs font-bold text-brand-red hover:underline">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Modal */}
                {crudModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-charcoal/50" onClick={() => setCrudModal(null)} />
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 relative z-10 shadow-2xl">
                      <h3 className="font-poppins font-extrabold text-xl mb-4">{crudModal === 'add' ? 'Add Portfolio Design' : 'Edit Portfolio Design'}</h3>
                      <form onSubmit={(e) => handleFormSubmit(e, 'portfolio')} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold mb-1">Design Title</label>
                          <input type="text" className="w-full px-3 py-2 border rounded" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold mb-1">Category</label>
                            <select className="w-full px-3 py-2 border rounded" value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value})}>
                              <option value="Wedding Cards">Wedding Cards</option>
                              <option value="Business Branding">Business Branding</option>
                              <option value="Brochures">Brochures</option>
                              <option value="Posters">Posters</option>
                              <option value="Corporate Printing">Corporate Printing</option>
                              <option value="Digital Designs">Digital Designs</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">Design Image</label>
                            <input type="file" className="w-full text-xs" onChange={e => setUploadFile(e.target.files[0])} required={crudModal === 'add'} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Short Description</label>
                          <textarea className="w-full px-3 py-2 border rounded" rows="2" value={portfolioForm.description} onChange={e => setPortfolioForm({...portfolioForm, description: e.target.value})} />
                        </div>
                        <div className="flex items-center space-x-2 pb-2">
                          <input 
                            type="checkbox" 
                            id="is_international" 
                            checked={portfolioForm.is_international == 1} 
                            onChange={e => setPortfolioForm({...portfolioForm, is_international: e.target.checked ? 1 : 0})}
                            className="rounded border-gray-300 text-brand-red focus:ring-brand-red h-4 w-4"
                          />
                          <label htmlFor="is_international" className="text-xs font-bold text-brand-charcoal select-none cursor-pointer">
                            This is an International Client Work / NRI Project 🌍
                          </label>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <button type="button" className="px-4 py-2 border rounded text-xs" onClick={() => setCrudModal(null)}>Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded">Save Item</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 5: TESTIMONIALS CRUD */}
            {currentView === 'testimonials' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">Testimonials</h2>
                    <p className="text-sm text-brand-charcoal/50">Manage customer review catalog logs.</p>
                  </div>
                  <button
                    onClick={() => {
                      setTestimonialForm({ client_name: '', review: '', image_url: '' });
                      setCrudModal('add');
                    }}
                    className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg flex items-center space-x-2"
                  >
                    <HiPlus size={16} />
                    <span>Add Review</span>
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map(item => (
                    <div key={item.id} className="bg-white rounded-xl p-6 border shadow-sm flex flex-col justify-between space-y-4">
                      <p className="text-sm italic font-serif leading-relaxed text-brand-charcoal/80">"{item.review}"</p>
                      <div className="flex justify-between items-center pt-4 border-t">
                        <h4 className="font-poppins font-bold text-sm text-brand-charcoal">{item.client_name}</h4>
                        <div className="space-x-3">
                          <button
                            onClick={() => {
                              setTestimonialForm(item);
                              setActiveItem(item);
                              setCrudModal('edit');
                            }}
                            className="text-xs text-brand-charcoal hover:underline font-bold"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteItem(item.id, 'testimonials')} className="text-xs text-brand-red hover:underline font-bold">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Modal */}
                {crudModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-charcoal/50" onClick={() => setCrudModal(null)} />
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 relative z-10 shadow-2xl">
                      <h3 className="font-poppins font-extrabold text-xl mb-4">{crudModal === 'add' ? 'Add Review' : 'Edit Review'}</h3>
                      <form onSubmit={(e) => handleFormSubmit(e, 'testimonials')} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold mb-1">Customer Name</label>
                          <input type="text" className="w-full px-3 py-2 border rounded" value={testimonialForm.client_name} onChange={e => setTestimonialForm({...testimonialForm, client_name: e.target.value})} required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Customer Photo (Optional)</label>
                          <input type="file" className="w-full text-xs" onChange={e => setUploadFile(e.target.files[0])} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Review Statement</label>
                          <textarea className="w-full px-3 py-2 border rounded" rows="4" value={testimonialForm.review} onChange={e => setTestimonialForm({...testimonialForm, review: e.target.value})} required />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <button type="button" className="px-4 py-2 border rounded text-xs" onClick={() => setCrudModal(null)}>Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-brand-red text-white text-xs font-bold rounded">Save Testimonial</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 6: INQUIRIES REGISTER */}
            {currentView === 'inquiries' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">Customer Inquiries</h2>
                  <p className="text-sm text-brand-charcoal/50">Manage website lead contact logs.</p>
                </div>

                <div className="space-y-4">
                  {inquiries.map(inq => (
                    <div key={inq.id} className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-2 text-left">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-poppins font-bold text-lg text-brand-charcoal">{inq.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            inq.status === 'New' ? 'bg-red-100 text-red-700' :
                            inq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-brand-charcoal/60 font-sans">
                          Phone: <span className="font-semibold text-brand-charcoal">{inq.phone}</span> | Email: <span className="font-semibold text-brand-charcoal">{inq.email}</span>
                        </p>
                        <p className="text-xs font-medium">Service Required: <span className="text-brand-red font-semibold">{inq.service}</span></p>
                        <p className="text-sm text-brand-charcoal/80 bg-brand-grey/40 p-3 rounded-lg border leading-relaxed font-sans">{inq.message}</p>
                      </div>
                      
                      {/* Dropdown status update */}
                      <div className="shrink-0 flex flex-col items-end space-y-2">
                        <label className="block text-[10px] uppercase font-bold text-brand-charcoal/40">Status Action</label>
                        <select
                          className="px-3 py-1.5 border rounded-lg text-xs bg-white text-brand-charcoal font-semibold"
                          value={inq.status}
                          onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {inquiries.length === 0 && (
                    <p className="text-center text-brand-charcoal/40 py-12 font-medium">No inquiries received yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 7: WEBSITE SETTINGS */}
            {currentView === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-poppins font-extrabold text-brand-charcoal">Website Settings</h2>
                  <p className="text-sm text-brand-charcoal/50">Manage dynamic coordinates, social networks, and SEO tags.</p>
                </div>

                <form onSubmit={handleSettingsSubmit} className="bg-white rounded-3xl p-8 border shadow-sm space-y-6">
                  {/* Company info */}
                  <div className="space-y-4">
                    <h3 className="font-poppins font-extrabold text-base text-brand-charcoal border-b pb-2">Company Configuration</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">Company Name</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Company Logo File</label>
                        <input type="file" className="w-full text-xs" onChange={e => setUploadFile(e.target.files[0])} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">Contact Phone</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Contact Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Business Address</label>
                      <textarea className="w-full px-3 py-2 border rounded" rows="2" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} required />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="font-poppins font-extrabold text-base text-brand-charcoal border-b pb-2">Social Network Coordinates</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">Facebook URL</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" value={settings.social_links.facebook} onChange={e => setSettings({...settings, social_links: {...settings.social_links, facebook: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Instagram URL</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" value={settings.social_links.instagram} onChange={e => setSettings({...settings, social_links: {...settings.social_links, instagram: e.target.value}})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">WhatsApp Message Link</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" placeholder="https://wa.me/..." value={settings.social_links.whatsapp} onChange={e => setSettings({...settings, social_links: {...settings.social_links, whatsapp: e.target.value}})} />
                      </div>
                    </div>
                  </div>

                  {/* SEO settings */}
                  <div className="space-y-4">
                    <h3 className="font-poppins font-extrabold text-base text-brand-charcoal border-b pb-2">Default SEO Configurations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">Default Meta Title</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" value={settings.seo_settings.metaTitle} onChange={e => setSettings({...settings, seo_settings: {...settings.seo_settings, metaTitle: e.target.value}})} required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Default Meta Keywords (Comma-separated)</label>
                        <input type="text" className="w-full px-3 py-2 border rounded" value={settings.seo_settings.keywords} onChange={e => setSettings({...settings, seo_settings: {...settings.seo_settings, keywords: e.target.value}})} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Default Meta Description</label>
                      <textarea className="w-full px-3 py-2 border rounded" rows="3" value={settings.seo_settings.metaDescription} onChange={e => setSettings({...settings, seo_settings: {...settings.seo_settings, metaDescription: e.target.value}})} required />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-red hover:bg-brand-deepRed text-brand-cream font-poppins font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-xl shadow-lg shadow-brand-red/20 transition-all duration-200"
                  >
                    Save All Configurations
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
