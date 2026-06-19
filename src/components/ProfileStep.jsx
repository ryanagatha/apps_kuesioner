import React, { useState } from 'react';
import { User, Briefcase, Award, Check } from 'lucide-react';

const EXPERTISE_OPTIONS = [
  'Pemeriksaan Pajak',
  'e-Audit',
  'Data Analytics',
  'Sistem Informasi',
  'Pengembangan Aplikasi',
  'Lainnya'
];

const EXPERIENCE_OPTIONS = [
  '<5 tahun',
  '5–10 tahun',
  '11–15 tahun',
  '>15 tahun'
];

const TOOLS_OPTIONS = [
  'Excel/Power Query',
  'ACL',
  'IDEA',
  'SQL',
  'Python/R',
  'Power BI',
  'Orange Data Mining',
  'Lainnya'
];

const AHP_KNOWLEDGE_OPTIONS = [
  'Belum memahami',
  'Dasar',
  'Cukup',
  'Baik',
  'Sangat baik'
];

export default function ProfileStep({ onNext, onPrev, profile, setProfile }) {
  const [errors, setErrors] = useState({});

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxListChange = (fieldName, item) => {
    const list = profile[fieldName] || [];
    let newList;
    if (list.includes(item)) {
      newList = list.filter(i => i !== item);
    } else {
      newList = [...list, item];
    }
    setProfile(prev => ({ ...prev, [fieldName]: newList }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleRadioChange = (fieldName, val) => {
    setProfile(prev => ({ ...prev, [fieldName]: val }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!profile.nama?.trim()) newErrors.nama = 'Nama lengkap wajib diisi.';
    if (!profile.instansi?.trim()) newErrors.instansi = 'Instansi/Unit Kerja wajib diisi.';
    if (!profile.jabatan?.trim()) newErrors.jabatan = 'Jabatan/Peran saat ini wajib diisi.';
    
    if (!profile.keahlian || profile.keahlian.length === 0) {
      newErrors.keahlian = 'Pilih minimal satu bidang keahlian.';
    }
    if (!profile.pengalaman) {
      newErrors.pengalaman = 'Pilih lama pengalaman Anda.';
    }
    if (!profile.pernah_e_audit) {
      newErrors.pernah_e_audit = 'Pilih keterlibatan Anda dalam pemeriksaan berbasis data elektronik.';
    }
    if (!profile.pernah_tools) {
      newErrors.pernah_tools = 'Pilih riwayat penggunaan tools data analytics.';
    }
    if (!profile.pemahaman_ahp) {
      newErrors.pemahaman_ahp = 'Pilih tingkat pemahaman Anda terhadap AHP.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext();
    } else {
      // Scroll to top of the form or first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-900 rounded-2xl mb-3 border border-blue-150 shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Profil Responden Pakar</h2>
        <p className="text-slate-500">Mohon lengkapi informasi profesional Anda di bawah ini</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 mb-8">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            Nama Responden (Lengkap dengan Gelar) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            value={profile.nama || ''}
            onChange={handleTextChange}
            placeholder="Contoh: Dr. Ir. Ahmad Sudrajat, M.Si."
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.nama ? 'border-rose-450 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300 focus:ring-blue-900 focus:border-blue-900'
            } transition duration-150`}
          />
          {errors.nama && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.nama}</p>}
        </div>

        {/* Instansi */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Instansi / Unit Kerja <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="instansi"
            value={profile.instansi || ''}
            onChange={handleTextChange}
            placeholder="Contoh: Direktorat Jenderal Pajak (DJP) / Kanwil DJP Wajib Pajak Besar"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.instansi ? 'border-rose-450 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300 focus:ring-blue-900 focus:border-blue-900'
            } transition duration-150`}
          />
          {errors.instansi && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.instansi}</p>}
        </div>

        {/* Jabatan */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Jabatan / Peran Saat Ini <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="jabatan"
            value={profile.jabatan || ''}
            onChange={handleTextChange}
            placeholder="Contoh: Pemeriksa Pajak Ahli Madya / Data Scientist"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.jabatan ? 'border-rose-450 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300 focus:ring-blue-900 focus:border-blue-900'
            } transition duration-150`}
          />
          {errors.jabatan && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.jabatan}</p>}
        </div>

        {/* Bidang Keahlian */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Bidang Keahlian Utama (Dapat memilih lebih dari satu) <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EXPERTISE_OPTIONS.map((item) => {
              const isChecked = (profile.keahlian || []).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleCheckboxListChange('keahlian', item)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left text-sm font-medium transition duration-150 ${
                    isChecked
                      ? 'border-blue-900 bg-blue-50 text-blue-900'
                      : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white'
                  }`}
                >
                  {item}
                  {isChecked && <Check className="w-4 h-4 text-blue-900 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
          {errors.keahlian && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.keahlian}</p>}
        </div>

        {/* Lama Pengalaman */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2.5">
            Lama Pengalaman Profesional <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EXPERIENCE_OPTIONS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleRadioChange('pengalaman', val)}
                className={`p-3 rounded-xl border text-center text-sm font-medium transition duration-150 ${
                  profile.pengalaman === val
                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          {errors.pengalaman && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.pengalaman}</p>}
        </div>

        {/* Keterlibatan Pemeriksaan Data Elektronik */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2.5">
            Pernah Terlibat dalam Pemeriksaan Berbasis Data Elektronik? <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-4">
            {['Ya', 'Tidak'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleRadioChange('pernah_e_audit', val)}
                className={`px-6 py-2.5 rounded-xl border text-center text-sm font-medium transition duration-150 ${
                  profile.pernah_e_audit === val
                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          {errors.pernah_e_audit && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.pernah_e_audit}</p>}
        </div>

        {/* Pernah Menggunakan Tools Data Analytics */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2.5">
            Pernah Menggunakan Tools Audit/Data Analytics? <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-4">
            {['Ya', 'Tidak'].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleRadioChange('pernah_tools', val)}
                className={`px-6 py-2.5 rounded-xl border text-center text-sm font-medium transition duration-150 ${
                  profile.pernah_tools === val
                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          {errors.pernah_tools && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.pernah_tools}</p>}
        </div>

        {/* Tools yang Pernah Digunakan */}
        {profile.pernah_tools === 'Ya' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tools yang Pernah Anda Gunakan (Dapat memilih lebih dari satu)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TOOLS_OPTIONS.map((item) => {
                const isChecked = (profile.tools_digunakan || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleCheckboxListChange('tools_digunakan', item)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition duration-150 ${
                      isChecked
                        ? 'border-blue-900 bg-blue-50 text-blue-900'
                        : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white'
                    }`}
                  >
                    {item}
                    {isChecked && <Check className="w-3.5 h-3.5 text-blue-900 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tingkat Pemahaman AHP */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2.5">
            Tingkat Pemahaman terhadap Metode AHP (Analytic Hierarchy Process) <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {AHP_KNOWLEDGE_OPTIONS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleRadioChange('pemahaman_ahp', val)}
                className={`p-3 rounded-xl border text-center text-xs font-medium transition duration-150 ${
                  profile.pemahaman_ahp === val
                    ? 'border-blue-900 bg-blue-50 text-blue-900'
                    : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          {errors.pemahaman_ahp && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.pemahaman_ahp}</p>}
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
          onClick={handleSubmit}
          className="px-6 py-3 font-semibold bg-blue-900 hover:bg-blue-950 text-white rounded-xl shadow-sm transition duration-150 flex items-center gap-1.5"
        >
          Simpan & Lanjut
        </button>
      </div>
    </div>
  );
}
