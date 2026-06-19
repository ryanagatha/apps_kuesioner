import React from 'react';
import { HelpCircle } from 'lucide-react';
import { OPEN_QUESTIONS } from '../data/constants';

export default function OpenQuestionsStep({ onNext, onPrev, openAnswers, setOpenAnswers }) {
  
  const handleTextChange = (id, val) => {
    setOpenAnswers(prev => ({
      ...prev,
      [id]: val
    }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-3 border border-blue-150 shadow-sm">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pertanyaan Terbuka</h2>
        <p className="text-slate-500">Berikan masukan kualitatif untuk melengkapi penilaian kuantitatif Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 mb-8">
        {OPEN_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="space-y-2">
            <label className="block text-sm font-semibold text-slate-705 leading-snug">
              {idx + 1}. {q.question}
            </label>
            <textarea
              value={openAnswers[q.id] || ''}
              onChange={(e) => handleTextChange(q.id, e.target.value)}
              placeholder="Ketik jawaban atau tanggapan Anda di sini..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-blue-900 focus:border-blue-900 transition duration-150"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5"
        >
          Simpan & Review
        </button>
      </div>
    </div>
  );
}
