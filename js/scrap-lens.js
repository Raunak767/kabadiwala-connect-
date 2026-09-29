// ==========================================================================
// E-Setu AI Scrap Lens & Kanta Parakh (Scale OCR + Chumbak/Tilt Fraud Sensor)
// Computer vision simulation for PCB Grade classification, dial reading, and magnetic anomaly detection
// ==========================================================================

class ScrapLensManager {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.magnetometerActive = false;
  }

  async startCamera(videoElement) {
    this.videoElement = videoElement;
    try {
      this.stopCamera();
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        this.videoElement.play().catch(() => {});
      }
    } catch (e) {
      console.warn('[ScrapLens] Direct camera access unavailable, using simulated video feed:', e);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try { track.stop(); } catch {}
      });
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  // PCB Grading & Scale OCR simulation
  analyzeCurrentFrame(scrapType = 'pcb_gold') {
    const results = {
      pcb_gold: {
        category: 'सर्किट बोर्ड व मदरबोर्ड',
        grade: 'Grade A: Telecom & Server Boards, Gold RAM',
        grade_name_hi: 'ग्रेड-ए: सर्वर बोर्ड, गोल्ड रैम (सोने की पिन्स)',
        confidence: 0.94,
        scale_ocr_weight_kg: 8.5,
        base_rate: 680,
        epr_bonus_rate: 45,
        total_payout: 6162,
        metals_breakdown: '0.45g Gold, 2.8g Silver, 220g Copper / kg',
        hazard_alert: null,
        magnet_fraud_detected: false,
        tilt_degrees: 2.1
      },
      pcb_brown: {
        category: 'सर्किट बोर्ड व मदरबोर्ड',
        grade: 'Grade C: TV & Power Supply (SMPS) Brown Board',
        grade_name_hi: 'ग्रेड-सी: टीवी व पावर सप्लाई भूरा बोर्ड (कम दाम)',
        confidence: 0.91,
        scale_ocr_weight_kg: 14.0,
        base_rate: 85,
        epr_bonus_rate: 10,
        total_payout: 1330,
        metals_breakdown: 'Trace copper, heavy phenolic resin',
        hazard_alert: null,
        magnet_fraud_detected: false,
        tilt_degrees: 1.8
      },
      batt_punctured: {
        category: 'बैटरियां (लिथियम व लेड-एसिड)',
        grade: 'Swollen Li-Po Pouch Cells',
        grade_name_hi: 'खतरा! फूली हुई लिथियम बैटरी',
        confidence: 0.97,
        scale_ocr_weight_kg: 3.2,
        base_rate: 240,
        epr_bonus_rate: 50,
        total_payout: 928,
        metals_breakdown: 'Lithium, Cobalt, Nickel',
        hazard_alert: '🚨 आग का गंभीर खतरा! बैटरी फूली हुई है। इसे लोहे के नीचे न दबाएं, रेत की बाल्टी में अलग रखें!',
        magnet_fraud_detected: false,
        tilt_degrees: 1.2
      },
      scale_fraud: {
        category: 'केबल और बिजली के तार',
        grade: 'Heavy Copper Power Cables',
        grade_name_hi: 'तांबे का केबल (तराजू में चुंबक का शक!)',
        confidence: 0.89,
        scale_ocr_weight_kg: 12.0,
        base_rate: 460,
        epr_bonus_rate: 25,
        total_payout: 5820,
        metals_breakdown: '72% Pure Copper',
        hazard_alert: null,
        magnet_fraud_detected: true,
        tilt_degrees: 14.8
      }
    };

    return results[scrapType] || results['pcb_gold'];
  }

  renderAnalysisResult(containerElement, scrapType = 'pcb_gold') {
    if (!containerElement) return;
    const data = this.analyzeCurrentFrame(scrapType);
    const lang = window.vernacular.currentLang;

    const chumbakBanner = document.getElementById('chumbakBanner');
    if (chumbakBanner) {
      chumbakBanner.style.display = data.magnet_fraud_detected ? 'block' : 'none';
      if (data.magnet_fraud_detected) {
        chumbakBanner.innerHTML = `⚠️ तराजू झुकाव ${data.tilt_degrees}° • चुंबक (Magnetic Anomaly) मिला!`;
      }
    }

    let warningBanner = '';
    if (data.hazard_alert) {
      warningBanner = `
        <div style="background:#dc2626; color:#fff; padding:12px; border-radius:8px; margin-bottom:12px; font-weight:700; font-size:0.85rem;">
          ${data.hazard_alert}
        </div>
      `;
      window.voiceEngine.speak(data.hazard_alert);
    } else if (data.magnet_fraud_detected) {
      warningBanner = `
        <div style="background:#dc2626; color:#fff; padding:12px; border-radius:8px; margin-bottom:12px; font-weight:700; font-size:0.85rem;">
          🚨 काँटा धोखाधड़ी चेतावनी! तराजू में 14.8° का असामान्य झुकाव और चुंबक मिला है। सीधा तौल करवाएं!
        </div>
      `;
      window.voiceEngine.speak("सावधान! तराजू में असामान्य झुकाव मिला है, सही तौल करवाएं!");
    } else {
      const msg = lang === 'mr'
        ? `तपासणी पूर्ण! ${data.grade}, वजन: ${data.scale_ocr_weight_kg} किलो, एकूण मूल्य: ₹${data.total_payout}`
        : (lang === 'en'
          ? `Analysis complete! ${data.grade}, Weight: ${data.scale_ocr_weight_kg} kg, Payout: ₹${data.total_payout}`
          : `जांच पूरी! ${data.grade_name_hi}, वजन: ${data.scale_ocr_weight_kg} किलो, कुल मूल्य: ₹${data.total_payout}`);
      window.voiceEngine.speak(msg);
    }

    containerElement.innerHTML = `
      ${warningBanner}
      <div style="background:#ffffff; border:1px solid var(--peach-200); border-radius:12px; padding:16px; box-shadow:0 2px 4px rgba(0,0,0,0.02);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span class="badge badge-green">AI Lens ${(data.confidence * 100).toFixed(0)}% Confidence</span>
          <span style="font-size:0.8rem; color:#6b7280; font-weight:600;">काँटा परख: OCR Verified</span>
        </div>

        <h3 style="font-size:1.15rem; color:#1f2937; margin-bottom:4px;">${data.grade}</h3>
        <p style="font-size:0.85rem; color:#059669; font-weight:600; margin-bottom:12px;">📊 धातु विश्लेषण: ${data.metals_breakdown}</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
          <div style="background:#fff7ed; border:1px solid var(--peach-200); padding:10px; border-radius:8px;">
            <div style="font-size:0.75rem; color:#6b7280;">काँटा वजन (OCR):</div>
            <div style="font-size:1.4rem; font-weight:800; color:#1f2937;">${data.scale_ocr_weight_kg} kg</div>
          </div>
          <div style="background:#fff7ed; border:1px solid var(--peach-200); padding:10px; border-radius:8px;">
            <div style="font-size:0.75rem; color:#6b7280;">कुल नकद मूल्य (EPR सहित):</div>
            <div style="font-size:1.4rem; font-weight:800; color:#ea580c;">₹${data.total_payout}</div>
          </div>
        </div>

        <button class="btn-primary" style="width:100%;" onclick="window.scrapLens.confirmLotFromScan('${scrapType}')">
          ➕ ${lang === 'mr' ? 'हा लॉट खात्यात जोडा' : (lang === 'en' ? 'Add this Verified Lot' : 'यह सत्यापित लॉट खातें में जोड़ें')}
        </button>
      </div>
    `;
  }

  confirmLotFromScan(scrapType) {
    const data = this.analyzeCurrentFrame(scrapType);
    window.store.addLot({
      category: data.category,
      sub_category: data.grade,
      approx_weight_kg: data.scale_ocr_weight_kg,
      estimated_value_inr: Math.round(data.scale_ocr_weight_kg * data.base_rate),
      epr_bonus_inr: Math.round(data.scale_ocr_weight_kg * data.epr_bonus_rate),
      total_value_inr: data.total_payout,
      location: 'कुर्ला वेस्ट कबाड़ डिपो, मुंबई',
      source: 'AI_SCRAP_LENS_OCR'
    });

    if (window.showAppToast) {
      window.showAppToast(`✅ लॉट सफलतापूर्वक जुड़ गया: ₹${data.total_payout}`, 'success');
    }
    this.stopCamera();
    const modal = document.getElementById('scannerModal');
    if (modal) modal.classList.remove('active');
  }
}

window.scrapLens = new ScrapLensManager();
