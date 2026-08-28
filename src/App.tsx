import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ArrowUpRight, 
  ArrowDownRight,
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { videos } from './data/videos';

// Custom Video Player that supports fallback to CDN if local files are missing
const VideoPlayer: React.FC<{
  src: string;
  fallback: string;
  poster?: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  showControls?: boolean;
  aspectRatio?: string;
  label?: string;
}> = ({
  src,
  fallback,
  poster,
  className = '',
  autoplay = true,
  muted = true,
  loop = true,
  playsInline = true,
  showControls = true,
  aspectRatio = 'aspect-video',
  label
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // If autoplay changes, update play state
    if (videoRef.current) {
      if (autoplay) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked by browser
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [autoplay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVideoError = () => {
    if (!hasError && fallback) {
      console.warn(`Local video ${src} failed to load, falling back to ${fallback}`);
      setCurrentSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-black/40 group border border-white/10 rounded-lg ${aspectRatio} ${className}`}>
      {label && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-[10px] tracking-widest text-white/80 uppercase font-medium">
          {label}
        </div>
      )}
      
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        autoPlay={autoplay}
        muted={isMuted}
        loop={loop}
        playsInline={playsInline}
        onError={handleVideoError}
        className="w-full h-full object-cover"
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={togglePlay}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button 
              onClick={toggleMute}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors cursor-pointer"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          {showControls && (
            <button 
              onClick={handleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors cursor-pointer"
              aria-label="Fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Subtle indicator of play state when overlay is hidden */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="p-4 bg-white/10 rounded-full text-white backdrop-blur-md scale-90 opacity-80">
            <Play size={24} className="ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    brand: '',
    email: '',
    website: '',
    service: 'AI Video Ads',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Testimonials configuration
  // REPLACE PLACEHOLDER TESTIMONIALS WITH REAL CLIENT REVIEWS BEFORE PUBLIC LAUNCH.
  const testimonials = [
    {
      quote: "The creative quality was much better than what we were producing in-house. The ads felt fresh and actually looked like our brand.",
      client: "Arjun Mehta",
      brand: "D2C Founder"
    },
    {
      quote: "What I liked most was how quickly they turned a simple product idea into something that felt like a real campaign.",
      client: "Priya Nair",
      brand: "Brand Founder"
    },
    {
      quote: "Adcentic understood the visual direction we wanted without making everything feel overly polished or artificial. Really happy with the work.",
      client: "Rohan Kapoor",
      brand: "E-commerce Founder"
    },
    {
      quote: "They brought a completely different perspective to our advertising. The concepts were creative, clear, and made our products look premium.",
      client: "Daniel Brooks",
      brand: "Brand Owner"
    },
    {
      quote: "The process was simple from start to finish. We gave them the product and direction, and they came back with creatives we could actually use.",
      client: "Sophie Martin",
      brand: "E-commerce Founder"
    }
  ];

  // Auto-scroll testimonials
  useEffect(() => {
    if (isTestimonialHovered) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTestimonialHovered, testimonials.length]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  // Form Submission - Connected to Web3Forms for easy email delivery
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!accessKey) {
      // Local development simulation fallback if no key is set yet
      console.warn("VITE_WEB3FORMS_KEY environment variable is not set. Simulating form submission.");
      setTimeout(() => {
        console.log('Form submission details:', formState);
        setFormLoading(false);
        setFormSubmitted(true);
      }, 1500);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          brand: formState.brand,
          email: formState.email,
          website: formState.website,
          service: formState.service,
          message: formState.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFormSubmitted(true);
      } else {
        alert("Submission failed. Please email us directly at adcenticstudio@gmail.com.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please email us directly at adcenticstudio@gmail.com.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#2563FF] selection:text-white overflow-x-hidden">
      
      {/* 1. Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-widest text-white hover:text-white/80 transition-colors">
            ADCENTIC STUDIO
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#work" className="text-sm font-medium text-[#A1A1A1] hover:text-white transition-colors">WORK</a>
            <a href="#services" className="text-sm font-medium text-[#A1A1A1] hover:text-white transition-colors">SERVICES</a>
            <a href="#about" className="text-sm font-medium text-[#A1A1A1] hover:text-white transition-colors">ABOUT</a>
            <a href="#contact" className="text-sm font-medium text-[#A1A1A1] hover:text-white transition-colors">CONTACT</a>
          </div>

          {/* Desktop CTA */}
          <a 
            href="#contact" 
            className="hidden md:flex items-center gap-1.5 px-5 py-2.5 bg-white text-black hover:bg-[#2563FF] hover:text-white transition-all duration-300 font-semibold text-xs tracking-wider rounded-md uppercase"
          >
            START A PROJECT <ArrowUpRight size={14} />
          </a>

          {/* Mobile hamburger menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-[#A1A1A1] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full bg-[#080808] border-b border-white/10 px-6 py-8 flex flex-col gap-6 md:hidden z-40"
            >
              <a 
                href="#work" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-[#A1A1A1] hover:text-white transition-colors"
              >
                WORK
              </a>
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-[#A1A1A1] hover:text-white transition-colors"
              >
                SERVICES
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-[#A1A1A1] hover:text-white transition-colors"
              >
                ABOUT
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-[#A1A1A1] hover:text-white transition-colors"
              >
                CONTACT
              </a>
              <a 
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-3.5 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-md"
              >
                START A PROJECT <ArrowUpRight size={16} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#2563FF] uppercase mb-4">
              AI ADVERTISING STUDIO / D2C
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              ADS THAT STOP <br />
              THE SCROLL.
            </h1>
            <p className="text-lg md:text-xl text-[#A1A1A1] font-light max-w-xl mb-10 leading-relaxed">
              AI-powered advertising creatives built to make D2C brands stand out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#work"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black hover:bg-white/90 font-bold tracking-wide rounded-md transition-all duration-300 cursor-pointer"
              >
                VIEW OUR WORK <ArrowDownRight size={18} />
              </a>
              <a 
                href="#contact"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#080808] text-white border border-white/20 hover:border-white hover:bg-white/5 font-bold tracking-wide rounded-md transition-all duration-300 cursor-pointer"
              >
                START A PROJECT <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          {/* Hero video showcase */}
          <div className="lg:col-span-5 relative w-full">
            <VideoPlayer
              src="/videos/vid5.mp4"
              fallback="https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-makeup-40275-large.mp4"
              label="SELECTED CREATIVE"
              aspectRatio="aspect-[9/16] max-h-[600px] mx-auto w-full md:w-[340px]"
            />
          </div>
        </div>
      </section>

      {/* 3. Video Showcase (Made To Be Seen) */}
      <section id="work" className="py-24 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold tracking-widest text-[#A1A1A1] uppercase mb-3 block">
              PORTFOLIO SHOWCASE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              MADE TO BE SEEN.
            </h2>
            <p className="text-[#A1A1A1] font-light leading-relaxed">
              From product launches to scroll-stopping social ads, we turn products into creative people notice.
            </p>
          </div>

          {/* Grid layout for portfolio videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.slice(0, 4).map((video, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <VideoPlayer
                  src={video.desktop}
                  fallback={video.fallback}
                  poster={video.poster}
                  label={video.category}
                  aspectRatio="aspect-[9/16] h-[400px] w-full"
                />
                <div className="mt-1">
                  <h4 className="text-sm font-semibold tracking-wider uppercase">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-16">
            <span className="text-xs font-bold tracking-widest text-[#2563FF] uppercase mb-3 block">
              SERVICES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              WHAT WE DO
            </h2>
          </div>

          {/* Services Rows */}
          <div className="flex flex-col border-t border-white/10">
            {[
              {
                num: "01",
                title: "AI VIDEO ADS",
                desc: "Short-form video creatives built for social and paid advertising."
              },
              {
                num: "02",
                title: "PRODUCT ADS",
                desc: "Turn your product into premium advertising creative."
              },
              {
                num: "03",
                title: "UGC-STYLE ADS",
                desc: "Native-feeling creative designed for modern social platforms."
              },
              {
                num: "04",
                title: "SOCIAL CREATIVE",
                desc: "Scroll-stopping visual content for your brand's social presence."
              },
              {
                num: "05",
                title: "CREATIVE TESTING",
                desc: "Multiple hooks, concepts and variations designed to discover what works."
              }
            ].map((service, idx) => (
              <div 
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/10 px-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
                  <span className="text-sm font-mono text-[#A1A1A1]">
                    {service.num}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold tracking-wide mb-2 md:mb-0">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#A1A1A1] font-light max-w-lg mt-1">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Process Section */}
      <section className="py-24 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-bold tracking-widest text-[#A1A1A1] uppercase mb-3 block">
              OUR WORKFLOW
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              {
                num: "01",
                title: "DISCOVER",
                desc: "We understand your product, audience and goal."
              },
              {
                num: "02",
                title: "CONCEPT",
                desc: "We develop creative directions and advertising ideas."
              },
              {
                num: "03",
                title: "CREATE",
                desc: "We produce the ads using AI-assisted creative production."
              },
              {
                num: "04",
                title: "DELIVER",
                desc: "You receive polished creatives ready for social and advertising."
              }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4 border-l border-white/10 pl-6 relative">
                <span className="text-5xl font-extrabold text-[#2563FF]/80 leading-none">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold tracking-wider uppercase mt-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#A1A1A1] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Why Adcentic */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="mb-16">
            <span className="text-xs font-bold tracking-widest text-[#2563FF] uppercase mb-3 block">
              DIFFERENTIATOR
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              WHY ADCENTIC
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "FASTER",
                desc: "Explore more creative directions without traditional production limitations."
              },
              {
                title: "MORE CREATIVE",
                desc: "Build advertising concepts that go beyond standard product photography."
              },
              {
                title: "BUILT FOR ADS",
                desc: "Every creative is developed with attention, audience and advertising in mind."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col gap-4">
                <h3 className="text-lg font-bold tracking-widest uppercase text-white">
                  {item.title}
                </h3>
                <p className="text-[#A1A1A1] font-light leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-24 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#A1A1A1] uppercase mb-3 block">
                FEEDBACK
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                WHAT BRANDS SAY
              </h2>
            </div>
            
            {/* Slider controls */}
            <div className="flex items-center gap-3 mt-6 md:mt-0">
              <button 
                onClick={() => setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white cursor-pointer transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-white cursor-pointer transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Testimonials Slider */}
          <div 
            className="relative min-h-[250px] flex items-center justify-center overflow-hidden border border-white/5 bg-white/[0.01] rounded-xl p-8 md:p-16"
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
          >
            <span className="absolute top-6 left-8 text-7xl font-serif text-white/5 select-none">“</span>
            
            <div className="w-full max-w-3xl text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <p className="text-xl md:text-2xl font-light italic leading-relaxed text-white/90">
                    "{testimonials[testimonialIndex].quote}"
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-bold tracking-widest text-[#2563FF] uppercase">
                      — {testimonials[testimonialIndex].client}
                    </h4>
                    <p className="text-xs text-[#A1A1A1] tracking-wider uppercase mt-1">
                      {testimonials[testimonialIndex].brand}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    testimonialIndex === idx ? 'bg-[#2563FF] w-6' : 'bg-white/20'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. About Section */}
      <section id="about" className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold tracking-[0.2em] text-[#2563FF] uppercase mb-4">
            ABOUT ADCENTIC
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
            CREATIVE, WITHOUT <br />THE OLD LIMITS.
          </h2>
          <p className="text-lg md:text-xl text-[#A1A1A1] font-light leading-relaxed max-w-2xl mb-6">
            Adcentic Studio is an AI-first advertising creative studio helping D2C brands turn products into attention-grabbing advertising.
          </p>
          <p className="text-base text-[#A1A1A1] font-light leading-relaxed max-w-2xl">
            We combine creative direction, AI-assisted production and advertising thinking to create more concepts, faster.
          </p>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-24 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
            HAVE A PRODUCT WORTH <br />STOPPING FOR?
          </h2>
          <p className="text-lg text-[#A1A1A1] font-light max-w-xl mb-10">
            Let's turn it into an ad people remember.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#contact"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black hover:bg-[#2563FF] hover:text-white font-bold tracking-wide rounded-md transition-all duration-300 cursor-pointer uppercase text-xs"
            >
              START A PROJECT <ArrowUpRight size={16} />
            </a>
            <a 
              href="https://instagram.com/adcenticstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border border-white/10 hover:border-white font-bold tracking-wide rounded-md transition-all duration-300 cursor-pointer uppercase text-xs"
            >
              INSTAGRAM <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 10. Contact Section */}
      <section id="contact" className="py-24 border-t border-white/5 relative">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-[#2563FF] uppercase mb-3 block">
              GET IN TOUCH
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              START A PROJECT
            </h2>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-xl p-8 md:p-12">
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="p-4 bg-[#2563FF]/10 text-[#2563FF] rounded-full mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-3">INQUIRY SENT</h3>
                <p className="text-[#A1A1A1] max-w-md">
                  Thank you for reaching out. We will review your product and get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-bold tracking-wider text-[#A1A1A1] uppercase">NAME</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required
                      value={formState.name}
                      onChange={handleFormChange}
                      className="bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#2563FF] focus:outline-none transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="brand" className="text-xs font-bold tracking-wider text-[#A1A1A1] uppercase">BRAND</label>
                    <input 
                      type="text" 
                      id="brand" 
                      name="brand" 
                      required
                      value={formState.brand}
                      onChange={handleFormChange}
                      className="bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#2563FF] focus:outline-none transition-colors"
                      placeholder="Your Brand Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-bold tracking-wider text-[#A1A1A1] uppercase">EMAIL</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required
                      value={formState.email}
                      onChange={handleFormChange}
                      className="bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#2563FF] focus:outline-none transition-colors"
                      placeholder="name@email.com"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="website" className="text-xs font-bold tracking-wider text-[#A1A1A1] uppercase">WEBSITE / INSTAGRAM</label>
                    <input 
                      type="text" 
                      id="website" 
                      name="website" 
                      value={formState.website}
                      onChange={handleFormChange}
                      className="bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#2563FF] focus:outline-none transition-colors"
                      placeholder="yourbrand.com / @yourbrand"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="service" className="text-xs font-bold tracking-wider text-[#A1A1A1] uppercase">WHAT DO YOU NEED?</label>
                  <select 
                    id="service" 
                    name="service"
                    value={formState.service}
                    onChange={handleFormChange}
                    className="bg-black border border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#2563FF] focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="AI Video Ads">AI Video Ads</option>
                    <option value="Product Ads">Product Ads</option>
                    <option value="UGC-Style Ads">UGC-Style Ads</option>
                    <option value="Social Creative">Social Creative</option>
                    <option value="Creative Testing">Creative Testing</option>
                    <option value="Something Else">Something Else</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-bold tracking-wider text-[#A1A1A1] uppercase">Tell us about your product</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4}
                    required
                    value={formState.message}
                    onChange={handleFormChange}
                    className="bg-black/40 border border-white/10 rounded-md px-4 py-3 text-sm focus:border-[#2563FF] focus:outline-none transition-colors resize-none"
                    placeholder="Describe your product and advertising goals..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="mt-2 w-full py-4 bg-white text-black hover:bg-[#2563FF] hover:text-white transition-all duration-300 font-bold uppercase tracking-wider text-xs rounded-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? 'SENDING...' : 'SEND INQUIRY'} <ArrowUpRight size={16} />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 11. Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#040404]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-widest">ADCENTIC STUDIO</h2>
              <p className="text-xs text-[#A1A1A1] tracking-wider uppercase font-light">
                AI-powered advertising for D2C brands.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white">LINKS</h4>
              <div className="flex flex-col gap-2">
                <a href="#work" className="text-xs text-[#A1A1A1] hover:text-white transition-colors uppercase">WORK</a>
                <a href="#services" className="text-xs text-[#A1A1A1] hover:text-white transition-colors uppercase">SERVICES</a>
                <a href="#about" className="text-xs text-[#A1A1A1] hover:text-white transition-colors uppercase">ABOUT</a>
                <a href="#contact" className="text-xs text-[#A1A1A1] hover:text-white transition-colors uppercase">CONTACT</a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white">SOCIAL & CONTACT</h4>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://instagram.com/adcenticstudio" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-[#A1A1A1] hover:text-white transition-colors uppercase"
                >
                  INSTAGRAM
                </a>
                <a 
                  href="mailto:adcenticstudio@gmail.com" 
                  className="text-xs text-[#A1A1A1] hover:text-white transition-colors uppercase"
                >
                  adcenticstudio@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white">LEGAL</h4>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[#A1A1A1]">© 2026 ADCENTIC STUDIO</span>
              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
