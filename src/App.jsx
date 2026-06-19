import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, ChevronRight, Save, Trash2, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

// Import components
import LandingStep from './components/LandingStep';
import ConsentStep from './components/ConsentStep';
import ProfileStep from './components/ProfileStep';
import AhpGuideStep from './components/AhpGuideStep';
import { CriteriaValidationStep, SubcriteriaValidationStep, AlternativesValidationStep } from './components/ValidationSteps';
import { PairwiseCriteriaStep, PairwiseSubcriteriaStep, PairwiseAlternativesStep } from './components/PairwiseSteps';
import OpenQuestionsStep from './components/OpenQuestionsStep';
import ReviewStep from './components/ReviewStep';
import SuccessStep from './components/SuccessStep';

// AHP data and helper
import { CRITERIA, SUBCRITERIA, ALTERNATIVES } from './data/constants';
import { generatePairwiseCombinations } from './utils/ahp';

// STORAGE KEY
const LOCAL_STORAGE_KEY = 'ahp_eaudit_survey_state';

// PLACEHOLDER GOOGLE SHEETS WEB APP URL
// Ganti nilai di bawah ini dengan URL hasil deployment Google Apps Script Anda
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbymCFgzQaxRra49cu-UwgdqqaVlUMJolyCVThFSpd1zbaeM8k8U4gANsIbWRbcEbVY/exec";

