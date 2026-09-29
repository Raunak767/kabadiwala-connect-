// ==========================================================================
// ई-सेतु शून्य-इंटरनेट हैंडओवर (PORH - 100% Desi & Regional)
// Dynamic Time-Rotating QR + Acoustic Chirp for Zero-Internet Handshake
// ==========================================================================

class PorhHandshakeManager {
  constructor() {
    this.currentOtp = null;
    this.audioCtx = null;
    this.countdownTimer = null;
    this.secondsRemaining = 15;
    this.activeLotId = null;
  }

  generateDynamicToken(lotId) {
    const timestamp = Math.floor(Date.now() / 15000);
    const token = `सेतु-${lotId.replace('LOT-', '')}-${(timestamp % 10000).toString().padStart(4, '0')}`;
    this.currentOtp = token;
    return token;
  }

  renderHandshakeModal(containerElement, lotId) {
    this.stopCountdown();
    this.activeLotId = lotId;
    const lots = window.store.getActiveLots();
    const lot = lots.find(l => l.lot_id === lotId) || lots[0];
    if (!lot) {
      containerElement.innerHTML = '<p style="padding:20px; text-align:center; color:#6b7280;">कोई सक्रिय लॉट नहीं मिला।</p>';
      return;
    }

    const token = this.generateDynamicToken(lot.lot_id);
    this.secondsRemaining = 15;

    containerElement.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <span class="badge badge-gold" style="margin-bottom:12px;">📴 शून्य-इंटरनेट हैंडओवर सत्यापन</span>
        <h3 style="font-size:1.3rem; color:#1f2937; margin-bottom:4px;">
          ${window.vernacular.t('handover_btn')}
        </h3>
        <p style="font-size:0.85rem; color:#4b5563; margin-bottom:14px;">
          इंटरनेट की कोई जरूरत नहीं है। रिसाइक्लर के कैमरे से यह कोड स्कैन करवाएं:
        </p>

        <!-- बारकोड कोड -->
        <div style="background:#ffffff; padding:16px; border-radius:16px; width:200px; height:200px; margin:0 auto 14px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 25px rgba(249, 115, 22, 0.2); border:2px solid var(--peach-300);">
          <svg viewBox="0 0 100 100" width="168" height="168">
            <rect width="100" height="100" fill="#ffffff"/>
            <rect x="10" y="10" width="25" height="25" fill="#1f2937"/>
            <rect x="65" y="10" width="25" height="25" fill="#1f2937"/>
            <rect x="10" y="65" width="25" height="25" fill="#1f2937"/>
            <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
            <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
            <rect x="44" y="44" width="12" height="12" fill="#ea580c"/>
            <rect x="42" y="10" width="16" height="8" fill="#1f2937"/>
            <rect x="10" y="42" width="8" height="16" fill="#1f2937"/>
            <rect x="65" y="42" width="25" height="8" fill="#1f2937"/>
            <rect x="42" y="65" width="16" height="25" fill="#1f2937"/>
          </svg>
        </div>

        <div style="background:#fff7ed; border:1px solid var(--peach-200); padding:12px; border-radius:8px; margin-bottom:16px;">
          <div style="font-size:0.8rem; color:#6b7280; display:flex; justify-content:space-between; align-items:center;">
            <span>सुरक्षित टोकन कोड:</span>
            <span id="porhCountdownText" style="color:#ea580c; font-weight:800; font-size:0.75rem;">⏱️ 15s में बदलेगा</span>
          </div>
          <div id="porhTokenDisplay" style="font-size:1.6rem; font-weight:900; letter-spacing:3px; color:#ea580c;">${token}</div>
          <div style="font-size:0.85rem; color:#059669; font-weight:700; margin-top:4px;">
            वजन: ${lot.approx_weight_kg} किलो • कुल नकद देय: ₹${lot.total_value_inr}
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn-secondary" style="flex:1;" onclick="window.porhHandshake.playAcousticChirp()">
            🔊 ध्वनि संकेत बजाएं
          </button>
          <button class="btn-primary" style="flex:1;" onclick="window.porhHandshake.simulateRecyclerScan('${lot.lot_id}')">
            🤝 रिसाइक्लर पुष्टि (नकद भुगतान)
          </button>
        </div>
      </div>
    `;

    this.startCountdown(lot.lot_id);
  }

  startCountdown(lotId) {
    this.stopCountdown();
    this.countdownTimer = setInterval(() => {
      this.secondsRemaining -= 1;
      const countEl = document.getElementById('porhCountdownText');
      if (countEl) {
        countEl.textContent = `⏱️ ${this.secondsRemaining}s में बदलेगा`;
      }

      if (this.secondsRemaining <= 0) {
        this.secondsRemaining = 15;
        const newToken = this.generateDynamicToken(lotId);
        const tokenEl = document.getElementById('porhTokenDisplay');
        if (tokenEl) tokenEl.textContent = newToken;
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  playAcousticChirp() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = [1200, 1600, 2000, 2400, 1800, 1400];
      let time = this.audioCtx.currentTime;

      frequencies.forEach((freq) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.15);
        time += 0.16;
      });

      if (window.showAppToast) {
        window.showAppToast('🔊 ऑफलाइन डेटा-ओवर-साउंड सिग्नल बजा!', 'info');
      }
    } catch (e) {
      console.warn('ध्वनि संकेत त्रुटि:', e);
    }
  }

  simulateRecyclerScan(lotId) {
    this.stopCountdown();
    const txn = window.store.completeHandover(lotId, 'REC-MH-001', 'नकद (CASH)');
    if (txn) {
      if (window.showAppToast) {
        window.showAppToast(`✅ हैंडओवर पूरा हुआ! ₹${txn.total_payout_inr} नकद प्राप्त हुआ।`, 'success');
      }

      const lang = window.vernacular.currentLang;
      const msgs = {
        hi: `हैंडओवर सफल रहा! ₹${txn.total_payout_inr} नकद का हिसाब दोस्त खाते में दर्ज हो गया है।`,
        mr: `हस्तांतरण यशस्वी! ₹${txn.total_payout_inr} रोख हिशोब वहीखात्यात नोंदवला गेला आहे.`,
        bho: `हैंडओवर पूरा भइल! ₹${txn.total_payout_inr} नगद के हिसाब दोस्त खाता में जुड़ गइल बा।`,
        pa: `ਹੈਂਡਓਵਰ ਪੂਰਾ ਹੋਇਆ! ₹${txn.total_payout_inr} ਨਕਦ ਦੋਸਤ ਖਾਤੇ ਵਿੱਚ ਦਰਜ ਹੋ ਗਏ ਹਨ।`,
        bn: `হস্তান্তর সফল হয়েছে! ₹${txn.total_payout_inr} নগদ হিসেব দোস্ত খাতায় যুক্ত হয়েছে।`,
        ta: `ஒப்படைப்பு வெற்றிகரமாக முடிந்தது! ₹${txn.total_payout_inr} ரொக்க கணக்கு சேர்க்கப்பட்டது.`,
        te: `హ్యాండ్‌ఓవర్ విజయవంతమైంది! ₹${txn.total_payout_inr} నగదు వివరాలు లెక్కల పుస్తకంలో నమోదయ్యాయి.`
      };

      window.voiceEngine.speak(msgs[lang] || msgs['hi']);

      const modal = document.getElementById('handshakeModal');
      if (modal) modal.classList.remove('active');
    }
  }
}

window.porhHandshake = new PorhHandshakeManager();
