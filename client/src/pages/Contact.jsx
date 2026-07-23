import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, Check, MapPin, Phone, Mail, Clock, ShieldCheck, FileText, Sparkles, Award } from 'lucide-react';
import SEO from '../components/common/SEO';
import axios from 'axios';
import { db, collection, addDoc } from '../lib/firebaseClient';

const requirements = [
  { val: 'Turnkey Interiors', desc: 'Complete design + execution — from concept to move-in, handled entirely by us' },
  { val: 'Design Only', desc: "You need the design; you'll handle or already have execution" },
  { val: 'Renovation', desc: 'Upgrading or redesigning an existing space' },
  { val: 'Individual', desc: 'Book a single service like only modular kitchen, only wardrobe, or TV unit' },
  { val: 'Materials', desc: 'Sourcing premium panels, sheets & finishes — no design/execution needed' },
  { val: 'Something Else', desc: 'Let us understand your requirement' }
];

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const textY   = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);
  const textOp  = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    requirement: '',
    individualRequirement: '',
    propertyType: '',
    otherPropertyType: '',
    spaces: [],
    otherSpaces: '',
    location: '',
    size: '',
    stage: '',
    notes: '',
    productCategories: [],
    otherMaterials: '',
    quantity: '',
    fullName: '',
    mobile: '',
    email: ''
  });

  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // New Modal States
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [tempIndividualReq, setTempIndividualReq] = useState('');
  const [tempFiles, setTempFiles] = useState([]);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }

    const prop = params.get('property');
    const scp = params.get('scope');
    if (prop || scp) {
      const propMap = { '2bhk': 'Apartment', '3bhk': 'Apartment', 'villa': 'Villa', 'office': 'Office' };
      const scpMap = { 'full': 'Turnkey Interiors', 'kitchen': 'Turnkey Interiors', 'louvers': 'Materials' };
      setFormData(prev => ({
        ...prev,
        requirement: scpMap[scp] || 'Turnkey Interiors',
        propertyType: propMap[prop] || 'Apartment'
      }));
    }
  }, [location]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [step, submitted]);

  const isMaterials = formData.requirement === 'Materials';
  const isIndividualFlow = formData.requirement === 'Individual';

  const stepsList = isMaterials 
    ? ['Requirement', 'Materials Info', 'Your Details', 'Review'] 
    : isIndividualFlow
      ? ['Requirement', 'Your Details', 'Review']
      : ['Requirement', 'Property Info', 'A Bit More Detail', 'Your Details', 'Review'];
  
  const activeStepIdx = isMaterials
    ? (step === 1 ? 0 : step === 3 ? 1 : step === 4 ? 2 : 3)
    : isIndividualFlow
      ? (step === 1 ? 0 : step === 4 ? 1 : 2)
      : step - 1;
    
  const progressPercent = (activeStepIdx / (stepsList.length - 1)) * 100;

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.requirement) {
        newErrors.requirement = 'Please select what you are looking for.';
      } else if (formData.requirement === 'Individual' && !formData.individualRequirement?.trim()) {
        newErrors.individualRequirement = 'Please describe the individual service you are looking for.';
      }
    } else if (step === 2) {
      if (!formData.propertyType) newErrors.propertyType = 'Property type is required.';
      else if (formData.propertyType === 'Others' && !formData.otherPropertyType.trim()) newErrors.propertyType = 'Please specify the property type.';

      if (!formData.spaces || formData.spaces.length === 0) newErrors.spaces = 'Please select at least one space.';
      else if (formData.spaces.includes('Others') && !formData.otherSpaces.trim()) newErrors.spaces = 'Please specify the space(s).';

      if (!formData.location || formData.location.trim().length < 3) newErrors.location = 'Project location (at least 3 characters) is required.';
    } else if (step === 3) {
      if (isMaterials) {
        if (!formData.productCategories || formData.productCategories.length === 0) {
          newErrors.productCategories = 'Please select at least one product category.';
        } else if (formData.productCategories.includes('Others') && !formData.otherMaterials?.trim()) {
          newErrors.otherMaterials = 'Please specify the materials.';
        }
      } else {
        if (!formData.stage) newErrors.stage = 'Please select a timeline stage.';
      }
    } else if (step === 4) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required.';
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 1 && isMaterials) {
        setStep(3); // Skip Step 2 for Materials
      } else if (step === 1 && isIndividualFlow) {
        setStep(4); // Go immediately to Your Details (Step 4) for Individual
      } else if (step === 4 && isIndividualFlow) {
        setStep(5); // Go to Review (Step 5)
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 3 && isMaterials) {
      setStep(1); // Back to Step 1 for Materials
    } else if (step === 4 && isIndividualFlow) {
      setStep(1); // Back to Step 1 for Individual
    } else if (step === 5 && isIndividualFlow) {
      setStep(4); // Back to Your Details (Step 4) for Individual
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate mobile number format (must be 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.mobile.trim().replace(/\s+/g, ''))) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setError(null);    
    const notes = isMaterials
      ? `Product Categories: ${formData.productCategories.map(c => c === 'Others' ? `Others (${formData.otherMaterials})` : c).join(', ')} | Approx. Quantity: ${formData.quantity || 'N/A'}`
      : `Property: ${formData.propertyType === 'Others' ? formData.otherPropertyType : formData.propertyType} | Spaces: ${formData.spaces.map(s => s === 'Others' ? formData.otherSpaces : s).join(', ')} | Location: ${formData.location} | Size: ${formData.size || 'N/A'} | Stage: ${formData.stage}${formData.requirement === 'Individual' ? `\n\nIndividual Requirement: ${formData.individualRequirement}${attachedFiles.length > 0 ? `\nInspiration Attachments: ${attachedFiles.map(f => f.name).join(', ')}` : ''}` : ''}\n\nNotes: ${formData.notes || 'None'}`;

    const googleSheetData = {
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: formData.fullName,
      mobile: formData.mobile,
      email: formData.email,
      requirement: formData.requirement || 'N/A',
      individualRequirement: formData.requirement === 'Individual' ? formData.individualRequirement : 'N/A',
      attachments: attachedFiles.map(f => f.name).join(', ') || 'None',
      propertyType: formData.propertyType === 'Others' ? formData.otherPropertyType : (formData.propertyType || 'N/A'),
      spaces: formData.spaces.map(s => s === 'Others' ? formData.otherSpaces : s).join(', ') || 'N/A',
      location: formData.location || 'N/A',
      size: formData.size || 'N/A',
      stage: formData.stage || 'N/A',
      materialCategories: formData.productCategories?.map(c => c === 'Others' ? `Others (${formData.otherMaterials})` : c).join(', ') || 'N/A',
      quantity: formData.quantity || 'N/A',
      notes: formData.notes || 'N/A',
      status: 'New Lead'
    };

    try {
      // 1. Send to Firebase Firestore (non-blocking)
      try {
        await addDoc(collection(db, 'leads'), {
          name: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          project_type: formData.requirement,
          budget: isMaterials ? 'Materials Path' : formData.stage,
          message: notes,
          status: 'new',
          created_at: new Date().toISOString()
        });
        console.log('Firebase lead inserted successfully.');
      } catch (fErr) {
        console.warn('Firebase insert failed:', fErr.message);
      }

      // 2. Send to local backend server (which performs Google Sheets synchronization)
      const response = await axios.post('/leads', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        projectType: formData.requirement,
        budget: isMaterials ? 'Materials Path' : formData.stage,
        message: `Mobile: ${formData.mobile}\n\n${notes}`,
        googleSheetData
      });

      if (response.status === 200 || response.status === 201) {
        navigate('/contact?success=true', { replace: true });
      } else {
        throw new Error(response.data?.message || "We're unable to submit your request at the moment. Please try again in a few minutes.");
      }
    } catch (err) {
      console.error('Submission failed:', err);
      const errMsg = err.response?.data?.message || err.message || "We're unable to submit your request at the moment. Please try again in a few minutes.";
      setError(errMsg);
      setSubmitting(false);
      return; // Do NOT clear form or redirect on failure
    } finally {
      // Only set submitting to false if we haven't already returned early on error
      setSubmitting(false);
    }
  };

  const handleSelectIndividual = () => {
    setTempIndividualReq(formData.individualRequirement || '');
    setTempFiles(attachedFiles || []);
    setShowIndividualModal(true);
  };

  const handleCancelModal = () => {
    setShowIndividualModal(false);
  };

  const handleContinueModal = () => {
    setFormData(prev => ({ 
      ...prev, 
      requirement: 'Individual',
      individualRequirement: tempIndividualReq 
    }));
    setAttachedFiles(tempFiles);
    setShowIndividualModal(false);
    setErrors(prev => ({ ...prev, requirement: null, individualRequirement: null }));
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFilesAdded = (filesList) => {
    const files = Array.from(filesList);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const validFiles = files.filter(f => validTypes.includes(f.type) || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') || f.name.endsWith('.png') || f.name.endsWith('.webp') || f.name.endsWith('.pdf'));
    
    setTempFiles(prev => {
      const combined = [...prev, ...validFiles];
      return combined.slice(0, 10);
    });
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleFilesAdded(e.target.files);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeTempFile = (idx) => {
    setTempFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Keyboard Esc Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showIndividualModal) {
        handleCancelModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIndividualModal, formData.individualRequirement]);

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center pt-24 text-charcoal">
        <div className="text-center max-w-[520px] px-6 py-24 space-y-6">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-gold" />
          </div>
          <h1 className="font-editorial text-4xl font-bold text-charcoal">Thank you.</h1>
          <p className="font-sans text-sm text-walnut leading-relaxed">
            Your quote request has been received. Our team will get back to you within <strong>24 hours</strong> with your personalized quote.
          </p>
          <div className="pt-4 space-y-3 flex flex-col items-center">
            <p className="font-sans text-xs uppercase tracking-widest text-gold font-bold mb-1">What happens next?</p>
            {['We review your requirements', 'You receive your personalized quote', 'Our experts follow up with details'].map((s, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-xs font-sans text-walnut w-full max-w-[280px]">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-[10px] shrink-0">{idx + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <Link to="/" className="inline-flex items-center space-x-2 bg-charcoal hover:bg-gold text-cream hover:text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-all duration-300 mt-4">
            <span>Back to ESPACIO</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <SEO title="Get a Quote & Consultation — Luxury Interiors" description="Submit your project requirements through our multi-step quote wizard to request a private consultation with ESPACIO's principal interior design team." url="/contact" />
      
      {/* ── CLEAN PAGE TITLE HEADER ── */}
      <section className="pt-32 pb-8 px-6 text-center max-w-[820px] mx-auto">
        <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold px-4 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em]">Get A Quote & Consultation</span>
        </div>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-charcoal leading-tight">
          Let's Design Something Remarkable.
        </h1>
        <p className="font-sans text-xs md:text-sm text-walnut mt-3 max-w-[560px] mx-auto leading-relaxed">
          Submit your project details below for an itemized BOQ estimate, 3D visualization consultation, and custom material selection.
        </p>
      </section>

      {/* WIZARD SECTION */}
      <section ref={formRef} className="max-w-[820px] mx-auto px-6 pb-20 scroll-mt-28">
        
        {/* Dynamic Progress Indicator — Perfectly Aligned 5-Step Row */}
        <div className="relative mb-14 select-none">
          {/* Connecting Line behind step circles */}
          <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-ink-border/50 z-0">
            <div
              className="h-full bg-gold transition-all duration-500 ease-out"
              style={{ width: `${(activeStepIdx / (stepsList.length - 1)) * 100}%` }}
            />
          </div>

          {/* Equal Columns Grid */}
          <div className={`relative z-10 grid ${
            stepsList.length === 3 
              ? 'grid-cols-3' 
              : stepsList.length === 4 
                ? 'grid-cols-4' 
                : 'grid-cols-5'
          } gap-2 w-full`}>
            {stepsList.map((label, idx) => {
              const done = activeStepIdx > idx;
              const active = activeStepIdx === idx;
              return (
                <div
                  key={label}
                  className="flex flex-col items-center text-center cursor-pointer group"
                  onClick={() => {
                    if (done) {
                      if (isMaterials) {
                        setStep(idx === 0 ? 1 : idx === 1 ? 3 : idx === 2 ? 4 : 5);
                      } else if (isIndividualFlow) {
                        setStep(idx === 0 ? 1 : idx === 1 ? 4 : 5);
                      } else {
                        setStep(idx + 1);
                      }
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm ${
                      done
                        ? 'bg-gold text-charcoal ring-4 ring-gold/20'
                        : active
                        ? 'bg-charcoal text-white ring-4 ring-charcoal/20 scale-105'
                        : 'bg-white border border-ink-border text-ink-muted'
                    }`}
                  >
                    {done ? <CheckCircle size={16} /> : idx + 1}
                  </div>
                  <span
                    className={`font-sans text-[10px] uppercase tracking-wider font-bold mt-2.5 max-w-[120px] leading-tight text-center ${
                      active ? 'text-charcoal font-extrabold' : done ? 'text-gold' : 'text-walnut/50'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WIZARD STEPS */}
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">What are you looking for?</h2>
                <p className="font-sans text-sm text-walnut">Select the option that best describes your requirement.</p>
              </div>
              
              <div className="space-y-4">
                {requirements.map((req) => {
                  const isSelected = formData.requirement === req.val;
                  return (
                    <button
                      type="button"
                      key={req.val}
                      onClick={() => {
                        if (req.val === 'Individual') {
                          handleSelectIndividual();
                        } else {
                          setFormData(prev => ({ ...prev, requirement: req.val }));
                          setErrors(prev => ({ ...prev, requirement: null }));
                        }
                      }}
                      className={`w-full text-left p-5 rounded-[16px] border transition-all duration-300 flex items-start justify-between group ${
                        isSelected 
                          ? 'bg-gold border-gold text-charcoal shadow-md' 
                          : 'bg-offwhite border-walnut/10 text-charcoal hover:border-walnut/30 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-1 pr-6">
                        <span className="font-sans text-sm font-bold uppercase tracking-wider text-charcoal">
                          {req.val}
                        </span>
                        <p className={`font-sans text-xs ${isSelected ? 'text-charcoal/80' : 'text-walnut'}`}>
                          {req.desc}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-all ${
                        isSelected ? 'border-charcoal bg-charcoal text-gold' : 'border-walnut/20'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
                {errors.requirement && (
                  <p className="font-sans text-xs text-red-500">{errors.requirement}</p>
                )}
              </div>

              <WizardNav 
                step={step} 
                onNext={handleNext} 
                onBack={handleBack} 
                disabled={formData.requirement === 'Individual' && !formData.individualRequirement?.trim()} 
              />
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">Tell us about the property</h2>
                <p className="font-sans text-sm text-walnut">Help us with some basic information about your project location and size.</p>
              </div>

              {/* Property Type Grid */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Property Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Apartment', 'Villa', 'Independent House', 'Commercial', 'Office', 'Others'].map((pt) => {
                    const isSelected = formData.propertyType === pt;
                    return (
                      <button
                        type="button"
                        key={pt}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, propertyType: pt }));
                          setErrors(prev => ({ ...prev, propertyType: null }));
                        }}
                        className={`py-3.5 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-gold border-gold text-charcoal' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        {pt}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {formData.propertyType === 'Others' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <input 
                        type="text" 
                        placeholder="Please specify property type..."
                        value={formData.otherPropertyType}
                        onChange={e => setFormData(p => ({ ...p, otherPropertyType: e.target.value }))}
                        className="w-full mt-1 bg-offwhite border border-walnut/10 rounded-input px-4 py-3.5 font-sans text-sm text-charcoal placeholder-walnut/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 shadow-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.propertyType && <p className="font-sans text-xs text-red-500">{errors.propertyType}</p>}
              </div>

              {/* Space(s) Multi-select */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Which space(s)? *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Full Home', 'Kitchen', 'Bedroom', 'Living Room', 'Office', 'Multiple Spaces', 'Others'].map((s) => {
                    const isSelected = formData.spaces.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => {
                          const updated = isSelected 
                            ? formData.spaces.filter(x => x !== s)
                            : [...formData.spaces, s];
                          setFormData(prev => ({ ...prev, spaces: updated }));
                          setErrors(prev => ({ ...prev, spaces: null }));
                        }}
                        className={`py-3.5 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 flex items-center justify-between ${
                          isSelected 
                            ? 'bg-gold border-gold text-charcoal' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        <span>{s}</span>
                        {isSelected && <Check size={12} className="text-charcoal" />}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {formData.spaces.includes('Others') && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <input 
                        type="text" 
                        placeholder="Please specify which space(s)..."
                        value={formData.otherSpaces}
                        onChange={e => setFormData(p => ({ ...p, otherSpaces: e.target.value }))}
                        className="w-full mt-1 bg-offwhite border border-walnut/10 rounded-input px-4 py-3.5 font-sans text-sm text-charcoal placeholder-walnut/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 shadow-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.spaces && <p className="font-sans text-xs text-red-500">{errors.spaces}</p>}
              </div>

              {/* Location & Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Project Location (area/city) *</label>
                  <input 
                    value={formData.location}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, location: e.target.value }));
                      setErrors(prev => ({ ...prev, location: null }));
                    }}
                    placeholder="e.g. Jubilee Hills, Hyderabad" 
                    className="espacio-input" 
                  />
                  {errors.location && <p className="font-sans text-xs text-red-500">{errors.location}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Property Size (optional)</label>
                  <input 
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="e.g. 3200 sq ft or 3 BHK" 
                    className="espacio-input" 
                  />
                </div>
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 3 (Non-materials) */}
          {step === 3 && !isMaterials && (
            <motion.div 
              key="step3-standard"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">A bit more detail</h2>
                <p className="font-sans text-sm text-walnut">Help us align with your timeline and specific requirements.</p>
              </div>

              {/* Stage Timeline */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">What stage are you at? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Just exploring', 'Ready to start', 'Have a timeline in mind'].map((stg) => {
                    const isSelected = formData.stage === stg;
                    return (
                      <button
                        type="button"
                        key={stg}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, stage: stg }));
                          setErrors(prev => ({ ...prev, stage: null }));
                        }}
                        className={`py-3.5 px-4 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 ${
                          isSelected 
                            ? 'bg-gold border-gold text-charcoal' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
                {errors.stage && <p className="font-sans text-xs text-red-500">{errors.stage}</p>}
              </div>

              {/* NOTES */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Anything specific in mind? (optional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={5} 
                  placeholder="Describe your vision, style preferences, or any specific requirements..."
                  className="espacio-input resize-none" 
                />
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 3 (Materials Path) */}
          {step === 3 && isMaterials && (
            <motion.div 
              key="step3-materials"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">What are you looking for?</h2>
                <p className="font-sans text-sm text-walnut">Select the material categories you would like to source.</p>
              </div>

              {/* Product categories Single-select */}
              <div className="space-y-3">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Product Category * (Select one)</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Wall & Ceiling Panels', 'Surfaces & Sheets', 'Tiles', 'Not Sure Yet', 'Others'].map((cat) => {
                    const isSelected = formData.productCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          const updated = isSelected ? [] : [cat];
                          setFormData(prev => ({ ...prev, productCategories: updated }));
                          setErrors(prev => ({ ...prev, productCategories: null }));
                        }}
                        className={`py-4 px-5 rounded-input text-xs font-sans uppercase tracking-wide font-bold border transition-all duration-200 flex items-center justify-between ${
                          isSelected 
                            ? 'bg-gold border-gold text-charcoal' 
                            : 'bg-offwhite border-walnut/10 text-walnut hover:border-walnut/30'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check size={12} className="text-charcoal" />}
                      </button>
                    );
                  })}
                </div>
                {errors.productCategories && <p className="font-sans text-xs text-red-500">{errors.productCategories}</p>}

                {/* Custom materials input field if 'Others' is selected */}
                {formData.productCategories.includes('Others') && (
                  <div className="space-y-1.5 pt-2">
                    <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Please specify materials *</label>
                    <input 
                      value={formData.otherMaterials || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, otherMaterials: e.target.value }));
                        setErrors(prev => ({ ...prev, otherMaterials: null }));
                      }}
                      placeholder="e.g. Acrylic sheets, louvers, edge bands..." 
                      className="espacio-input"
                      required
                    />
                    {errors.otherMaterials && <p className="font-sans text-xs text-red-500">{errors.otherMaterials}</p>}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Approximate Quantity/Area (optional)</label>
                <input 
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="e.g. 500 sq ft, 20 panels, etc." 
                  className="espacio-input" 
                />
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">Your Details</h2>
                <p className="font-sans text-sm text-walnut">Enter your contact information below so we can reach out to you.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Full Name *</label>
                  <input 
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, fullName: e.target.value }));
                      setErrors(prev => ({ ...prev, fullName: null }));
                    }}
                    placeholder="Arjun Sharma" 
                    className="espacio-input" 
                  />
                  {errors.fullName && <p className="font-sans text-xs text-red-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Mobile Number *</label>
                  <input 
                    value={formData.mobile}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, mobile: e.target.value }));
                      setErrors(prev => ({ ...prev, mobile: null }));
                    }}
                    placeholder="e.g. +91 95051 51116" 
                    className="espacio-input" 
                  />
                  {errors.mobile && <p className="font-sans text-xs text-red-500">{errors.mobile}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Email Address *</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      setErrors(prev => ({ ...prev, email: null }));
                    }}
                    placeholder="arjun@example.com" 
                    className="espacio-input" 
                  />
                  {errors.email && <p className="font-sans text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <WizardNav step={step} onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {/* STEP 5 - REVIEW */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl font-bold text-charcoal">Review your brief.</h2>
                <p className="font-sans text-sm text-walnut">Everything looks correct? Submit to connect with our design team.</p>
              </div>

              {/* 4 Category Review Cards */}
              <div className="space-y-5">
                
                {/* 1. REQUIREMENT (Step 1) */}
                <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                  <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">1</span>
                      <span>Requirement</span>
                    </h3>
                    <button type="button" onClick={() => setStep(1)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Looking For</span>
                    <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.requirement || 'Not specified'}</span>
                  </div>
                  {isIndividualFlow && (
                    <div className="space-y-3 mt-3 border-t border-walnut/10 pt-3">
                      <div className="grid grid-cols-3">
                        <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Description</span>
                        <span className="font-sans text-sm text-charcoal font-semibold col-span-2 whitespace-pre-wrap">{formData.individualRequirement}</span>
                      </div>
                      {attachedFiles.length > 0 && (
                        <div className="grid grid-cols-3">
                          <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Attachments</span>
                          <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{attachedFiles.map(f => f.name).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. PROPERTY / MATERIALS INFO (Step 2 or Step 3 for Materials) - Hide for Individual */}
                {!isIndividualFlow && (
                  <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                    <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                      <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">2</span>
                        <span>{isMaterials ? 'Materials Info' : 'Property & Spaces'}</span>
                      </h3>
                      <button type="button" onClick={() => setStep(isMaterials ? 3 : 2)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                    </div>
                    <div className="space-y-3">
                      {isMaterials ? (
                        <>
                          <div className="grid grid-cols-3">
                            <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Categories</span>
                            <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.productCategories.length > 0 ? formData.productCategories.join(', ') : 'None selected'}</span>
                          </div>
                          {formData.quantity && (
                            <div className="grid grid-cols-3">
                              <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Quantity/Area</span>
                              <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.quantity}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-3">
                            <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Property Type</span>
                            <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.propertyType === 'Others' ? formData.otherPropertyType : (formData.propertyType || 'Not specified')}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Spaces / Rooms</span>
                            <span className="font-sans text-sm text-charcoal font-semibold col-span-2">
                              {formData.spaces.length > 0 
                                ? formData.spaces.map(s => s === 'Others' ? formData.otherSpaces : s).join(', ')
                                : 'Entire Space'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. PROJECT DETAILS (Step 3) - Hide for Individual */}
                {!isIndividualFlow && (
                  <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                    <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                      <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">3</span>
                        <span>Project Details</span>
                      </h3>
                      <button type="button" onClick={() => setStep(3)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3">
                        <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Location</span>
                        <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.location || 'Not specified'}</span>
                      </div>
                      {!isMaterials && (
                        <>
                          {formData.size && (
                            <div className="grid grid-cols-3">
                              <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Size / Area</span>
                              <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.size}</span>
                            </div>
                          )}
                          {formData.stage && (
                            <div className="grid grid-cols-3">
                              <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Project Stage</span>
                              <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.stage}</span>
                            </div>
                          )}
                        </>
                      )}
                      {formData.notes && (
                        <div className="grid grid-cols-3">
                          <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Additional Notes</span>
                          <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. YOUR CONTACT DETAILS (Step 4) */}
                <div className="bg-offwhite border border-walnut/10 rounded-input p-6 relative group hover:border-walnut/30 transition-colors">
                  <div className="flex justify-between items-center mb-4 border-b border-walnut/10 pb-3">
                    <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[10px] font-bold flex items-center justify-center">
                        {isIndividualFlow ? '2' : '4'}
                      </span>
                      <span>Your Contact Details</span>
                    </h3>
                    <button type="button" onClick={() => setStep(4)} className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold hover:text-charcoal transition-colors">EDIT</button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3">
                      <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Full Name</span>
                      <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.fullName || 'Not provided'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Mobile Number</span>
                      <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.mobile || 'Not provided'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-sans text-xs text-walnut/70 uppercase tracking-wide">Email Address</span>
                      <span className="font-sans text-sm text-charcoal font-semibold col-span-2">{formData.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {error && <p className="font-sans text-xs text-red-500 bg-red-50 border border-red-200 px-4 py-3 rounded-input">{error}</p>}

              <div className="flex items-center justify-between pt-4">
                <button 
                  type="button" 
                  onClick={handleBack} 
                  className="flex items-center space-x-2 font-btn text-xs uppercase tracking-widest text-walnut hover:text-charcoal font-semibold py-3 px-5 rounded-button border border-walnut/10 hover:border-walnut/30 transition-all"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="cursor-pointer bg-gold hover:bg-charcoal hover:text-cream text-charcoal px-8 py-4 rounded-xl border-[1px] border-walnut/15 shadow-[0px_4px_16px_rgba(201,169,110,0.15)] hover:shadow-[0px_4px_32px_rgba(16,16,20,0.3)] font-btn text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="relative overflow-hidden h-[16px] flex items-center justify-center">
                      <div className="invisible flex items-center gap-2">
                        <span>Submit Request</span>
                        <ArrowRight size={14} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 group-hover:-translate-y-6 transition-transform duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                        <span>Submit Request</span>
                        <ArrowRight size={14} />
                      </div>
                      <div className="absolute inset-0 top-6 flex items-center justify-center gap-2 group-hover:top-0 transition-all duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                        <span>Submit Request</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  )}
                </button>
              </div>
              
              <p className="text-center font-sans text-xs text-walnut/60 pt-2">
                We'll get back to you within 24 hours with your personalized quote.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── QUOTATION GUARANTEES & COMMITMENTS ───────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-offwhite border-t border-walnut/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-[650px] mx-auto mb-14 space-y-3">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Why Quote With ESPACIO</span>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-charcoal">Our Quotation & Execution Commitments</h2>
            <p className="font-sans text-xs text-walnut leading-relaxed">
              We operate on absolute transparency. Every BOQ we prepare is detailed down to the millimetre and hardware specification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <FileText size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">Itemized BOQ Quote</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                Zero surprise fees. You receive a complete line-item breakdown of hardware, board grades, and finish costs.
              </p>
            </div>

            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">Guaranteed Quality</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                Every product is carefully selected, inspected, and installed to meet our uncompromising quality standards.
              </p>
            </div>

            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <Award size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">Transparent Pricing</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                No hidden charges or unexpected costs. Every quotation is clear, detailed, and fully transparent before execution.
              </p>
            </div>

            <div className="bg-cream border border-walnut/10 rounded-card p-6 space-y-4 shadow-sm hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <Sparkles size={22} />
              </div>
              <h3 className="font-editorial text-lg font-bold text-charcoal">Free 3D Render</h3>
              <p className="font-sans text-xs text-walnut leading-relaxed">
                Visualize your living room, kitchen, and wardrobes in photorealistic 3D before starting site execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STUDIO & EXPERIENCE CENTER DETAILS ────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 bg-charcoal text-cream">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center max-w-[600px] mx-auto space-y-3">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Visit Us</span>
            <h2 className="font-editorial text-3xl md:text-5xl font-bold text-white">Experience Centers & Studio</h2>
            <p className="font-sans text-xs md:text-sm text-cream/70 leading-relaxed">
              Walk into our flagship material experience studio. Touch, feel, and compare over 200+ live panel and finish samples in person.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Experience Center */}
            <div className="bg-white/5 border border-white/10 rounded-card p-8 backdrop-blur-md space-y-6 flex flex-col justify-between hover:border-gold/40 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h3 className="font-editorial text-xl font-bold text-white">Our Studio</h3>
                <a 
                  href="https://maps.app.goo.gl/q3zbxWmEt5wvRKbZ6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-sans text-xs text-cream/80 hover:text-gold transition-colors leading-relaxed block"
                >
                  1st floor, H.No. 6-63/14B,<br />
                  Moinabad Road, Aziznagar,<br />
                  Hyderabad, Telangana 500075
                </a>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Experience Center</span>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="bg-white/5 border border-white/10 rounded-card p-8 backdrop-blur-md space-y-6 flex flex-col justify-between hover:border-gold/40 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <h3 className="font-editorial text-xl font-bold text-white">Direct Line</h3>
                <div className="space-y-2 font-sans text-xs text-cream/80">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-gold" />
                    <a href="tel:+919505151116" className="text-cream/90 hover:text-gold transition-colors font-medium">+91 95051 51116</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="text-gold fill-current" viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.713-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.57 1.977 14.093.953 11.453.953 6.017.953 1.593 5.323 1.589 10.75c-.001 1.638.431 3.236 1.251 4.654L1.874 21.8l6.452-1.68c1.378.75 2.87 1.146 4.382 1.147h.008zM17.486 14.4c-.3-.15-1.774-.875-2.05-1.008-.277-.1-.478-.15-.68.15-.202.3-.777.977-.954 1.176-.176.2-.352.225-.652.075-.3-.15-1.266-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.077-.176-.3-.02-.462.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.68-1.645-.93-2.247-.244-.593-.492-.51-.68-.52-.176-.01-.377-.01-.577-.01s-.527.075-.803.375c-.277.3-1.054 1.028-1.054 2.509 0 1.48 1.08 2.92 1.23 3.122.15.2 2.126 3.25 5.152 4.56.72.311 1.28.499 1.719.639.723.23 1.38.19 1.9.11.58-.09 1.774-.726 2.025-1.43.25-.704.25-1.306.175-1.43-.075-.124-.275-.2-.575-.35z" />
                    </svg>
                    <a href="https://wa.me/919505151116" target="_blank" rel="noopener noreferrer" className="text-cream/90 hover:text-gold transition-colors font-medium">WhatsApp: +91 95051 51116</a>
                  </p>
                  <p className="flex items-center gap-2 pt-2">
                    <Mail size={14} className="text-gold" />
                    <a href="mailto:Espacio.hyd@gmail.com" className="text-cream/90 hover:text-gold transition-colors font-medium">Espacio.hyd@gmail.com</a>
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Immediate Assistance</span>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white/5 border border-white/10 rounded-card p-8 backdrop-blur-md space-y-6 flex flex-col justify-between hover:border-gold/40 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h3 className="font-editorial text-xl font-bold text-white">Studio Hours</h3>
                <div className="space-y-2 font-sans text-xs">
                  <p className="flex justify-between"><span className="text-cream/80">Mon – Sat:</span> <span className="font-bold text-white">10:00 AM – 7:30 PM</span></p>
                  <p className="flex justify-between"><span className="text-cream/80">Sunday:</span> <span className="text-gold font-bold">By Appointment</span></p>
                  <p className="font-sans text-[11px] text-cream/75 pt-2">Private evening consultations available upon request.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Consultation Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PREMIUM MODAL POPUP FOR INDIVIDUAL REQUIREMENTS ─── */}
      <AnimatePresence>
        {showIndividualModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[12px]"
            onClick={handleCancelModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[620px] bg-cream rounded-[24px] border border-walnut/15 p-6 md:p-8 shadow-2xl flex flex-col space-y-6 text-charcoal max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button 
                type="button" 
                onClick={handleCancelModal}
                className="absolute top-5 right-5 text-walnut hover:text-charcoal transition-colors p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Header */}
              <div className="space-y-2 pr-6">
                <h2 className="font-editorial text-2xl md:text-3xl font-bold text-charcoal">
                  Tell us about your requirement
                </h2>
                <p className="font-sans text-xs md:text-sm text-walnut leading-relaxed">
                  Help us understand exactly what you're looking for. The more details you provide, the better we can prepare your consultation and quotation.
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold block">
                  What individual service are you looking for? *
                </label>
                <textarea
                  value={tempIndividualReq}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setTempIndividualReq(e.target.value);
                    }
                  }}
                  rows={6}
                  style={{ minHeight: '160px' }}
                  placeholder="Example: I need a modular kitchen with a matte finish, soft-close hardware, quartz countertop, and an island. Approximate size is 12 × 10 ft.&#10;&#10;Describe your requirement..."
                  className="w-full bg-offwhite border border-walnut/15 rounded-input px-4 py-3.5 font-sans text-sm text-charcoal placeholder-walnut/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 resize-y"
                />
                <div className="flex justify-between items-start gap-4 text-[11px] font-sans text-walnut/70">
                  <span>
                    Please mention dimensions, preferred materials, finishes, colours, brand preferences, quantity, or any other details if available.
                  </span>
                  <span className="shrink-0 font-mono">
                    {tempIndividualReq.length}/500
                  </span>
                </div>
              </div>

              {/* Optional Upload */}
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold block">
                  Reference Images (Optional)
                </label>
                <p className="font-sans text-[11px] text-walnut/70">
                  Upload inspiration images, sketches, floor plans, or screenshots.
                </p>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={triggerFileSelect}
                  className="border border-dashed border-walnut/20 hover:border-gold rounded-input p-6 text-center cursor-pointer transition-colors duration-200 bg-offwhite/50 flex flex-col items-center justify-center space-y-2"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple 
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    className="hidden" 
                  />
                  <span className="font-sans text-xs text-charcoal/70">
                    Drag & drop images here, or <strong className="text-charcoal underline">browse</strong>
                  </span>
                  <span className="font-sans text-[10px] text-walnut/50">
                    Supports JPG, PNG, WEBP, PDF (Max 10 files)
                  </span>
                </div>

                {/* Uploaded Files List */}
                {tempFiles.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {tempFiles.map((file, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between bg-offwhite border border-walnut/5 px-3 py-2 rounded-[8px] text-xs font-sans text-charcoal">
                        <span className="truncate max-w-[80%]">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeTempFile(fIdx)}
                          className="text-red-500 hover:text-red-700 font-bold px-1.5"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popup Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelModal}
                  className="font-btn text-xs uppercase tracking-widest text-walnut hover:text-charcoal font-semibold py-3.5 px-6 rounded-button border border-walnut/15 hover:border-walnut/30 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!tempIndividualReq.trim()}
                  onClick={handleContinueModal}
                  className={`px-8 py-3.5 rounded-xl border border-walnut/15 font-btn text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${
                    !tempIndividualReq.trim()
                      ? 'opacity-40 cursor-not-allowed bg-charcoal/50 text-cream/70 shadow-none'
                      : 'cursor-pointer bg-charcoal text-cream hover:bg-gold hover:text-charcoal shadow-[0px_4px_16px_rgba(16,16,20,0.15)] hover:scale-103'
                  }`}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Internal Helper Component ───────────────────────────────────────────────
const WizardNav = ({ step, onNext, onBack, disabled = false }) => {
  return (
    <div className="flex items-center justify-between pt-4">
      {step > 1 ? (
        <button 
          type="button" 
          onClick={onBack} 
          className="flex items-center space-x-2 font-btn text-xs uppercase tracking-widest text-walnut hover:text-charcoal font-semibold py-3 px-5 rounded-button border border-walnut/10 hover:border-walnut/30 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      ) : <div />}
      <button 
        type="button" 
        onClick={disabled ? undefined : onNext}
        disabled={disabled}
        className={`px-8 py-4 rounded-xl border-[1px] border-walnut/15 font-btn text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:scale-103 group ${
          disabled 
            ? 'opacity-40 cursor-not-allowed bg-charcoal/50 text-cream/70 shadow-none' 
            : 'cursor-pointer bg-charcoal text-cream hover:bg-gold hover:text-charcoal shadow-[0px_4px_16px_rgba(16,16,20,0.15)] hover:shadow-[0px_4px_24px_rgba(201,169,110,0.3)]'
        }`}
      >
        <div className="relative overflow-hidden h-[16px] flex items-center justify-center">
          <div className="invisible flex items-center gap-2">
            <span>Continue</span>
            <ArrowRight size={14} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 group-hover:-translate-y-6 transition-transform duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
            <span>Continue</span>
            <ArrowRight size={14} />
          </div>
          <div className="absolute inset-0 top-6 flex items-center justify-center gap-2 group-hover:top-0 transition-all duration-[0.8s] ease-[cubic-bezier(0.19,1,0.22,1)]">
            <span>Continue</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default Contact;
