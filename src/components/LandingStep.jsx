import React from 'react';
import { ClipboardList, Award, ArrowRight, Play, BookOpen } from 'lucide-react';
import { CRITERIA, ALTERNATIVES } from '../data/constants';

export default function LandingStep({ onNext, hasSavedData, onLoadSaved, onClearSaved }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-4 border border-blue-100 shadow-sm">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Pemilihan Data Analytics Stack untuk e-Audit dalam Pemeriksaan Pajak
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Kuesioner Penelitian Pengambilan Keputusan Pakar berbasis <strong>Analytic Hierarchy Process (AHP)</strong>
        </p>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-5 h-5 text-blue-900" />
          Pengantar Penelitian
        </h2>
        <div className="prose text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
          <p>
            Selamat datang! Penelitian ini bertujuan untuk menentukan prioritas kriteria dan mengevaluasi alternatif
            <strong> data analytics stack</strong> yang paling sesuai untuk mendukung pelaksanaan <strong>e-Audit</strong> dalam pemeriksaan pajak di Indonesia.
          </p>
          <p>
            Mengingat kompleksitas audit data, kami mengundang Bapak/Ibu sebagai <strong>Pakar atau Praktisi</strong> di bidang pemeriksaan pajak,
            e-Audit, data analytics, atau sistem informasi untuk memberikan penilaian profesional.
          </p>
          <p>
            Metode yang digunakan adalah <strong>AHP (Analytic Hierarchy Process)</strong>, di mana Anda akan diminta untuk menilai
            relevansi kriteria, serta membandingkan kriteria, subkriteria, dan alternatif secara berpasangan (pairwise comparison).
          </p>
        </div>
      </div>

      {/* Model Overview: Criteria & Alternatives */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Criteria Summary */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
          <h3 className="font-bold text-slate-850 mb-3 text-sm tracking-wider uppercase text-blue-950">
            6 Kriteria Evaluasi
          </h3>
          <ul className="space-y-2.5">
            {CRITERIA.map((c, i) => (
              <li key={c.code} className="flex gap-3 items-start text-xs md:text-sm text-slate-700">
                <span className="font-semibold text-blue-900 bg-blue-100/60 px-1.5 py-0.5 rounded text-xs">
                  {c.code}
                </span>
                <div>
                  <strong className="text-slate-800">{c.name}</strong>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Alternatives Summary */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
          <h3 className="font-bold text-slate-850 mb-3 text-sm tracking-wider uppercase text-blue-950">
            4 Alternatif Stack
          </h3>
          <ul className="space-y-3">
            {ALTERNATIVES.map((a) => (
              <li key={a.code} className="text-xs md:text-sm text-slate-700">
                <div className="font-bold text-slate-850 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
                  {a.code}: {a.name}
                </div>
                <div className="text-slate-500 pl-3 text-xs italic mt-0.5">
                  {a.components}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Saved Session Notification */}
      {hasSavedData && (
        <div className="bg-amber-50 border border-amber-250 rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-amber-900 text-sm md:text-base flex items-center gap-1.5">
              Sesi Pengisian Ditemukan!
            </h4>
            <p className="text-amber-700 text-xs md:text-sm mt-1">
              Anda memiliki data pengisian sebelumnya yang tersimpan di browser ini.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClearSaved}
              className="px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 rounded-xl transition duration-150"
            >
              Mulai Baru
            </button>
            <button
              onClick={onLoadSaved}
              className="px-5 py-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5"
            >
              Lanjutkan Pengisian
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center">
        {!hasSavedData && (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-2xl shadow-md transition duration-200 group transform hover:-translate-y-0.5"
          >
            Mulai Pengisian Kuesioner
            <Play className="w-5 h-5 fill-current text-white/90 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
