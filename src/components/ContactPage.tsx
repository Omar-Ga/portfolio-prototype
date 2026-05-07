import { motion, type Variants } from 'framer-motion';
import { FaInstagram, FaTiktok, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import contactHero from '../assets/contact-hero.png';

interface ContactPageProps {
  isDark: boolean;
}

const socialLinks = [
  { icon: FaInstagram, href: 'https://www.instagram.com/the_volumetric_cube/', label: 'Instagram' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/the_volumetric_cube', label: 'TikTok' },
  { icon: FaDiscord, href: '#', label: 'Discord' },
  { icon: MdEmail, href: 'mailto:Tylerdobson30@gmail.com', label: 'Email' },
];

export default function ContactPage({ isDark }: ContactPageProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className={`h-screen flex flex-col md:flex-row overflow-hidden ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
      {/* Left Side: Imagery */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="hidden md:block w-1/2 h-screen relative overflow-hidden"
      >
        <motion.img 
          src={contactHero} 
          alt="Contact Hero" 
          className="w-full h-full object-cover"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 1, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className={`absolute inset-0 backdrop-blur-[2px] pointer-events-none ${isDark ? 'mix-blend-overlay opacity-30' : 'mix-blend-multiply opacity-10'}`} />
      </motion.div>

      {/* Right Side: Contact Form */}
      <div className="w-full md:w-1/2 h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24 md:pt-32 pb-10 relative overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className={`text-4xl md:text-5xl font-black uppercase tracking-widest mb-2 font-['Outfit'] ${isDark ? 'text-white' : 'text-zinc-900'}`}
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className={`text-sm mb-12 uppercase tracking-[0.2em] font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
          >
            Let's build something exceptional together.
          </motion.p>

          <form className="space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="Alex Robertson"
                className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all font-['Outfit'] placeholder:opacity-20
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="alex@example.com"
                className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all font-['Outfit'] placeholder:opacity-20
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Project Request Name
              </label>
              <input 
                type="text" 
                placeholder="Brand Identity Redesign"
                className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all font-['Outfit'] placeholder:opacity-20
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Project Details
              </label>
              <textarea 
                rows={4}
                placeholder="Describe your vision..."
                className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all font-['Outfit'] placeholder:opacity-20 resize-none
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 mt-10
                ${isDark 
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-2xl shadow-white/5' 
                  : 'bg-zinc-900 text-white hover:bg-black shadow-2xl shadow-black/10'}`}
            >
              Send Request
            </motion.button>
          </form>

          {/* Social Icons Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 md:mt-12 flex items-center justify-center md:justify-start gap-8"
          >
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.href}
                target={social.label !== 'Email' ? "_blank" : undefined}
                rel={social.label !== 'Email' ? "noopener noreferrer" : undefined}
                className={`transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
                aria-label={social.label}
              >
                <social.icon size={22} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Ambient background effect for right side */}
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30
          ${isDark ? 'bg-zinc-600' : 'bg-zinc-200'}`} />
      </div>
    </div>
  );
}
