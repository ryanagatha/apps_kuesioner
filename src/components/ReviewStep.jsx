import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, ArrowLeft, Send, Loader } from 'lucide-react';
import { CRITERIA, SUBCRITERIA, ALTERNATIVES } from '../data/constants';
import { evaluateAHPSection, generatePairwiseCombinations } from '../utils/ahp';

export default function ReviewStep({
  onPrev,
  onNext,
  profile,
  validationAnswers,
  answers,
  openAnswers,
  onSubmit,
  isSubmitting,
  submitError,
  jumpToStep
}) {
  const [showAHPResults, setShowAHPResults] = useState(false);

  // 1. COMPLETENESS CHECK
  const checkCompleteness = () => {
    const status = {
      profile: false,
      validationCriteria: false,
      validationSubcriteria: false,
      validationAlternatives: false,
      pairwiseCriteria: false,
      pairwiseSubcriteria: false,
      pairwiseAlternatives: false,
      errors: []
    };

    // Profile check
    if (profile.nama?.trim() && profile.instansi?.trim() && profile.jabatan?.trim() && 
        profile.keahlian?.length > 0 && profile.pengalaman && profile.pernah_e_audit && 
        profile.pernah_tools && profile.pemahaman_ahp) {
      status.profile = true;
    } else {
      status.errors.push({ step: 2, label: 'Data Profil Responden belum lengkap.' });
    }

    // Validation check
    const critValCount = Object.keys(validationAnswers.criteria || {}).filter(k => validationAnswers.criteria[k]?.rating).length;
    if (critValCount === CRITERIA.length) status.validationCriteria = true;
    else status.errors.push({ step: 4, label: 'Validasi Kriteria belum selesai.' });

    const subValCount = Object.keys(validationAnswers.subcriteria || {}).filter(k => validationAnswers.subcriteria[k]?.rating).length;
    if (subValCount === SUBCRITERIA.length) status.validationSubcriteria = true;
    else status.errors.push({ step: 5, label: 'Validasi Subkriteria belum selesai.' });

    const altValCount = Object.keys(validationAnswers.alternatives || {}).filter(k => validationAnswers.alternatives[k]?.rating).length;
    if (altValCount === ALTERNATIVES.length) status.validationAlternatives = true;
    else status.errors.push({ step: 6, label: 'Validasi Alternatif belum selesai.' });

    // Pairwise check
    const critPairCount = Object.keys(answers.criteria || {}).filter(k => answers.criteria[k]?.selected).length;
    if (critPairCount === 15) status.pairwiseCriteria = true;
    else status.errors.push({ step: 7, label: `Perbandingan Kriteria baru terisi ${critPairCount} dari 15.` });

    const subPairCount = Object.keys(answers.subcriteria || {}).filter(k => answers.subcriteria[k]?.selected).length;
    if (subPairCount === 18) status.pairwiseSubcriteria = true;
    else status.errors.push({ step: 8, label: `Perbandingan Subkriteria baru terisi ${subPairCount} dari 18.` });

    const altPairCount = Object.keys(answers.alternatives || {}).filter(k => answers.alternatives[k]?.selected).length;
    if (altPairCount === 108) status.pairwiseAlternatives = true;
    else status.errors.push({ step: 9, label: `Perbandingan Alternatif Stack baru terisi ${altPairCount} dari 108.` });

    const isComplete = status.errors.length === 0;
    return { isComplete, status };
  };

  const { isComplete, status } = checkCompleteness();

  // 2. AHP WEIGHT SYNTHESIS
  const runAHPSynthesis = () => {
    try {
      // a. Criteria Weights
      const critCodes = CRITERIA.map(c => c.code);
      const critEval = evaluateAHPSection(critCodes, answers.criteria || {});

      // b. Subcriteria Weights (grouped by parent)
      const subEvalMap = {};
      CRITERIA.forEach(c => {
        const subs = SUBCRITERIA.filter(s => s.parent === c.code).map(s => s.code);
        const subAnswers = {};
        // extract relevant answers for this criterion's subs
        const pairs = generatePairwiseCombinations(SUBCRITERIA.filter(s => s.parent === c.code));
        pairs.forEach(p => {
          const key = `${p.left.code}-${p.right.code}`;
          subAnswers[key] = answers.subcriteria?.[key];
        });
        subEvalMap[c.code] = evaluateAHPSection(subs, subAnswers);
      });

      // c. Alternatives Weights (for all 18 subcriteria)
      const altCodes = ALTERNATIVES.map(a => a.code);
      const altEvalMap = {};
      SUBCRITERIA.forEach(s => {
        const subAnswers = {};
        const pairs = generatePairwiseCombinations(ALTERNATIVES);
        pairs.forEach(p => {
          const key = `alt-${s.code}-${p.left.code}-${p.right.code}`;
          // map to standard left-right keys
          subAnswers[`${p.left.code}-${p.right.code}`] = answers.alternatives?.[key];
        });
        altEvalMap[s.code] = evaluateAHPSection(altCodes, subAnswers);
      });

      // d. Synthesis: Global Weights
      const globalAltWeights = {
        'Stack A': 0,
        'Stack B': 0,
        'Stack C': 0,
        'Stack D': 0
      };

      const globalSubWeightsMap = {};

      SUBCRITERIA.forEach(s => {
        const wCrit = critEval.weightsMap[s.parent] || 0;
        const wSubLocal = subEvalMap[s.parent]?.weightsMap[s.code] || 0;
        const wSubGlobal = wCrit * wSubLocal;
        
        globalSubWeightsMap[s.code] = wSubGlobal;

        // Add to global alternative weights
        ALTERNATIVES.forEach(alt => {
          const wAltLocal = altEvalMap[s.code]?.weightsMap[alt.code] || 0;
          globalAltWeights[alt.code] += wSubGlobal * wAltLocal;
        });
      });

      return {
        criteria: critEval,
        subcriteria: subEvalMap,
        alternatives: altEvalMap,
        globalAlternatives: globalAltWeights,
        globalSubcriteria: globalSubWeightsMap
      };
    } catch (e) {
      console.error("AHP Calculation Error: ", e);
      return null;
    }
  };

  const results = isComplete ? runAHPSynthesis() : null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Kirim Kuesioner</h2>
        <p className="text-slate-500">Periksa kembali kelengkapan pengisian sebelum melakukan submit data</p>
      </div>

      {/* Completion Status Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 text-base mb-4 pb-2 border-b border-slate-100">
          Status Kelengkapan Pengisian
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusItem label="Profil Responden" checked={status.profile} onJump={() => jumpToStep(2)} />
          <StatusItem label="Validasi Kriteria" checked={status.validationCriteria} onJump={() => jumpToStep(4)} />
          <StatusItem label="Validasi Subkriteria" checked={status.validationSubcriteria} onJump={() => jumpToStep(5)} />
          <StatusItem label="Validasi Alternatif" checked={status.validationAlternatives} onJump={() => jumpToStep(6)} />
          <StatusItem label="Pairwise Kriteria" checked={status.pairwiseCriteria} onJump={() => jumpToStep(7)} />
          <StatusItem label="Pairwise Subkriteria" checked={status.pairwiseSubcriteria} onJump={() => jumpToStep(8)} />
          <StatusItem label="Pairwise Alternatif" checked={status.pairwiseAlternatives} onJump={() => jumpToStep(9)} />
        </div>

        {/* Warning if Incomplete */}
        {!isComplete && (
          <div className="bg-rose-50 border border-rose-250 rounded-xl p-4 mt-6">
            <h4 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Ada Bagian Yang Belum Lengkap
            </h4>
            <ul className="list-disc pl-5 mt-2 text-xs md:text-sm text-rose-800 space-y-1">
              {status.errors.map((err, i) => (
                <li key={i}>
                  <button
                    onClick={() => jumpToStep(err.step)}
                    className="underline text-left hover:text-rose-950 font-semibold"
                  >
                    {err.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isComplete && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6 flex gap-3 text-xs md:text-sm text-green-800">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <strong>Kuesioner Selesai!</strong> Seluruh data kuesioner Anda telah terisi secara lengkap.
              Sistem telah melakukan kalkulasi model AHP Anda secara lokal.
            </div>
          </div>
        )}
      </div>

      {/* AHP Calculated Weights Preview */}
      {isComplete && results && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-850 text-base">
              Hasil Kalkulasi AHP Anda (Pratinjau Lokal)
            </h3>
            <button
              onClick={() => setShowAHPResults(!showAHPResults)}
              className="text-xs font-bold text-blue-900 hover:underline"
            >
              {showAHPResults ? 'Sembunyikan detail' : 'Tampilkan hasil'}
            </button>
          </div>

          {showAHPResults ? (
            <div className="space-y-6">
              {/* Consistency ratios checklist */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tingkat Konsistensi (Consistency Ratio / CR)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex justify-between p-1.5 border-b border-slate-200">
                    <span>CR Kriteria Utama:</span>
                    <CRBadge cr={results.criteria.cr} />
                  </div>
                  {CRITERIA.map(c => (
                    <div key={c.code} className="flex justify-between p-1.5 border-b border-slate-200">
                      <span>CR Subkriteria {c.code}:</span>
                      <CRBadge cr={results.subcriteria[c.code]?.cr} />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed">
                  * Batas toleransi konsistensi AHP adalah CR &le; 0.10. Jika CR &gt; 0.10, perbandingan dianggap kurang konsisten, namun data Anda tetap akan diterima dan disimpan.
                </p>
              </div>

              {/* Criteria local weights */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bobot Prioritas Kriteria Utama</h4>
                <div className="space-y-3">
                  {CRITERIA.map((c, idx) => {
                    const weight = results.criteria.weights[idx] || 0;
                    return (
                      <div key={c.code} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>{c.code} - {c.name}</span>
                          <span>{(weight * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-900 h-full rounded-full transition-all duration-300"
                            style={{ width: `${weight * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Synthesized Global Alternative weights */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Peringkat Akhir Alternatif Data Analytics Stack (Hasil Sintesis Global)
                </h4>
                <div className="space-y-3">
                  {ALTERNATIVES.map((alt) => {
                    const weight = results.globalAlternatives[alt.code] || 0;
                    return (
                      <div key={alt.code} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-800">
                          <div>
                            <span className="font-extrabold text-blue-900">{alt.code}</span> - {alt.name}
                          </div>
                          <span className="font-extrabold text-blue-950">{(weight * 100).toFixed(2)}%</span>
                        </div>
                        <div className="text-[10px] text-slate-500 italic mb-1">{alt.components}</div>
                        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${weight * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic text-center py-2">
              Kalkulasi AHP lokal sukses. Klik "Tampilkan hasil" di atas untuk melihat visualisasi bobot prioritas pilihan Anda.
            </p>
          )}
        </div>
      )}

      {/* Submission Errors */}
      {submitError && (
        <div className="bg-rose-50 border border-rose-250 rounded-xl p-4 mb-6 flex gap-2.5 text-xs md:text-sm text-rose-800">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong>Gagal mengirim data:</strong> {submitError}.
            <br />
            Silakan coba kirim ulang. Jika terus gagal, pastikan Anda terhubung ke internet. Anda juga dapat mengunduh cadangan JSON/CSV di halaman sukses jika submit error terus terjadi.
          </div>
        </div>
      )}

      {/* Navigation & Submit Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <button
          onClick={() => onSubmit(results)}
          disabled={!isComplete || isSubmitting}
          className={`px-7 py-3.5 font-bold rounded-xl shadow-md transition duration-150 flex items-center gap-2 text-white ${
            isComplete && !isSubmitting
              ? 'bg-blue-900 hover:bg-blue-950 cursor-pointer'
              : 'bg-slate-350 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Mengirim Data...
            </>
          ) : (
            <>
              Kirim Jawaban
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Subcomponents for ReviewStep
function StatusItem({ label, checked, onJump }) {
  return (
    <button
      onClick={onJump}
      className={`p-3 rounded-xl border text-center text-xs font-semibold transition duration-150 cursor-pointer flex flex-col items-center justify-center gap-1.5 h-full ${
        checked
          ? 'border-green-200 bg-green-50/50 text-green-950'
          : 'border-rose-150 bg-rose-50/30 text-rose-900 hover:bg-rose-50/60'
      }`}
    >
      <span className="leading-snug">{label}</span>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${checked ? 'bg-green-150 text-green-900' : 'bg-rose-150 text-rose-800'}`}>
        {checked ? 'Lengkap' : 'Belum'}
      </span>
    </button>
  );
}

function CRBadge({ cr }) {
  if (cr === undefined || cr === null) return <span className="text-slate-400 font-bold">N/A</span>;
  const isOk = cr <= 0.10;
  return (
    <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${isOk ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
      {cr.toFixed(4)} ({isOk ? 'Konsisten' : 'Kurang Konsisten'})
    </span>
  );
}
