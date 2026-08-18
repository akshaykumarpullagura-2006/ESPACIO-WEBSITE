import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const TermsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: 'Terms & Conditions',
    date: 'Last updated: July 23, 2026',
    body: ''
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-terms-modal', handleOpen);
    return () => window.removeEventListener('open-terms-modal', handleOpen);
  }, []);

  useEffect(() => {
    const loadSettings = () => {
      const stored = getCMSData(STORAGE_KEYS.SETTINGS);
      if (stored) {
        setModalData({
          title: stored.footer_terms_title || 'Terms & Conditions',
          date: stored.footer_terms_date || 'Last updated: July 23, 2026',
          body: stored.footer_terms_body || ''
        });
      }
    };
    loadSettings();

    window.addEventListener('espacio_cms_update', loadSettings);
    window.addEventListener('storage', loadSettings);
    return () => {
      window.removeEventListener('espacio_cms_update', loadSettings);
      window.removeEventListener('storage', loadSettings);
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

  const handleClose = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative bg-[#1A1A1E] text-white rounded-[28px] max-w-[640px] w-full p-6 sm:p-9 shadow-2xl z-10 border border-white/10 flex flex-col max-h-[85vh]"
          >
            {/* Close Button (Cross icon on top right) */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center z-20"
              aria-label="Close Terms and Conditions"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <div className="mb-6 border-b border-white/10 pb-4 pr-10">
              <h2 className="font-display text-[24px] sm:text-[28px] font-semibold text-white tracking-tight">
                {modalData.title}
              </h2>
              <p className="font-sans text-[11px] uppercase tracking-wider text-white/50 font-bold mt-1.5">
                {modalData.date}
              </p>
            </div>

            {/* Scrollable Content */}
            <div data-lenis-prevent className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {modalData.body ? (
                <div className="font-sans text-[14px] text-white/80 leading-relaxed whitespace-pre-line space-y-4">
                  {modalData.body}
                </div>
              ) : (
                <>
                  <p className="font-sans text-[14px] text-white/80 leading-relaxed mb-6">
                    Welcome to <strong>theespacio.in</strong>. By accessing or using this website, you agree to the following terms and conditions.
                  </p>

                  <div className="space-y-6 text-white/80 font-sans text-[13.5px] leading-relaxed">
                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        1. General
                      </h3>
                      <p className="text-white/80">
                        Espacio provides interior design, turnkey execution, renovation, styling, and materials supply services, as described on this website.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        2. Enquiries & Quotations
                      </h3>
                      <p className="text-white/80">
                        Submitting an enquiry or quotation request through our website does not constitute a contract or guarantee of service.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        3. Pricing & Estimates
                      </h3>
                      <p className="text-white/80">
                        Pricing is determined based on individual project scope, materials, and customization following site measurement.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        4. Intellectual Property
                      </h3>
                      <p className="text-white/80">
                        All content on this website is the property of Espacio unless otherwise stated.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer button */}
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-end">
              <button
                onClick={handleClose}
                className="bg-[#c5a572] hover:bg-[#b0905e] text-black font-sans text-[12px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors cursor-pointer border-0"
              >
                Close Terms
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;
