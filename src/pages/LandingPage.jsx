import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2,
  Globe,
  ChevronRight,
  Layout,
  PieChart,
  Award,
  Briefcase,
  Layers,
  Users,
  BarChart3,
  Smartphone,
  CreditCard,
  Lock,
  Settings,
  FileCheck,
  Trophy
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Steps for "How to Use" section
  const workflowSteps = [
    {
      id: 1,
      title: "Configure Policy",
      description: "Admins define incentive rules, quotas, and tiers in minutes.",
      icon: Settings,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      id: 2,
      title: "Track Sales",
      description: "Reps close deals that are automatically tracked and verified.",
      icon: TrendingUp,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
      border: "border-indigo-400/20"
    },
    {
      id: 3,
      title: "Calculate Earnings",
      description: "Our engine processes commissions instantly with 100% accuracy.",
      icon: PieChart,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20"
    },
    {
      id: 4,
      title: "Approve & Payout",
      description: "Managers approve payouts and reps get paid on time, every time.",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[130px]" />
        <motion.div
          style={{ y }}
          className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-violet-600/5 blur-[120px]"
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#020617]/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Sales Reward Engine
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['How it Works', 'Integrations', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
              </a>
            ))}
            <div className="flex items-center gap-4 border-l border-slate-800 pl-8">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 ring-1 ring-white/10"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="relative pt-36 pb-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-24 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 hover:bg-indigo-500/20 transition-colors cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 Now Live: AI-Driven Incentive Modeling
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
            >
              <span className="block text-white mb-2 drop-shadow-sm">Compensate with</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 animate-gradient-x pb-2">
                Confidence & Speed
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed"
            >
              The enterprise standard for sales incentive management. Automate complex commission structures, ensure 100% accuracy, and motivate your team in real-time.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center"
            >
              <button
                onClick={() => window.location.href = 'mailto:sales@salesrewardengine.com'}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 active:scale-95 ring-1 ring-white/10"
              >
                <span className="flex items-center gap-2">
                  Schedule Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
              </button>

              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 text-white rounded-xl font-semibold border border-slate-700 transition-all hover:border-slate-600 block backdrop-blur-sm shadow-lg"
              >
                How it Works
              </button>
            </motion.div>
          </div>

          {/* Hero Interface Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
            className="relative w-full max-w-6xl mx-auto mb-32 group"
          >
            {/* Main Window */}
            <div className="relative rounded-2xl bg-[#0f172a] border border-slate-700/50 shadow-2xl overflow-hidden ring-1 ring-white/10">
              {/* Window Controls */}
              <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <div className="ml-4 px-3 py-1 bg-slate-800 rounded-md text-[10px] text-slate-500 font-mono flex items-center gap-2">
                  <Lock className="w-3 h-3" /> app.salesrewardengine.com
                </div>
              </div>

              {/* App Content */}
              <div className="p-6 md:p-8 bg-gradient-to-b from-slate-900 to-[#020617] h-[500px] md:h-[600px] flex gap-6 overflow-hidden">
                {/* Sidebar Mock */}
                <div className="hidden md:flex flex-col w-64 gap-2 pr-6 border-r border-slate-800/50">
                  <div className="h-8 w-32 bg-slate-800/50 rounded-lg mb-8 animate-pulse" />
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-10 w-full rounded-lg ${i === 1 ? 'bg-blue-600/10 border border-blue-600/20' : 'hover:bg-slate-800/30'} flex items-center px-3 gap-3`}>
                      <div className={`w-5 h-5 rounded ${i === 1 ? 'bg-blue-500' : 'bg-slate-700'}`} />
                      <div className={`h-2 w-20 rounded-full ${i === 1 ? 'bg-blue-200' : 'bg-slate-600'}`} />
                    </div>
                  ))}
                  <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                    <div className="h-2 w-full bg-slate-700 rounded-full mb-2" />
                    <div className="h-2 w-2/3 bg-slate-700 rounded-full" />
                  </div>
                </div>

                {/* Dashboard Area */}
                <div className="flex-1 flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="h-4 w-32 bg-slate-800 rounded-full mb-2" />
                      <div className="h-8 w-64 bg-slate-700/50 rounded-lg" />
                    </div>
                    <div className="flex gap-3">
                      <div className="h-9 w-24 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20" />
                      <div className="h-9 w-9 bg-slate-800 rounded-lg border border-slate-700" />
                    </div>
                  </div>

                  {/* KPI Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { l: 'Total Revenue', v: '₹1,240,500', c: 'text-emerald-400', g: '+12%' },
                      { l: 'Commission Payout', v: '₹142,300', c: 'text-blue-400', g: '+8%' },
                      { l: 'Active Deals', v: '328', c: 'text-violet-400', g: '+5%' }
                    ].map((idx, i) => (
                      <div key={i} className="h-32 rounded-xl bg-slate-800/20 border border-slate-700/50 p-5 flex flex-col justify-between hover:border-slate-600 transition-colors cursor-default group/card">
                        <div className="flex justify-between items-start">
                          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                            <div className="w-4 h-4 rounded-full bg-slate-600" />
                          </div>
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{idx.g}</span>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">{idx.l}</div>
                          <div className={`text-2xl font-bold ${idx.c} tracking-tight`}>{idx.v}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Big Chart */}
                  <div className="flex-1 rounded-xl bg-slate-800/20 border border-slate-700/50 p-6 flex items-end relative overflow-hidden group/chart">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/5 to-transparent" />
                    <div className="w-full flex justify-between items-end gap-2 h-full">
                      {[35, 55, 40, 70, 50, 85, 60, 95, 75, 55, 80, 100].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + (i * 0.05), duration: 1.2, ease: "easeOut" }}
                          className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-500 opacity-80 rounded-t-sm group-hover/chart:opacity-100 transition-opacity"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements (Visual Flair) */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-20 p-4 bg-slate-800/90 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl hidden lg:block max-w-xs z-20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Target Reached</div>
                  <div className="text-xs text-slate-400">Regional Sales Team</div>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-12 bottom-40 p-4 bg-slate-800/90 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl hidden lg:block z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500 bg-slate-900" />
                <div>
                  <div className="text-lg font-bold text-white">₹14,250.00</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Payout Approved
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Back Glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-3xl -z-10 rounded-[4rem]" />
          </motion.div>

          {/* Advanced Capabilities Strip */}
          <div className="py-12 border-y border-slate-800/50 mb-32 bg-slate-900/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: 'AI Forecasting', icon: '✨', desc: 'Predict emerging trends' },
                  { title: 'Gamification', icon: '🏆', desc: 'Boost rep engagement' },
                  { title: 'Real-time Sync', icon: '⚡', desc: 'Instant data updates' },
                  { title: 'Bank Grade', icon: '🔒', desc: 'SOC2 Type II Secure' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.8)" }}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center gap-4 cursor-default transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* "HOW IT WORKS" Section (Replaces Features) */}
          <div id="how-it-works" className="mb-32 max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-4 block"
              >
                Simple Workflow
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                From Policy to Payout in 4 Steps
              </motion.h2>
              <p className="text-slate-400 text-lg">
                See how Sales Reward Engine unifies your entire incentive lifecycle.
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden lg:block absolute top-[120px] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 z-0" />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
              >
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                    className="relative group"
                  >
                    <div className={`p-8 rounded-2xl bg-slate-900/60 backdrop-blur-sm border ${step.border} hover:bg-slate-800/60 transition-colors h-full flex flex-col items-center text-center shadow-xl`}>
                      {/* Step Number Badge */}
                      <div className="absolute top-4 right-4 text-xs font-bold text-slate-600 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                        STEP 0{step.id}
                      </div>

                      <div className={`w-20 h-20 rounded-2xl ${step.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                        <step.icon className={`w-10 h-10 ${step.color}`} />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Connection Dot (Desktop) */}
                    <div className="hidden lg:block absolute left-1/2 -top-[21px] -translate-x-1/2 w-4 h-4 bg-[#020617] border-2 border-slate-700 rounded-full z-20 group-hover:border-blue-500 group-hover:scale-125 transition-all" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Powerful Features Grid (Replaces Integrations) */}
          <div className="py-24 border-y border-slate-800/30 bg-slate-900/10 mb-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-bold text-white mb-4">Complete Visibility & Control</h3>
                <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage complex incentives at scale.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: 'Smart Auditing',
                    icon: Shield,
                    desc: 'Full traceability of every commission calculation with granular logs.',
                    color: 'text-emerald-400',
                    badge: 'Compliant'
                  },
                  {
                    title: 'Dynamic Tiers',
                    icon: BarChart3,
                    desc: 'Adjust commission rates automatically based on live performance.',
                    color: 'text-blue-400',
                    badge: 'Automated'
                  },
                  {
                    title: 'Live Leaderboards',
                    icon: Trophy,
                    desc: 'Motivate teams with real-time rankings and achievement tracking.',
                    color: 'text-amber-400',
                    badge: 'Engagement'
                  },
                  {
                    title: 'Mobile Access',
                    icon: Smartphone,
                    desc: 'Reps can check their earnings and targets from anywhere, anytime.',
                    color: 'text-violet-400',
                    badge: 'Anywhere'
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
                  >
                    <div className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700/50">
                      {feature.badge}
                    </div>

                    <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {feature.desc}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between group/link cursor-pointer">
                      <span className="text-xs font-semibold text-indigo-400 group-hover/link:text-indigo-300 transition-colors uppercase tracking-wider">
                        Explore Feature
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover/link:bg-indigo-500 group-hover/link:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4 transform group-hover/link:-rotate-45 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 max-w-7xl mx-auto text-center px-6 py-24 mb-20"
          >
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                Ready to modernize your incentive program?
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Join forward-thinking sales teams who have switched to Sales Reward Engine for transparency and speed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg shadow-xl hover:bg-blue-50 transition-colors transform hover:-translate-y-1"
                >
                  Get Started for Free
                </button>
                <button className="px-8 py-4 bg-blue-800/50 text-white border border-blue-400/30 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors">
                  Talk to Sales
                </button>
              </div>
              <p className="mt-8 text-sm text-blue-200">
                No credit card required. 14-day free trial on Pro plans.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-[#020617] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Sales Reward Engine</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                The complete solution for modern sales incentive management. Accurate, transparent, and scalable.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <span className="sr-only">{social}</span>
                    <Globe className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                {['Features', 'Integrations', 'Pricing', 'Security', 'Roadmap'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Blog', 'Contact', 'Legal'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Sales Reward Engine. All rights reserved.
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
