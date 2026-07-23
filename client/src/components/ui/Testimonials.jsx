import React, { useRef } from "react";
import { motion } from "framer-motion";

const GoogleGLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 24 24"
        width="15"
        height="15"
        className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300 fill-stone-300'}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const topTestimonials = [
  {
    rating: 5,
    title: "Good Work & Good Communication 👍",
    body: "Good work and good communication 👍 The team at Espacio delivered our project smoothly and transparently.",
    name: "Paladugu Raju",
    role: "Local Guide • Google Reviewer",
    avatar: "/reviews/paladugu_raju.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Good Experience & Good Working Skills",
    body: "Good experience & good working skills. The team at Espacio Interiors & Modular is dedicated and skilled.",
    name: "Kishor Kumar",
    role: "Google Reviewer • 6 Reviews",
    avatar: "/reviews/kishor_kumar.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Wide Range & Patient Customer Service",
    body: "Recently visited the store they have wide range of varieties and the customer service was very good they were very patient and understanding.",
    name: "Shaik BOB",
    role: "Google Reviewer • 3 Reviews",
    avatar: "/reviews/shaik_bob.png",
    date: "10 months ago"
  },
  {
    rating: 5,
    title: "My House Became Luxurious at Reasonable Prices",
    body: "Good equipment and well staff my house is now completely become luxurious with reasonable prices and thanks to espacio.",
    name: "Lovely boy Laxman",
    role: "Homeowner • Google Reviewer",
    avatar: "/reviews/lovely_boy_laxman.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Superb Design & Flawless Execution",
    body: "Superb design variety and flawless material quality provided by Espacio Interiors & Modular.",
    name: "imtiyaz shaik",
    role: "Google Reviewer • 9 Photos",
    avatar: "/reviews/imtiyaz_shaik.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Good Experience & Excellent Service",
    body: "Good experience and excellent service provided by Espacio Interiors & Modular.",
    name: "Amresh Kumar",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/amresh_kumar.png",
    date: "3 months ago"
  }
];

const bottomTestimonials = [
  {
    rating: 5,
    title: "Good Quality Materials & Affordable Prices",
    body: "Good quality of materials and affordable prices. Great experience working with ESPACIO Interiors & Modular.",
    name: "KoteswaraRao Alaparthi",
    role: "Local Guide • 4 Reviews",
    avatar: "/reviews/koteswararao_alaparthi.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Good Work & Very Polite Team",
    body: "Good work and very polite team at Espacio Interiors & Modular. Highly recommended!",
    name: "G Rakesh",
    role: "Google Reviewer • 3 Photos",
    avatar: "/reviews/g_rakesh.png",
    date: "6 months ago"
  },
  {
    rating: 5,
    title: "Good Service & Excellent Quality Materials",
    body: "Good service and excellent quality materials offered at competitive pricing by Espacio.",
    name: "Ajayreddy Gowreddy123",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/ajayreddy_gowreddy.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Good Service Excellent Work 👍👏",
    body: "Good service excellent work 👍👏 Very happy with Espacio Interiors & Modular service quality.",
    name: "Jani Basha",
    role: "Google Reviewer • 4 Reviews",
    avatar: "/reviews/jani_basha.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Excellent Interior Materials for Home & Office",
    body: "Excellent materials for interior at home or office so pls visit this Espacio interiors and modular. Thank you...! ❤️",
    name: "Shaik Hussain",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/shaik_hussain.png",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Great Experience ❣️",
    body: "great experience ❣️ Looking forward to working with Espacio Interiors & Modular again.",
    name: "Venkatesh Mudhiraj",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/venkatesh_mudhiraj.png",
    date: "9 months ago"
  },
  {
    rating: 5,
    title: "Greate Experience & Professional Service",
    body: "Greate experience working with Espacio Interiors & Modular. Very satisfied with their team and craftsmanship.",
    name: "Rajini Kumar",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/rajini_kumar.png",
    date: "4 months ago"
  }
];

const rowA = [...topTestimonials, ...topTestimonials];
const rowB = [...bottomTestimonials, ...bottomTestimonials];