export default function App() {
  // 1. STATE INITIALIZATION
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({});
  const [consentChecked, setConsentChecked] = useState(false);
  const [validationAnswers, setValidationAnswers] = useState({
    criteria: {},
    subcriteria: {},
    alternatives: {}
  });
  const [answers, setAnswers] = useState({
    criteria: {},
    subcriteria: {},
    alternatives: {}
  });
  const [openAnswers, setOpenAnswers] = useState({});
  const [submissionId, setSubmissionId] = useState('');
  const [hasSavedData, setHasSavedData] = useState(false);
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 2. WIZARD STEPS DEFINITION
  const STEPS = [
    { id: 'landing', label: 'Mulai' },
    { id: 'consent', label: 'Persetujuan' },
    { id: 'profile', label: 'Profil Responden' },
    { id: 'guide', label: 'Panduan AHP' },
    { id: 'val_criteria', label: 'Val. Kriteria' },
    { id: 'val_subcriteria', label: 'Val. Subkriteria' },
    { id: 'val_alternatives', label: 'Val. Alternatif' },
    { id: 'pw_criteria', label: 'Pairwise Kriteria' },
    { id: 'pw_subcriteria', label: 'Pairwise Subkriteria' },
    { id: 'pw_alternatives', label: 'Pairwise Alternatif' },
    { id: 'open_questions', label: 'Pertanyaan Terbuka' },
    { id: 'review', label: 'Review & Submit' },
    { id: 'success', label: 'Selesai' }
  ];

  // Generate unique submission ID
  const generateSubmissionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'AHP-EAUDIT-';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 3. AUTOSAVE EFFECT & LOAD
  useEffect(() => {
    // Check if there is saved state on mount
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setHasSavedData(true);
    }
    // Set a submission ID if none exists
    setSubmissionId(generateSubmissionId());
  }, []);

  // Save state on change
  useEffect(() => {
    if (step > 0 && step < STEPS.length - 1) {
      const stateToSave = {
        step,
        profile,
        consentChecked,
        validationAnswers,
        answers,
        openAnswers,
        submissionId
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [step, profile, consentChecked, validationAnswers, answers, openAnswers, submissionId]);

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        setStep(state.step || 0);
        setProfile(state.profile || {});
        setConsentChecked(state.consentChecked || false);
        setValidationAnswers(state.validationAnswers || { criteria: {}, subcriteria: {}, alternatives: {} });
        setAnswers(state.answers || { criteria: {}, subcriteria: {}, alternatives: {} });
        setOpenAnswers(state.openAnswers || {});
        setSubmissionId(state.submissionId || generateSubmissionId());
        setHasSavedData(false);
      }
    } catch (e) {
      console.error("Gagal memuat sesi simpanan: ", e);
      alert("Gagal memuat sesi pengisian sebelumnya.");
    }
  };

  const clearSavedState = () => {
    if (confirm("Apakah Anda yakin ingin menghapus data pengisian sebelumnya dan memulai dari awal?")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setProfile({});
      setConsentChecked(false);
      setValidationAnswers({ criteria: {}, subcriteria: {}, alternatives: {} });
      setAnswers({ criteria: {}, subcriteria: {}, alternatives: {} });
      setOpenAnswers({});
      setSubmissionId(generateSubmissionId());
      setHasSavedData(false);
      setStep(1); // Jump to consent
    }
  };

  // Navigation handlers
  const handleNext = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));
  const jumpToStep = (targetStep) => {
    // Only allow jumping back, or jumping forward to steps already completed
    if (targetStep < step || step === 11) {
      setStep(targetStep);
    }
  };

  // 4. SUBMISSION TO GOOGLE SHEETS
  const handleSubmit = async (ahpResults) => {
    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      submissionId,
      profile,
      validation: validationAnswers,
      pairwise: answers,
      openQuestions: openAnswers,
      results: {
        criteriaCR: ahpResults?.criteria?.cr,
        globalWeights: ahpResults?.globalAlternatives
      }
    };

    // Jika URL masih menggunakan placeholder, ingatkan user tapi simulasikan sukses
    if (GOOGLE_SHEET_WEBAPP_URL.includes("MASUKKAN_URL_GOOGLE_APPS_SCRIPT")) {
      setTimeout(() => {
        setIsSubmitting(false);
        // Hapus local storage karena pengisian selesai
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setStep(12); // Pindah ke Success
        alert("MODE SIMULASI: Data berhasil diproses lokal! (Anda melihat ini karena URL Google Apps Script belum dikonfigurasi. Anda dapat mengunduh data CSV/JSON di halaman sukses.)");
      }, 1500);
      return;
    }

    try {
      const response = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Apps script requires text/plain or no-cors sometimes to bypass preflight issues
        },
        body: JSON.stringify(payload)
      });

      const resText = await response.text();
      let resJson;
      try {
        resJson = JSON.parse(resText);
      } catch (e) {
        throw new Error("Respon server bukan format JSON: " + resText.slice(0, 100));
      }

      if (resJson.status === 'success') {
        setIsSubmitting(false);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setStep(12); // Pindah ke Success
      } else {
        throw new Error(resJson.message || "Terjadi kesalahan di server backend.");
      }

    } catch (err) {
      console.error("Submit Error: ", err);
      setIsSubmitting(false);
      setSubmitError(err.message || 'Koneksi jaringan terputus atau server Apps Script mengembalikan error.');
    }
  };

  // 5. PROGRESS & COMPLETENESS TRACKERS FOR SIDEBAR
  const checkStepStatus = (stepId) => {
    switch (stepId) {
      case 'landing': return true;
      case 'consent': return consentChecked;
      case 'profile':
        return !!(profile.nama && profile.instansi && profile.jabatan && profile.keahlian?.length > 0 && profile.pengalaman && profile.pernah_e_audit && profile.pernah_tools && profile.pemahaman_ahp);
      case 'guide': return true;
      case 'val_criteria':
        return CRITERIA.every(c => validationAnswers.criteria?.[c.code]?.rating);
      case 'val_subcriteria':
        return SUBCRITERIA.every(s => validationAnswers.subcriteria?.[s.code]?.rating);
      case 'val_alternatives':
        return ALTERNATIVES.every(a => validationAnswers.alternatives?.[a.code]?.rating);
      case 'pw_criteria':
        return Object.keys(answers.criteria || {}).filter(k => answers.criteria[k]?.selected).length === 15;
      case 'pw_subcriteria':
        return Object.keys(answers.subcriteria || {}).filter(k => answers.subcriteria[k]?.selected).length === 18;
      case 'pw_alternatives':
        return Object.keys(answers.alternatives || {}).filter(k => answers.alternatives[k]?.selected).length === 108;
      case 'open_questions':
        return true; // Optional
      case 'review': return false;
      default: return false;
    }
  };

  // Render correct content for current step
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <LandingStep
            onNext={handleNext}
            hasSavedData={hasSavedData}
            onLoadSaved={loadSavedState}
            onClearSaved={clearSavedState}
          />
        );
      case 1:
        return (
          <ConsentStep
            onNext={handleNext}
            onPrev={handlePrev}
            consentChecked={consentChecked}
            setConsentChecked={setConsentChecked}
          />
        );
      case 2:
        return (
          <ProfileStep
            onNext={handleNext}
            onPrev={handlePrev}
            profile={profile}
            setProfile={setProfile}
          />
        );
      case 3:
        return <AhpGuideStep onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return (
          <CriteriaValidationStep
            onNext={handleNext}
            onPrev={handlePrev}
            validationAnswers={validationAnswers}
            setValidationAnswers={setValidationAnswers}
          />
        );
      case 5:
        return (
          <SubcriteriaValidationStep
            onNext={handleNext}
            onPrev={handlePrev}
            validationAnswers={validationAnswers}
            setValidationAnswers={setValidationAnswers}
          />
        );
      case 6:
        return (
          <AlternativesValidationStep
            onNext={handleNext}
            onPrev={handlePrev}
            validationAnswers={validationAnswers}
            setValidationAnswers={setValidationAnswers}
          />
        );
      case 7:
        return (
          <PairwiseCriteriaStep
            onNext={handleNext}
            onPrev={handlePrev}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case 8:
        return (
          <PairwiseSubcriteriaStep
            onNext={handleNext}
            onPrev={handlePrev}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case 9:
        return (
          <PairwiseAlternativesStep
            onNext={handleNext}
            onPrev={handlePrev}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case 10:
        return (
          <OpenQuestionsStep
            onNext={handleNext}
            onPrev={handlePrev}
            openAnswers={openAnswers}
            setOpenAnswers={setOpenAnswers}
          />
        );
      case 11:
        return (
          <ReviewStep
            onPrev={handlePrev}
            profile={profile}
            validationAnswers={validationAnswers}
            answers={answers}
            openAnswers={openAnswers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
            jumpToStep={jumpToStep}
          />
        );
      case 12:
        return (
          <SuccessStep
            profile={profile}
            validationAnswers={validationAnswers}
            answers={answers}
            openAnswers={openAnswers}
            submissionId={submissionId}
          />
        );
      default:
        return <div>Langkah tidak valid.</div>;
    }
  };

  // Calculate global progress percentage
  const calculateProgress = () => {
    if (step === 0) return 0;
    if (step === STEPS.length - 1) return 100;
    return Math.round((step / (STEPS.length - 2)) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER BAR */}
      <header className="bg-blue-950 text-white border-b border-blue-900 shadow-sm py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-200" />
            <span className="font-extrabold text-sm md:text-base tracking-wide uppercase">
              e-Audit AHP Decision Stack
            </span>
          </div>
          {step > 0 && step < STEPS.length - 1 && (
            <div className="flex items-center gap-2 text-[10px] md:text-xs bg-blue-900/60 px-3 py-1 rounded-full text-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Autosave Aktif
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* SIDEBAR ON DESKTOP */}
        {step > 0 && step < STEPS.length - 1 && (
          <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-5 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto shrink-0 hidden md:block">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Tahapan Kuesioner
            </h3>
            <nav className="space-y-1.5">
              {STEPS.map((s, idx) => {
                if (idx === 0 || idx === STEPS.length - 1) return null; // Skip landing and success
                const isActive = step === idx;
                const isComplete = checkStepStatus(s.id);
                
                return (
                  <button
                    key={s.id}
                    onClick={() => jumpToStep(idx)}
                    disabled={step !== 11 && idx > step} // Disable forward navigation unless reviewing
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-sm font-bold'
                        : isComplete
                        ? 'text-slate-800 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-50'
                    } ${idx > step && step !== 11 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="truncate">{idx}. {s.label}</span>
                    {isComplete && (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-green-600'}`} />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 md:p-8 flex flex-col">
          {/* Progress bar at the top of content */}
          {step > 0 && step < STEPS.length - 1 && (
            <div className="mb-6 max-w-3xl mx-auto w-full">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                <span>Progress Pengisian</span>
                <span className="text-blue-900">{calculateProgress()}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          )}

          {/* Render active step */}
          <div className="flex-1">
            {renderStepContent()}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-250 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p>Penelitian Penentuan Data Analytics Stack untuk e-Audit Pajak &copy; 2026</p>
          <div className="flex items-center gap-3">
            <span>Metode AHP</span>
            <span>&bull;</span>
            <span>Google Sheets Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
