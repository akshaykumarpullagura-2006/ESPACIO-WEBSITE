import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowUpRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const QuoteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalMode, setModalMode] = useState('estimate'); // 'estimate' or 'catalogue'
  const [modalTitle, setModalTitle] = useState('Get Free Estimate');
  const [productContext, setProductContext] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    email: '',
    location: '',
  });

  useEffect(() => {
    // Check if user already dismissed or submitted in this session
    const isDismissed = sessionStorage.getItem('quote_modal_dismissed');
    
    // Set 1-minute timer (60,000 ms = 60 seconds)
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsOpen(true);
      }
    }, 60000);

    // Custom event listener so any button on the site can trigger the popup
    const handleCustomOpen = (e) => {
      const detail = e?.detail;
      if (detail && detail.mode === 'catalogue') {
        setModalMode('catalogue');
        setModalTitle(detail.title || 'To Unlock More Catalogs, Fill the Details');
        setProductContext(detail.productName || null);
      } else {
        setModalMode('estimate');
        setModalTitle('Get Free Estimate');
        setProductContext(null);
      }
      setIsOpen(true);
    };
    window.addEventListener('open-quote-modal', handleCustomOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-quote-modal', handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('quote_modal_dismissed', 'true');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Validate phone1 format (must be 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone1.trim().replace(/\s+/g, ''))) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate phone2 format if provided
    if (formData.phone2?.trim()) {
      if (!phoneRegex.test(formData.phone2.trim().replace(/\s+/g, ''))) {
        setErrorMsg('Please enter a valid 10-digit secondary mobile number.');
        return;
      }
    }

    setLoading(true);

    try {
      const isCatalogue = modalMode === 'catalogue';
      const response = await axios.post('/leads', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone2 ? `${formData.phone1} / ${formData.phone2}` : formData.phone1,
        location: formData.location,
        projectType: isCatalogue ? 'Catalogue Request' : 'Free Estimate Request',
        catalogueMaterial: isCatalogue ? productContext : undefined,
        message: isCatalogue 
          ? `Catalogue Material: ${productContext || 'N/A'}. Location: ${formData.location || 'N/A'}` 
          : `Location: ${formData.location || 'N/A'}. Secondary Phone: ${formData.phone2 || 'None'}`,
      });

      if (response.status === 201 || response.status === 200) {
        setSubmitted(true);
        sessionStorage.setItem('quote_modal_dismissed', 'true');
      } else {
        setErrorMsg("We're unable to submit your request at the moment. Please try again in a few minutes.");
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      const errMsg = err.response?.data?.message || "We're unable to submit your request at the moment. Please try again in a few minutes.";
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative bg-white text-ink rounded-[28px] max-w-[480px] w-full p-6 sm:p-9 shadow-2xl z-10 border border-ink-border overflow-hidden select-none"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-ink/60 hover:text-black transition-colors"
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-ink tracking-tight uppercase border-b border-ink-border/60 pb-3 leading-snug">
                    {modalTitle}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-ink-soft mt-3 leading-relaxed">
                    {modalMode === 'catalogue'
                      ? 'Please fill out the details below to unlock more premium design pages instantly.'
                      : 'Please fill out the enquiry below and we will get back to you as soon as possible.'
                    }
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                    />
                  </div>

                  {/* Contact Number 1 */}
                  <div className="flex items-center rounded-xl border border-ink-border bg-bg/40 overflow-hidden focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 transition-all">
                    <div className="px-3.5 py-3.5 bg-ink-border/20 border-r border-ink-border flex items-center gap-1.5 shrink-0 text-xs font-sans font-semibold text-ink select-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                      <span className="text-[10px] text-ink-muted">▼</span>
                    </div>
                    <input
                      type="tel"
                      name="phone1"
                      placeholder="Contact Number 1"
                      required
                      value={formData.phone1}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-transparent text-ink text-sm font-sans outline-none placeholder:text-ink-muted"
                    />
                  </div>

                  {/* Contact Number 2 */}
                  <div className="flex items-center rounded-xl border border-ink-border bg-bg/40 overflow-hidden focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 transition-all">
                    <div className="px-3.5 py-3.5 bg-ink-border/20 border-r border-ink-border flex items-center gap-1.5 shrink-0 text-xs font-sans font-semibold text-ink select-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                      <span className="text-[10px] text-ink-muted">▼</span>
                    </div>
                    <input
                      type="tel"
                      name="phone2"
                      placeholder="Contact Number 2 (Optional)"
                      value={formData.phone2}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-transparent text-ink text-sm font-sans outline-none placeholder:text-ink-muted"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                    />
                  </div>

                  {/* Project Location */}
                  <div>
                    <input
                      type="text"
                      name="location"
                      placeholder="Project Location (e.g. Jubilee Hills, Gachibowli)"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-500 font-sans">{errorMsg}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gold text-ink font-sans font-bold text-sm uppercase tracking-wider hover:bg-ink hover:text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success Screen */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  {modalMode === 'catalogue' ? 'Catalogue Request Received!' : 'Estimate Request Received!'}
                </h3>
                <p className="font-sans text-sm text-ink-soft max-w-[360px] mx-auto leading-relaxed">
                  {modalMode === 'catalogue' 
                    ? <>Thank you, <strong>{formData.name || 'valued client'}</strong>. You will receive an SMS and email with details to access more catalog pages shortly.</>
                    : <>Thank you, <strong>{formData.name || 'valued client'}</strong>. Our principal design director will get back to you shortly with your custom quote.</>
                  }
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-full bg-gold text-ink font-sans font-bold text-xs uppercase tracking-wider hover:bg-ink hover:text-white transition-all mt-4"
                >
                  Close Window
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
