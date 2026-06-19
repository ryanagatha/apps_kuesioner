/**
 * GOOGLE APPS SCRIPT FOR AHP E-AUDIT QUESTIONNAIRE BACKEND (VERSI OPTIMAL / BATCH WRITE)
 * 
 * PETUNJUK INSTALASI:
 * 1. Buka Google Sheets Anda, klik Ekstensi > Apps Script.
 * 2. Hapus semua kode lama, lalu paste kode baru di bawah ini.
 * 3. Simpan.
 * 4. Klik Terapkan (Deploy) > Kelola Penerapan (Manage deployments) > Edit (pensil) > Pilih versi baru (New Version) > klik Terapkan.
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Inisialisasi/dapatkan sheet rekap & raw
    var sheetRekap = getOrCreateSheet(spreadSheet, "Responden_Rekap");
    var sheetRaw = getOrCreateSheet(spreadSheet, "Pairwise_Raw");
    
    // Tulis header jika sheet baru dibuat
    initializeSheetHeaders(sheetRekap, "rekap");
    initializeSheetHeaders(sheetRaw, "raw");
    
    var timestamp = new Date().toISOString();
    
    // 1. TULIS DATA REKAP (1 Baris)
    writeRekapRow(sheetRekap, data, timestamp);
    
    // 2. TULIS DATA PAIRWISE RAW (Batch Write - Sangat Cepat!)
    writeRawRowsOptimized(sheetRaw, data, timestamp);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data kuesioner berhasil disimpan.",
      submissionId: data.submissionId
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET untuk tes koneksi
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Koneksi backend kuesioner AHP e-Audit aktif."
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(spreadSheet, name) {
  var sheet = spreadSheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadSheet.insertSheet(name);
  }
  return sheet;
}

function initializeSheetHeaders(sheet, type) {
  if (sheet.getLastRow() > 0) return; // Sudah ada header
  
  var headers = [];
  if (type === "raw") {
    headers = [
      "Timestamp", "Submission_ID", "Nama_Responden", "Instansi", 
      "Kategori_Pairwise", "Induk_Kriteria", "Item_Kiri", "Item_Kanan", 
      "Pilihan_Responden", "Intensitas", "Nilai_AHP", "Alasan"
    ];
  } else if (type === "rekap") {
    headers = [
      "Timestamp", "Submission_ID", "Nama_Responden", "Instansi", "Jabatan", 
      "Bidang_Keahlian", "Lama_Pengalaman", "Pernah_E_Audit", "Pernah_Tools", 
      "Tools_Digunakan", "Pemahaman_AHP"
    ];
    
    // Tambah header validasi Kriteria (K1 - K6)
    for (var i = 1; i <= 6; i++) {
      headers.push("Val_K" + i + "_Rating", "Val_K" + i + "_Notes");
    }
    
    // Tambah header validasi Subkriteria (K1.1 - K6.3)
    var subIndices = [
      "K1.1", "K1.2", "K1.3",
      "K2.1", "K2.2", "K2.3",
      "K3.1", "K3.2", "K3.3",
      "K4.1", "K4.2", "K4.3",
      "K5.1", "K5.2", "K5.3",
      "K6.1", "K6.2", "K6.3"
    ];
    subIndices.forEach(function(subCode) {
      headers.push("Val_" + subCode.replace(".", "_") + "_Rating", "Val_" + subCode.replace(".", "_") + "_Notes");
    });
    
    // Tambah header validasi Alternatif (A - D)
    var altCodes = ["Stack_A", "Stack_B", "Stack_C", "Stack_D"];
    altCodes.forEach(function(code) {
      headers.push("Val_" + code + "_Rating", "Val_" + code + "_Notes");
    });
    
    // Tambah header open questions
    for (var j = 1; j <= 5; j++) {
      headers.push("Open_Q" + j);
    }
    
    // Tambah header kalkulasi AHP
    headers.push("CR_Kriteria_Utama");
    headers.push("Weight_Stack_A", "Weight_Stack_B", "Weight_Stack_C", "Weight_Stack_D");
  }
  
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
}

function writeRekapRow(sheet, data, timestamp) {
  var p = data.profile || {};
  var v = data.validation || {};
  var openQ = data.openQuestions || {};
  var results = data.results || {};
  
  var row = [
    timestamp,
    data.submissionId,
    p.nama || "",
    p.instansi || "",
    p.jabatan || "",
    (p.keahlian || []).join(", "),
    p.pengalaman || "",
    p.pernah_e_audit || "",
    p.pernah_tools || "",
    (p.tools_digunakan || []).join(", "),
    p.pemahaman_ahp || ""
  ];
  
  // Validasi Kriteria
  for (var i = 1; i <= 6; i++) {
    var code = "K" + i;
    var rating = v.criteria && v.criteria[code] ? v.criteria[code].rating : "";
    var notes = v.criteria && v.criteria[code] ? v.criteria[code].notes : "";
    row.push(rating, notes);
  }
  
  // Validasi Subkriteria
  var subIndices = [
    "K1.1", "K1.2", "K1.3",
    "K2.1", "K2.2", "K2.3",
    "K3.1", "K3.2", "K3.3",
    "K4.1", "K4.2", "K4.3",
    "K5.1", "K5.2", "K5.3",
    "K6.1", "K6.2", "K6.3"
  ];
  subIndices.forEach(function(code) {
    var rating = v.subcriteria && v.subcriteria[code] ? v.subcriteria[code].rating : "";
    var notes = v.subcriteria && v.subcriteria[code] ? v.subcriteria[code].notes : "";
    row.push(rating, notes);
  });
  
  // Validasi Alternatif
  var altCodes = ["Stack A", "Stack B", "Stack C", "Stack D"];
  altCodes.forEach(function(code) {
    var rating = v.alternatives && v.alternatives[code] ? v.alternatives[code].rating : "";
    var notes = v.alternatives && v.alternatives[code] ? v.alternatives[code].notes : "";
    row.push(rating, notes);
  });
  
  // Open questions
  for (var j = 1; j <= 5; j++) {
    row.push(openQ["open_q" + j] || "");
  }
  
  // AHP calculations
  row.push(results.criteriaCR !== undefined ? results.criteriaCR : "");
  row.push(
    results.globalWeights ? results.globalWeights["Stack A"] : "",
    results.globalWeights ? results.globalWeights["Stack B"] : "",
    results.globalWeights ? results.globalWeights["Stack C"] : "",
    results.globalWeights ? results.globalWeights["Stack D"] : ""
  );
  
  sheet.appendRow(row);
}

function writeRawRowsOptimized(sheet, data, timestamp) {
  var p = data.profile || {};
  var pw = data.pairwise || {};
  
  var name = p.nama || "";
  var instansi = p.instansi || "";
  var subId = data.submissionId;
  
  var rowsToAppend = [];
  
  var addRow = function(category, parent, left, right, ans) {
    if (!ans) return;
    
    var ahpValue = 1;
    var intensity = Number(ans.intensity) || 1;
    if (ans.selected === "left") {
      ahpValue = intensity;
    } else if (ans.selected === "right") {
      ahpValue = 1 / intensity;
    }
    
    rowsToAppend.push([
      timestamp,
      subId,
      name,
      instansi,
      category,
      parent,
      left,
      right,
      ans.selected || "equal",
      intensity,
      ahpValue,
      ans.reason || ""
    ]);
  };
  
  // 1. Kriteria Utama (15 perbandingan)
  if (pw.criteria) {
    Object.keys(pw.criteria).forEach(function(key) {
      var parts = key.split("-");
      addRow("Kriteria Utama", "Tujuan", parts[0], parts[1], pw.criteria[key]);
    });
  }
  
  // 2. Subkriteria (18 perbandingan)
  if (pw.subcriteria) {
    Object.keys(pw.subcriteria).forEach(function(key) {
      var parts = key.split("-");
      var parent = parts[0].split(".")[0];
      addRow("Subkriteria", parent, parts[0], parts[1], pw.subcriteria[key]);
    });
  }
  
  // 3. Alternatif (108 perbandingan)
  if (pw.alternatives) {
    Object.keys(pw.alternatives).forEach(function(key) {
      var parts = key.split("-");
      if (parts.length >= 4) {
        var subCode = parts[1];
        var leftAlt = parts[2];
        var rightAlt = parts[3];
        addRow("Alternatif", subCode, leftAlt, rightAlt, pw.alternatives[key]);
      }
    });
  }
  
  // Batch write ke sheet (Sangat cepat, hanya 1 kali panggil API Google Sheets)
  if (rowsToAppend.length > 0) {
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow + 1, 1, rowsToAppend.length, rowsToAppend[0].length);
    range.setValues(rowsToAppend);
  }
}
