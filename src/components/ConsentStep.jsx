import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function ConsentStep({ onNext, onPrev, consentChecked, setConsentChecked }) {
  const handleProceed = () => {
    if (consentChecked) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-2xl mb-4 border border-green-100">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Persetujuan Keikutsertaan</h2>
        <p className="text-slate-500">Lembar Persetujuan Responden (Informed Consent)</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6 text-slate-600 leading-relaxed text-sm md:text-base space-y-4">
        <p>
          Sebelum memulai pengisian, mohon membaca pernyataan berikut dengan saksama:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>Partisipasi Anda dalam pengisian kuesioner ini bersifat sukarela dan tanpa paksaan.</li>
          <li>Seluruh data profil pribadi, nama, instansi, dan jawaban kuesioner Anda akan dijaga kerahasiaannya dan hanya digunakan untuk kepentingan penelitian akademik.</li>
          <li>Hasil pengolahan data akan disajikan dalam bentuk rekapitulasi kelompok (agregat), sehingga identitas individual tidak akan teridentifikasi secara terbuka.</li>
          <li>Anda dapat berhenti mengisi kuesioner sewaktu-waktu tanpa konsekuensi apapun. Data Anda disimpan secara lokal di browser Anda selama proses pengisian.</li>
        </ul>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs md:text-sm text-blue-800">
          <Info className="w-5 h-5 shrink-0" />
          <p>
            Pengisian kuesioner ini memerlukan waktu sekitar <strong>15–20 menit</strong> karena melibatkan penilaian perbandingan berpasangan (pairwise comparison) yang komprehensif.
          </p>
        </div>
      </div>

      {/* Checkbox */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-blue-900 focus:ring-blue-900 mt-0.5"
          />
          <span className="text-xs md:text-sm text-slate-700 font-medium leading-snug">
            Saya telah membaca penjelasan di atas, memahami tujuan penelitian ini, dan dengan sukarela menyatakan bersedia berpartisipasi sebagai responden pakar/praktisi.
          </span>
        </label>
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
          onClick={handleProceed}
          disabled={!consentChecked}
          className={`px-6 py-3 font-semibold rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5 ${
            consentChecked
              ? 'bg-blue-900 hover:bg-blue-950 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Setuju & Lanjut
        </button>
      </div>
    </div>
  );
}
