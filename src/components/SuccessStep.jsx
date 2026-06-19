import React from 'react';
import { Award, CheckCircle, Download, FileText, Globe, Clipboard } from 'lucide-react';
import { CRITERIA, SUBCRITERIA, ALTERNATIVES } from '../data/constants';
import { generatePairwiseCombinations } from '../utils/ahp';

export default function SuccessStep({ profile, validationAnswers, answers, openAnswers, submissionId }) {
  
  // Format dates for file name
  const getTimestampString = () => {
    const d = new Date();
    return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}_${d.getHours().toString().padStart(2, '0')}${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // Helper to trigger browser download of a string content
  const triggerDownload = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. EXPORT TO JSON
  const handleExportJSON = () => {
    const fullData = {
      meta: {
        title: "Kuesioner AHP e-Audit Pajak",
        submissionId: submissionId,
        timestamp: new Date().toISOString()
      },
      profile,
      validation: validationAnswers,
      pairwise: answers,
      openQuestions: openAnswers
    };
    const jsonStr = JSON.stringify(fullData, null, 2);
    triggerDownload(jsonStr, `AHP_eAudit_Backup_${profile.nama?.replace(/\s+/g, '_') || 'Responden'}_${getTimestampString()}.json`, 'application/json;charset=utf-8;');
  };

  // 2. EXPORT TO CSV
  const handleExportCSV = () => {
    const csvRows = [];
    
    // Header
    const headers = [
      'Respondent_ID',
      'Respondent_Name',
      'Respondent_Instansi',
      'Section',
      'Parent_Code',
      'Left_Item',
      'Right_Item',
      'Selected_Item',
      'Intensity',
      'AHP_Value',
      'Reason'
    ];
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

    const respondentId = submissionId;
    const name = profile.nama || '';
    const instansi = profile.instansi || '';

    const addRow = (section, parentCode, left, right, answer) => {
      if (!answer) return;
      
      let ahpValue = 1;
      const intensity = Number(answer.intensity) || 1;
      if (answer.selected === 'left') ahpValue = intensity;
      else if (answer.selected === 'right') ahpValue = 1 / intensity;

      const row = [
        respondentId,
        name,
        instansi,
        section,
        parentCode || '',
        left,
        right,
        answer.selected || 'equal',
        intensity,
        ahpValue.toFixed(4),
        answer.reason || ''
      ];
      csvRows.push(row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','));
    };

    // a. Criteria Pairwise
    const critPairs = generatePairwiseCombinations(CRITERIA);
    critPairs.forEach(p => {
      const key = `${p.left.code}-${p.right.code}`;
      addRow('Criteria', 'Tujuan', p.left.code, p.right.code, answers.criteria?.[key]);
    });

    // b. Subcriteria Pairwise
    CRITERIA.forEach(c => {
      const subs = SUBCRITERIA.filter(s => s.parent === c.code);
      const subPairs = generatePairwiseCombinations(subs);
      subPairs.forEach(p => {
        const key = `${p.left.code}-${p.right.code}`;
        addRow('Subcriteria', c.code, p.left.code, p.right.code, answers.subcriteria?.[key]);
      });
    });

    // c. Alternatives Pairwise
    SUBCRITERIA.forEach(s => {
      const altPairs = generatePairwiseCombinations(ALTERNATIVES);
      altPairs.forEach(p => {
        const key = `alt-${s.code}-${p.left.code}-${p.right.code}`;
        addRow('Alternatives', s.code, p.left.code, p.right.code, answers.alternatives?.[key]);
      });
    });

    const csvContent = "\ufeff" + csvRows.join("\n"); // Add BOM for Excel UTF-8 support
    triggerDownload(csvContent, `AHP_eAudit_Pairwise_${profile.nama?.replace(/\s+/g, '_') || 'Responden'}_${getTimestampString()}.csv`, 'text/csv;charset=utf-8;');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(submissionId);
    alert('Kode pengisian berhasil disalin ke clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-center">
      <div className="inline-flex items-center justify-center p-4 bg-emerald-50 text-emerald-600 rounded-full mb-6 border border-emerald-100 shadow-md">
        <CheckCircle className="w-12 h-12" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        Pengiriman Berhasil!
      </h1>
      <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto mb-8">
        Terima kasih atas waktu dan kontribusi berharga yang Bapak/Ibu berikan.
        Data kuesioner Anda telah sukses disimpan secara permanen di database Google Sheets penelitian kami.
      </p>

      {/* Submission ID box */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 mb-8 max-w-md mx-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          Kode Pengisian Anda (Bukti Submit)
        </div>
        <div className="flex items-center justify-center gap-2">
          <code className="text-lg md:text-xl font-extrabold text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
            {submissionId}
          </code>
          <button
            onClick={copyToClipboard}
            title="Salin Kode"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-pointer hover:text-blue-900 transition-colors"
          >
            <Clipboard className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          * Catat atau salin kode di atas jika Anda memerlukannya sebagai bukti keikutsertaan kuesioner.
        </p>
      </div>

      {/* Backup Buttons */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 mb-8 max-w-md mx-auto shadow-sm">
        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center justify-center gap-1.5">
          <Download className="w-4 h-4 text-blue-900" />
          Download Salinan Data Anda (Rekomendasi)
        </h4>
        <p className="text-slate-500 text-[11px] mb-4 leading-normal">
          Sebagai bentuk keterbukaan data penelitian, Anda dapat mendownload seluruh jawaban kuesioner Anda secara langsung.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Download CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-400">
        <p>Hubungi tim peneliti jika Anda memiliki pertanyaan atau kendala lanjutan.</p>
        <p className="mt-1 font-semibold text-slate-500">Penelitian AHP e-Audit &copy; 2026</p>
      </div>
    </div>
  );
}
