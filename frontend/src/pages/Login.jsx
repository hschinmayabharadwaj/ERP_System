import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { GraduationCap, Sparkles, Shield, Users, BookOpen, Building2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

// Animated gradient background
const GradientOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    animate={{
      scale: [1, 1.2, 1],
      x: [0, 30, -30, 0],
      y: [0, -30, 30, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
)

// Floating particles
const FloatingParticle = ({ delay, size = 4 }) => (
  <motion.div
    className="absolute bg-primary/20 rounded-full"
    style={{ width: size, height: size }}
    initial={{ 
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
      opacity: 0 
    }}
    animate={{
      y: [null, -100],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeOut"
    }}
  />
)

// Feature card
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
  >
    <div className="p-2 rounded-lg bg-primary/20">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h3 className="font-medium text-white">{title}</h3>
      <p className="text-sm text-white/60">{description}</p>
    </div>
  </motion.div>
)

// Animated counter
const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  
  useEffect(() => {
    const controls = animate(count, value, { duration: 2 })
    return controls.stop
  }, [value, count])

  return <motion.span>{rounded}</motion.span>
}

export default function Login() {
  const navigate = useNavigate()
  const { loginWithGoogle, isAuthenticated, isLoading, error } = useAuth()
  const containerRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential)
    if (result.success) {
      navigate('/', { replace: true })
    }
  }

  const onGoogleError = () => {
    console.error('Google Sign-In failed')
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex bg-[#0a0a0f] overflow-hidden relative"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <GradientOrb className="w-[600px] h-[600px] bg-violet-600 -top-40 -left-40" />
        <GradientOrb className="w-[500px] h-[500px] bg-blue-600 top-1/2 -right-40" delay={2} />
        <GradientOrb className="w-[400px] h-[400px] bg-emerald-600 -bottom-40 left-1/3" delay={4} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.3} size={Math.random() * 4 + 2} />
        ))}
      </div>

      {/* Left side - Branding & Features */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-xl shadow-violet-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <GraduationCap className="w-9 h-9 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white">ERP System</h1>
              <p className="text-white/60">Educational Management Platform</p>
            </div>
          </div>

          {/* Tagline */}
          <motion.h2 
            className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Manage your institution
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              with intelligence
            </span>
          </motion.h2>

          <motion.p 
            className="text-lg text-white/60 mb-10 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            A comprehensive platform for admissions, fees, hostel management, 
            and analytics. Everything you need in one place.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex gap-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { value: 5000, label: 'Students', suffix: '+' },
              { value: 98, label: 'Satisfaction', suffix: '%' },
              { value: 50, label: 'Institutions', suffix: '+' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white">
                  <AnimatedNumber value={stat.value} />{stat.suffix}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features */}
          <div className="grid gap-3 max-w-md">
            <FeatureCard 
              icon={Users} 
              title="Student Management" 
              description="Complete student lifecycle management"
              delay={0.5}
            />
            <FeatureCard 
              icon={BookOpen} 
              title="Fee & Payments" 
              description="Automated fee collection and tracking"
              delay={0.6}
            />
            <FeatureCard 
              icon={Building2} 
              title="Hostel System" 
              description="Room allocation and occupancy management"
              delay={0.7}
            />
          </div>
        </motion.div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Login Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-600 rounded-3xl blur-xl opacity-30" />
            
            <div className="relative bg-[#12121a]/90 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">ERP System</h1>
                  <p className="text-xs text-white/60">Education Management</p>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-4 h-4" />
                  Secure Authentication
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-white/60">Sign in to access your dashboard</p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Google Sign In Button */}
              <div className="flex justify-center mb-6">
                {isLoading ? (
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-white">Signing in...</span>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={onGoogleError}
                    useOneTap
                    shape="pill"
                    size="large"
                    theme="filled_black"
                    text="continue_with"
                    width="320"
                  />
                )}
              </div>

              {/* Security badge */}
              <motion.div 
                className="flex items-center justify-center gap-2 text-sm text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Shield className="w-4 h-4" />
                <span>Protected by Google OAuth 2.0</span>
              </motion.div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
              </div>

              {/* Info text */}
              <p className="text-center text-sm text-white/40">
                By signing in, you agree to our{' '}
                <a href="#" className="text-violet-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <motion.p 
            className="text-center text-sm text-white/30 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            © 2026 ERP System. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
