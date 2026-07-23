import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const TermsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-terms-modal', handleOpen);
    return () => window.removeEventListener('open-terms-modal', handleOpen);
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
                Terms & Conditions
              </h2>
              <p className="font-sans text-[11px] uppercase tracking-wider text-white/50 font-bold mt-1.5">
                Last updated: July 23, 2026
              </p>
            </div>

            {/* Scrollable Content */}
            <div data-lenis-prevent className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <p className="font-sans text-[14px] text-white/80 leading-relaxed mb-6">
                Welcome to <strong>theespacio.in</strong>. By accessing or using this website, you agree to the following terms and conditions.
              </p>

              <div className="space-y-6 text-white/80 font-sans text-[13.5px] leading-relaxed">
                {/* Section 1 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    1. General
                  </h3>
                  <p className="text-white/80">
                    Espacio provides interior design, turnkey execution, renovation, styling, and materials supply services, as described on this website. All information on this site is for general informational purposes and does not constitute a binding offer.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    2. Enquiries & Quotations
                  </h3>
                  <p className="text-white/80">
                    Submitting an enquiry or quotation request through our website does not constitute a contract or guarantee of service. All project quotations are subject to a formal consultation and mutually agreed terms between Espacio and the client.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    3. Pricing
                  </h3>
                  <p className="text-white/80">
                    Pricing is determined based on individual project scope, materials, and customization, and is not published on this website. Any figures discussed during consultation are estimates until formalized in a signed agreement.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    4. Materials Supply
                  </h3>
                  <p className="text-white/80">
                    Materials listed on this website (e.g., WPC panels, polygranite sheets, and other products) are sold separately from design and execution services, and are subject to availability. Product specifications are subject to change without prior notice.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    5. Intellectual Property
                  </h3>
                  <p className="text-white/80">
                    All content on this website — including text, images, logos, and designs — is the property of Espacio unless otherwise stated, and may not be reproduced without prior written permission.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    6. Warranties
                  </h3>
                  <p className="text-white/80">
                    Espacio offers a standard warranty on build and craftsmanship as communicated at the time of project agreement. Hardware and fittings are covered as per the respective manufacturer's warranty. Warranty terms are detailed in individual client agreements.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    7. Limitation of Liability
                  </h3>
                  <p className="text-white/80">
                    Espacio is not liable for any indirect, incidental, or consequential damages arising from the use of this website or reliance on its content. Nothing on this website should be considered professional or legal advice.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    8. External Links
                  </h3>
                  <p className="text-white/80">
                    Our website may contain links to third-party websites. We are not responsible for the content or practices of those sites.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    9. Governing Law
                  </h3>
                  <p className="text-white/80">
                    These terms are governed by the laws of India, and any disputes shall be subject to the jurisdiction of the courts in Hyderabad, Telangana.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    10. Changes to Terms
                  </h3>
                  <p className="text-white/80">
                    We reserve the right to update these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the revised terms.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[#c5a572] mb-2 uppercase tracking-wide">
                    11. Contact Us
                  </h3>
                  <p className="text-white/80">
                    For questions about these Terms & Conditions, contact us at{' '}
                    <a href="mailto:Espacio.hyd@gmail.com" className="text-[#c5a572] hover:underline font-semibold">
                      Espacio.hyd@gmail.com
                    </a>.
                  </p>
                </div>
              </div>
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