const TestimonialCard = ({ t }) => (
  <div className="w-[300px] md:w-[410px] shrink-0 bg-white rounded-2xl md:rounded-[24px] p-5 md:p-7 mx-2 md:mx-3 flex flex-col justify-between h-[230px] md:h-[260px] shadow-none md:shadow-[0_4px_25px_0_rgba(0,0,0,0.06)] border border-stone-200/80">
    <div className="space-y-3">
      {/* Star Rating & Verified Badge */}
      <div className="flex items-center justify-between">
        <StarRating rating={t.rating} />
        <div className="inline-flex items-center gap-1.5 bg-stone-100/90 border border-stone-200/60 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold text-stone-700">
          <GoogleGLogo />
          <span>Verified Review</span>
        </div>
      </div>

      <h4 className="font-editorial text-[17px] md:text-[20px] font-medium text-[#101014] leading-[1.3] m-0">
        "{t.title}"
      </h4>
      <p className="font-sans text-[12.5px] md:text-[13.5px] font-normal text-[#4a4a55] leading-[1.65] m-0">
        {t.body}
      </p>
    </div>

    <div className="flex items-center gap-3 pt-3.5 border-t border-[#f0f0f2] mt-4">
      <img src={t.avatar} alt={t.name} className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0 border-2 border-amber-400/30" />
      <div className="flex-1">
        <p className="font-sans text-[12px] md:text-[13px] font-bold text-[#101014] m-0 leading-tight">
          {t.name}
        </p>
        <p className="font-sans text-[11px] font-normal text-[#80808e] m-0 leading-tight mt-0.5">{t.role}</p>
      </div>
    </div>
  </div>
);

const MarqueeRow = ({ items, speed = 1.2, reverse = false }) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const animationFrameId = useRef(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (reverse && el.scrollLeft === 0) {
      el.scrollLeft = el.scrollWidth / 2;
    }

    const autoScroll = () => {
      if (!isDragging.current && el) {
        const halfWidth = el.scrollWidth / 2;
        if (reverse) {
          if (el.scrollLeft <= 0) {
            el.scrollLeft = halfWidth;
          } else {
            el.scrollLeft -= speed;
          }
        } else {
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft = 0;
          } else {
            el.scrollLeft += speed;
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(autoScroll);
    };

    animationFrameId.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [speed, reverse]);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftStart.current = containerRef.current.scrollLeft;
  };

  const onMouseLeaveOrUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeaveOrUp}
      onMouseUp={onMouseLeaveOrUp}
      onMouseMove={onMouseMove}
      onTouchStart={() => { isDragging.current = true; }}
      onTouchEnd={() => { isDragging.current = false; }}
      className="overflow-x-auto select-none flex w-full relative py-1 cursor-grab active:cursor-grabbing"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex w-max shrink-0">
        {items.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => (
  <section style={{ position: "relative", padding: "96px 0", overflow: "hidden" }}>

    {/* Background */}
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80" alt="bg" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(16,16,20,0.82)", backdropFilter: "blur(2px)" }} />
    </div>

    <div style={{ position: "relative", zIndex: 10 }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ textAlign: "center", marginBottom: "48px", padding: "0 24px" }}>
        
        {/* Testimonials Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "6px 16px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "24px", fontFamily: "Manrope, sans-serif" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#facc15" }} />
          Testimonials
        </div>

        <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal text-white leading-[1.12] mb-4 tracking-tight">
          Client Reviews & Ratings
        </h2>
        <p className="font-sans text-base md:text-lg font-medium text-white/90 max-w-[540px] mx-auto leading-relaxed">
          40+ Years of Experience in the Service Industry
        </p>
      </motion.div>

      {/* Row 1 — Auto-scrolls Right-to-Left */}
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <MarqueeRow items={rowA} speed={1.2} reverse={false} />
      </div>

      {/* Row 2 — Auto-scrolls Left-to-Right */}
      <div style={{ position: "relative" }}>
        <MarqueeRow items={rowB} speed={1.1} reverse={true} />
      </div>

    </div>
  </section>
);

export default Testimonials;
