import React, { useState } from 'react';
import { BookOpen, Info, Check, ArrowRight } from 'lucide-react';
import { SAATY_SCALE } from '../data/constants';

export default function AhpGuideStep({ onNext, onPrev }) {
  // Demonstration state
  const [demoSelected, setDemoSelected] = useState('left');
  const [demoIntensity, setDemoIntensity] = useState(5);

  const getDemoDescription = () => {
    if (demoSelected === 'equal') return 'Elemen A dan Elemen B sama penting / sama sesuai.';
    const side = demoSelected === 'left' ? 'Elemen A (Kiri)' : 'Elemen B (Kanan)';
    const otherSide = demoSelected === 'left' ? 'Elemen B' : 'Elemen A';
    
    let intensityText = '';
    switch (demoIntensity) {
      case 1: intensityText = 'sama penting dengan'; break;
      case 3: intensityText = 'sedikit lebih penting dibanding'; break;
      case 5: intensityText = 'jelas lebih penting/kuat dibanding'; break;
      case 7: intensityText = 'sangat jelas lebih penting/kuat dibanding'; break;
      case 9: intensityText = 'mutlak lebih penting dibanding'; break;
      default: intensityText = 'lebih penting (nilai antara) dibanding'; break;
    }
    
    return `${side} ${intensityText} ${otherSide}.`;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-3 border border-blue-150 shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Panduan Pengisian Skala AHP</h2>
        <p className="text-slate-500">Pelajari cara menilai perbandingan berpasangan (pairwise comparison) sebelum memulai</p>
      </div>

      {/* Concept Explanation */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-4 mb-6 text-slate-600 leading-relaxed text-sm md:text-base">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-900" />
          Konsep Perbandingan Berpasangan (Pairwise Comparison)
        </h3>
        <p>
          Dalam AHP, Anda tidak menilai kriteria satu per satu secara independen, melainkan membandingkan 
          <strong> dua elemen secara langsung (berpasangan)</strong> untuk menentukan mana yang lebih penting/sesuai dan seberapa besar intensitasnya.
        </p>
        <p>
          Anda akan disajikan dua opsi (Elemen A di kiri, Elemen B di kanan). Anda perlu menentukan:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
          <li><strong>Elemen mana yang lebih penting/sesuai?</strong> (Kiri, Kanan, atau Sama Penting).</li>
          <li><strong>Berapa tingkat kepentingannya?</strong> Menggunakan skala Saaty 1 hingga 9.</li>
        </ol>
      </div>

      {/* Saaty Scale Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 text-base mb-4">Tabel Skala Intensitas Saaty (1-9)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Skor</th>
                <th className="py-2.5 px-3">Definisi</th>
                <th className="py-2.5 px-3">Penjelasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SAATY_SCALE.filter(s => [1,3,5,7,9].includes(s.value)).map((s) => (
                <tr key={s.value} className="hover:bg-slate-50 transition duration-100">
                  <td className="py-3 px-3 font-bold text-blue-900 text-sm">{s.value}</td>
                  <td className="py-3 px-3 font-semibold">{s.label.split(' (')[0]}</td>
                  <td className="py-3 px-3 text-slate-550 italic text-xs">{s.description}</td>
                </tr>
              ))}
              <tr className="text-slate-500 italic text-xs">
                <td className="py-2.5 px-3 font-semibold text-slate-600">2, 4, 6, 8</td>
                <td className="py-2.5 px-3" colSpan="2">
                  Nilai-nilai antara (kompromi) jika Anda ragu-ragu di antara dua penilaian yang berdekatan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Demonstration */}
      <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-6 md:p-8 mb-8">
        <h3 className="font-bold text-blue-950 text-base mb-4 flex items-center gap-1.5">
          Simulasi Interaktif (Coba Klik)
        </h3>
        
        {/* Mock Pairwise Grid */}
        <div className="grid md:grid-cols-3 items-center gap-4 bg-white p-5 rounded-xl border border-blue-150 shadow-sm mb-4">
          {/* Left Element */}
          <button
            onClick={() => { setDemoSelected('left'); if (demoIntensity === 1) setDemoIntensity(3); }}
            className={`p-4 rounded-xl border text-center transition duration-150 cursor-pointer ${
              demoSelected === 'left'
                ? 'border-blue-900 bg-blue-50 text-blue-950 ring-2 ring-blue-900/10'
                : 'border-slate-200 text-slate-700 hover:border-slate-350'
            }`}
          >
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Elemen A</div>
            <div className="font-bold text-sm">Data Connectivity</div>
          </button>

          {/* Equal Button */}
          <button
            onClick={() => { setDemoSelected('equal'); setDemoIntensity(1); }}
            className={`p-3 rounded-xl border text-center transition duration-150 cursor-pointer ${
              demoSelected === 'equal'
                ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold'
                : 'border-slate-200 text-slate-700 hover:border-slate-350'
            }`}
          >
            <div className="text-xs font-semibold">Sama Penting</div>
            <div className="text-xs text-slate-400 mt-0.5">Skor = 1</div>
          </button>

          {/* Right Element */}
          <button
            onClick={() => { setDemoSelected('right'); if (demoIntensity === 1) setDemoIntensity(3); }}
            className={`p-4 rounded-xl border text-center transition duration-150 cursor-pointer ${
              demoSelected === 'right'
                ? 'border-blue-900 bg-blue-50 text-blue-950 ring-2 ring-blue-900/10'
                : 'border-slate-200 text-slate-700 hover:border-slate-350'
            }`}
          >
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1">Elemen B</div>
            <div className="font-bold text-sm">Data Preparation</div>
          </button>
        </div>

        {/* Intensity Sliders */}
        {demoSelected !== 'equal' && (
          <div className="bg-white p-5 rounded-xl border border-blue-150 shadow-sm mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Intensitas Kepentingan: <span className="text-sm font-extrabold text-blue-900">{demoIntensity}</span>
            </label>
            <div className="flex justify-between items-center gap-1.5 md:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
                <button
                  key={v}
                  onClick={() => setDemoIntensity(v)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition duration-150 cursor-pointer ${
                    demoIntensity === v
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1 mt-2">
              <span>Sama Penting (1)</span>
              <span>Sedikit Lebih (3)</span>
              <span>Lebih Penting (5)</span>
              <span>Sangat Lebih (7)</span>
              <span>Mutlak Lebih (9)</span>
            </div>
          </div>
        )}

        {/* Live Interpretation */}
        <div className="p-3 bg-blue-900 text-white rounded-xl text-xs md:text-sm font-semibold text-center shadow-sm">
          {getDemoDescription()}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition duration-150"
        >
          Kembali
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5 group"
        >
          Paham & Lanjut
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
