import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { CRITERIA, SUBCRITERIA, ALTERNATIVES } from '../data/constants';

// Reusable Star Rating or Radio Grid component
function RelevanceRating({ value, onChange, error }) {
  const options = [
    { score: 1, label: 'Tidak Relevan' },
    { score: 2, label: 'Kurang Relevan' },
    { score: 3, label: 'Cukup Relevan' },
    { score: 4, label: 'Relevan' },
    { score: 5, label: 'Sangat Relevan' }
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.score}
            type="button"
            onClick={() => onChange(opt.score)}
            className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-xl border transition duration-150 cursor-pointer ${
              value === opt.score
                ? 'border-blue-900 bg-blue-50 text-blue-900 shadow-sm'
                : 'border-slate-200 text-slate-700 bg-white hover:border-slate-350'
            }`}
          >
            {opt.score} - {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-rose-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}

// 1. CRITERIA VALIDATION STEP
export function CriteriaValidationStep({ onNext, onPrev, validationAnswers, setValidationAnswers }) {
  const [errors, setErrors] = useState({});

  const handleRatingChange = (code, rating) => {
    setValidationAnswers(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [code]: { ...prev.criteria?.[code], rating }
      }
    }));
    if (errors[code]) {
      setErrors(prev => ({ ...prev, [code]: '' }));
    }
  };

  const handleNotesChange = (code, notes) => {
    setValidationAnswers(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [code]: { ...prev.criteria?.[code], notes }
      }
    }));
  };

  const handleNext = () => {
    const newErrors = {};
    CRITERIA.forEach(c => {
      if (!validationAnswers.criteria?.[c.code]?.rating) {
        newErrors[c.code] = 'Pilih penilaian relevansi.';
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Validasi Relevansi Kriteria</h2>
        <p className="text-slate-500">Nilai tingkat relevansi dari 6 kriteria utama e-Audit</p>
      </div>

      <div className="space-y-6 mb-8">
        {CRITERIA.map((c) => {
          const item = validationAnswers.criteria?.[c.code] || {};
          return (
            <div key={c.code} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex gap-2.5 items-start">
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-sm shrink-0 mt-0.5">
                  {c.code}
                </span>
                <div>
                  <h3 className="font-bold text-slate-850 text-base">{c.name}</h3>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">{c.description}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tingkat Relevansi <span className="text-rose-500">*</span>
                </label>
                <RelevanceRating
                  value={item.rating}
                  onChange={(rating) => handleRatingChange(c.code, rating)}
                  error={errors[c.code]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Catatan / Saran Perbaikan (Opsional)
                </label>
                <textarea
                  value={item.notes || ''}
                  onChange={(e) => handleNotesChange(c.code, e.target.value)}
                  placeholder="Berikan saran jika kriteria kurang relevan atau memerlukan perbaikan redaksional..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-blue-900 focus:border-blue-900"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150"
        >
          Simpan & Lanjut
        </button>
      </div>
    </div>
  );
}

// 2. SUBCRITERIA VALIDATION STEP
export function SubcriteriaValidationStep({ onNext, onPrev, validationAnswers, setValidationAnswers }) {
  const [activeTab, setActiveTab] = useState('K1');
  const [errors, setErrors] = useState({});

  const handleRatingChange = (code, rating) => {
    setValidationAnswers(prev => ({
      ...prev,
      subcriteria: {
        ...prev.subcriteria,
        [code]: { ...prev.subcriteria?.[code], rating }
      }
    }));
    if (errors[code]) {
      setErrors(prev => ({ ...prev, [code]: '' }));
    }
  };

  const handleNotesChange = (code, notes) => {
    setValidationAnswers(prev => ({
      ...prev,
      subcriteria: {
        ...prev.subcriteria,
        [code]: { ...prev.subcriteria?.[code], notes }
      }
    }));
  };

  const handleNext = () => {
    const newErrors = {};
    SUBCRITERIA.forEach(sub => {
      if (!validationAnswers.subcriteria?.[sub.code]?.rating) {
        newErrors[sub.code] = 'Pilih penilaian relevansi.';
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      setErrors(newErrors);
      // Find the parent of the first error and switch to its tab
      const firstErrorSub = SUBCRITERIA.find(sub => newErrors[sub.code]);
      if (firstErrorSub) {
        setActiveTab(firstErrorSub.parent);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Group subcriteria by active parent
  const filteredSubcriteria = SUBCRITERIA.filter(sub => sub.parent === activeTab);

  // Check which tabs are fully answered
  const isTabComplete = (parentCode) => {
    const subs = SUBCRITERIA.filter(s => s.parent === parentCode);
    return subs.every(s => validationAnswers.subcriteria?.[s.code]?.rating);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Validasi Relevansi Subkriteria</h2>
        <p className="text-slate-500">Nilai tingkat relevansi dari 18 subkriteria (Dikelompokkan berdasarkan Kriteria)</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 border-b border-slate-200 gap-1.5 scrollbar-thin">
        {CRITERIA.map((c) => {
          const isActive = activeTab === c.code;
          const complete = isTabComplete(c.code);
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setActiveTab(c.code)}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition duration-150 whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0 ${
                isActive
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {c.code}
              {complete && <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-green-600'}`} />}
            </button>
          );
        })}
      </div>

      {/* Tab Context Info */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-6">
        <div className="font-bold text-slate-800 text-xs tracking-wider uppercase text-blue-950">
          Kriteria Induk: {activeTab}
        </div>
        <div className="font-semibold text-slate-700 text-sm mt-1">
          {CRITERIA.find(c => c.code === activeTab)?.name}
        </div>
        <div className="text-slate-500 text-xs mt-0.5">
          {CRITERIA.find(c => c.code === activeTab)?.description}
        </div>
      </div>

      {/* Subcriteria List */}
      <div className="space-y-6 mb-8">
        {filteredSubcriteria.map((sub) => {
          const item = validationAnswers.subcriteria?.[sub.code] || {};
          return (
            <div key={sub.code} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex gap-2.5 items-start">
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-sm shrink-0 mt-0.5">
                  {sub.code}
                </span>
                <div>
                  <h3 className="font-bold text-slate-850 text-base">{sub.name}</h3>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">{sub.description}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tingkat Relevansi <span className="text-rose-500">*</span>
                </label>
                <RelevanceRating
                  value={item.rating}
                  onChange={(rating) => handleRatingChange(sub.code, rating)}
                  error={errors[sub.code]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Catatan / Saran Perbaikan (Opsional)
                </label>
                <textarea
                  value={item.notes || ''}
                  onChange={(e) => handleNotesChange(sub.code, e.target.value)}
                  placeholder="Berikan saran jika subkriteria kurang relevan atau memerlukan perbaikan redaksional..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-blue-900 focus:border-blue-900"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Warning */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex gap-2.5 text-xs md:text-sm text-rose-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <strong>Peringatan:</strong> Ada subkriteria yang belum diisi. Periksa seluruh tab kriteria di atas.
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150"
        >
          Simpan & Lanjut
        </button>
      </div>
    </div>
  );
}

// 3. ALTERNATIVES VALIDATION STEP
export function AlternativesValidationStep({ onNext, onPrev, validationAnswers, setValidationAnswers }) {
  const [errors, setErrors] = useState({});

  const handleRatingChange = (code, rating) => {
    setValidationAnswers(prev => ({
      ...prev,
      alternatives: {
        ...prev.alternatives,
        [code]: { ...prev.alternatives?.[code], rating }
      }
    }));
    if (errors[code]) {
      setErrors(prev => ({ ...prev, [code]: '' }));
    }
  };

  const handleNotesChange = (code, notes) => {
    setValidationAnswers(prev => ({
      ...prev,
      alternatives: {
        ...prev.alternatives,
        [code]: { ...prev.alternatives?.[code], notes }
      }
    }));
  };

  const handleNext = () => {
    const newErrors = {};
    ALTERNATIVES.forEach(alt => {
      if (!validationAnswers.alternatives?.[alt.code]?.rating) {
        newErrors[alt.code] = 'Pilih penilaian relevansi.';
      }
    });

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Validasi Relevansi Alternatif Stack</h2>
        <p className="text-slate-500">Nilai tingkat relevansi dari 4 alternatif data analytics stack</p>
      </div>

      <div className="space-y-6 mb-8">
        {ALTERNATIVES.map((alt) => {
          const item = validationAnswers.alternatives?.[alt.code] || {};
          return (
            <div key={alt.code} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex gap-2.5 items-start">
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-sm shrink-0 mt-0.5">
                  {alt.code}
                </span>
                <div>
                  <h3 className="font-bold text-slate-850 text-base">{alt.name}</h3>
                  <p className="text-blue-900/80 font-bold text-xs italic mt-1">{alt.components}</p>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">{alt.description}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tingkat Relevansi <span className="text-rose-500">*</span>
                </label>
                <RelevanceRating
                  value={item.rating}
                  onChange={(rating) => handleRatingChange(alt.code, rating)}
                  error={errors[alt.code]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Catatan / Saran Perbaikan (Opsional)
                </label>
                <textarea
                  value={item.notes || ''}
                  onChange={(e) => handleNotesChange(alt.code, e.target.value)}
                  placeholder="Berikan saran jika alternatif stack ini kurang realistis atau memerlukan penyesuaian komponen..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-blue-900 focus:border-blue-900"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150"
        >
          Simpan & Lanjut
        </button>
      </div>
    </div>
  );
}
