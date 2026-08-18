import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const PrivacyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: 'Privacy Policy',
    date: 'Last updated: July 23, 2026',
    body: ''
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-privacy-modal', handleOpen);
    return () => window.removeEventListener('open-privacy-modal', handleOpen);
  }, []);

  useEffect(() => {
    const loadSettings = () => {
      const stored = getCMSData(STORAGE_KEYS.SETTINGS);
      if (stored) {
        setModalData({
          title: stored.footer_privacy_title || 'Privacy Policy',
          date: stored.footer_privacy_date || 'Last updated: July 23, 2026',
          body: stored.footer_privacy_body || ''
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
              aria-label="Close Privacy Policy"
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
                    Espacio ("we," "us," "our") operates <strong>theespacio.in</strong>. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or submit an enquiry.
                  </p>

                  <div className="space-y-6 text-white/80 font-sans text-[13.5px] leading-relaxed">
                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        1. Information We Collect
                      </h3>
                      <ul className="list-disc pl-5 space-y-1.5 text-white/80">
                        <li>Personal details you provide via our contact/quotation form: name, mobile number, email address</li>
                        <li>Project details you share: property type, location, requirements, and any additional information you provide</li>
                        <li>Basic technical data (browser type, device, pages visited) collected automatically via cookies or analytics tools</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        2. How We Use Your Information
                      </h3>
                      <ul className="list-disc pl-5 space-y-1.5 text-white/80">
                        <li>To respond to your enquiry and provide project quotations or consultations</li>
                        <li>To follow up regarding services or materials you've expressed interest in</li>
                        <li>To improve our website and understand visitor behavior</li>
                        <li>We do not sell, rent, or trade your personal information to third parties</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        3. Data Sharing
                      </h3>
                      <p className="text-white/80">
                        We may share information with trusted service providers who help us operate our business (e.g., hosting providers, analytics tools, CRM/communication tools), solely for the purposes above.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                        4. Data Retention & Security
                      </h3>
                      <p className="text-white/80">
                        We retain your information only as long as necessary to fulfill project engagements or comply with applicable laws.
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
                Close Policy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyModal;
