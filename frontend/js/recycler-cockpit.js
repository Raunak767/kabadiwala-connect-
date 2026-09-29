// ==========================================================================
// E-Setu Authorized Recycler Operations Cockpit
// Live Scrap Radar, Hyperlocal EV Dispatch, Handover Verification, and CPCB Form-6 Manifest
// ==========================================================================

class RecyclerCockpitManager {
  constructor() {
    this.activeRecycler = null;
  }

  init() {
    const recyclers = window.store.getRecyclers();
    this.activeRecycler = recyclers[0] || {
      recycler_id: 'REC-MH-001',
      name: 'Eco-Regal Green Refiners Pvt Ltd',
      cpcb_reg_no: 'CPCB/EPR/2023/MH/4491'
    };
    this.renderCockpit();
  }

  renderCockpit() {
    const container = document.getElementById('recyclerCockpitView');
    if (!container) return;

    if (!this.activeRecycler) {
      const recyclers = window.store.getRecyclers();
      this.activeRecycler = recyclers[0] || {
        recycler_id: 'REC-MH-001',
        name: 'Eco-Regal Green Refiners Pvt Ltd',
        cpcb_reg_no: 'CPCB/EPR/2023/MH/4491'
      };
    }

    const lots = window.store.getActiveLots();
    const txns = window.store.getTransactions();

    container.innerHTML = `
      <!-- Cockpit Header Stats -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px;">
        <div class="glass-card" style="border-left:4px solid var(--peach-500); background:#ffffff;">
          <div style="font-size:0.8rem; color:#6b7280;">CPCB अधिकृत इकाई:</div>
          <strong style="font-size:1.05rem; color:#1f2937;">${this.activeRecycler.name}</strong>
          <div style="font-size:0.75rem; color:#ea580c; margin-top:4px; font-weight:700;">Reg: ${this.activeRecycler.cpcb_reg_no}</div>
        </div>

        <div class="glass-card" style="background:#ffffff;">
          <div style="font-size:0.8rem; color:#6b7280;">लाइव उपलब्ध लॉट्स:</div>
          <div style="font-size:1.8rem; font-weight:800; color:#ea580c;">${lots.length} लॉट</div>
          <div style="font-size:0.75rem; color:#059669; font-weight:600;">रडार कवरेज: 15 km (मुंबई क्लस्टर)</div>
        </div>

        <div class="glass-card" style="background:#ffffff;">
          <div style="font-size:0.8rem; color:#6b7280;">आज का कुल संग्रह:</div>
          <div style="font-size:1.8rem; font-weight:800; color:#059669;">182.5 kg</div>
          <div style="font-size:0.75rem; color:#047857; font-weight:600;">EPR क्रेडिट्स अनलॉक: 182</div>
        </div>

        <div class="glass-card" style="background:#ffffff;">
          <div style="font-size:0.8rem; color:#6b7280;">पिकअप वाहन स्थिति:</div>
          <div style="font-size:1.2rem; font-weight:700; color:#d97706;">⚡ 2 EV टेम्पो सक्रिय</div>
          <div style="font-size:0.75rem; color:#6b7280;">कुर्ला व धारावी रूट</div>
        </div>
      </div>

      <!-- Live Radar Map View -->
      <div class="glass-card" style="margin-bottom:24px; background:#ffffff;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="font-size:1.2rem; color:#1f2937;">📍 लाइव कबाड़ रडार (Hyperlocal Lot Radar)</h3>
            <p style="font-size:0.85rem; color:#6b7280;">समीपवर्ती फेरीवाले और छोटे कबाड़ियों द्वारा बनाए गए डिजिटल लॉट</p>
          </div>
          <button class="btn-primary" style="padding:8px 16px; font-size:0.9rem;" onclick="window.recyclerCockpit.dispatchRoute()">
            🚚 पिकअप वाहन भेजें (Route Dispatch)
          </button>
        </div>

        <div class="radar-screen-wrap">
          <div class="radar-sweep-beam"></div>

          <!-- Radar Blips -->
          <div class="radar-blip" style="top:35%; left:42%;" title="Dharavi Lot (12kg PCB)" onclick="window.recyclerCockpit.handleBlipClick('धारावी 90ft: 12kg High-Grade Server PCB • मूल्य: ₹8,700')"></div>
          <div class="radar-blip" style="top:58%; left:65%;" title="Kurla Lot (24kg Copper Cable)" onclick="window.recyclerCockpit.handleBlipClick('कुर्ला वेस्ट: 24kg Heavy Copper Cable • मूल्य: ₹11,640')"></div>
          <div class="radar-blip" style="top:72%; left:30%; background:#10b981;" title="Chembur Lot (140kg Battery)" onclick="window.recyclerCockpit.handleBlipClick('चेंबूर: 140kg Lead-Acid Battery • मूल्य: ₹15,820')"></div>

          <div style="position:absolute; bottom:12px; left:16px; font-size:0.8rem; background:rgba(255,255,255,0.9); border:1px solid var(--peach-200); padding:4px 10px; border-radius:4px; color:#c2410c; font-weight:700;">
            ● 3 लाइव लॉट पिकअप हेतु तैयार (क्लिक करके विवरण देखें)
          </div>
        </div>
      </div>

      <!-- Actionable Available Lots List -->
      <div class="glass-card" style="margin-bottom:24px; background:#ffffff;">
        <h3 style="font-size:1.15rem; color:#1f2937; margin-bottom:12px;">📦 सत्यापित लॉट्स की सूची</h3>
        
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${lots.length === 0 ? '<p style="color:#6b7280; text-align:center; padding:20px;">कोई नया लॉट लंबित नहीं है।</p>' : lots.map(lot => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#fffaf6; border:1px solid var(--peach-200); padding:14px; border-radius:12px; flex-wrap:wrap; gap:8px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <strong style="color:#1f2937; font-size:1rem;">${lot.sub_category}</strong>
                  <span class="badge badge-gold">${lot.lot_id}</span>
                </div>
                <div style="font-size:0.85rem; color:#6b7280; margin-top:4px;">
                  📍 ${lot.location} • वज़न: <strong style="color:#1f2937;">${lot.approx_weight_kg} kg</strong>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:1.25rem; font-weight:800; color:#ea580c;">₹${lot.total_value_inr}</div>
                <div style="font-size:0.75rem; color:#059669; font-weight:600;">(ईपीआर बोनस: ₹${lot.epr_bonus_inr})</div>
                <button class="btn-primary" style="padding:6px 12px; font-size:0.8rem; margin-top:6px;" onclick="window.recyclerCockpit.quickAcceptLot('${lot.lot_id}')">
                  स्वीकारें व नकद दें 🤝
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- CPCB Form-6 Manifest Generator -->
      <div class="glass-card" style="background:#ffffff;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="font-size:1.15rem; color:#1f2937;">📜 सरकारी CPCB फॉर्म-6 (ई-कचरा परिवहन घोषणा)</h3>
            <p style="font-size:0.85rem; color:#6b7280;">E-Waste (Management) Rules 2022 के तहत कानूनी ट्रेसबिलिटी मेनिफेस्ट</p>
          </div>
          <button class="btn-secondary" onclick="window.recyclerCockpit.showForm6Modal()">
            📄 फॉर्म-6 देखें व प्रिंट करें
          </button>
        </div>
      </div>
    `;
  }

  handleBlipClick(desc) {
    if (window.showAppToast) {
      window.showAppToast(`📍 ${desc}`, 'info');
    }
  }

  dispatchRoute() {
    if (window.showAppToast) {
      window.showAppToast('🚚 इलेक्ट्रिक पिकअप वाहन (MH-03-EV-4412) धारावी-कुर्ला रूट पर रवाना हो गया! ETA: 18 मिनट', 'success');
    }
  }

  quickAcceptLot(lotId) {
    const txn = window.store.completeHandover(lotId, this.activeRecycler.recycler_id, 'CASH');
    if (txn) {
      if (window.showAppToast) {
        window.showAppToast(`✅ लॉट ${lotId} स्वीकार! ₹${txn.total_payout_inr} नकद भुगतान व EPR क्रेडिट जारी।`, 'success');
      }
      this.renderCockpit();
    }
  }

  showForm6Modal() {
    const modal = document.getElementById('form6Modal');
    const container = document.getElementById('form6Content');
    const txns = window.store.getTransactions();
    const firstTxn = txns[0] || {};
    const weightVal = firstTxn.weight_kg ? `${firstTxn.weight_kg} kg` : '42.5 kg';
    const subCat = firstTxn.sub_category || 'High-Grade PCBs & Heavy Copper Cables';

    if (container) {
      container.innerHTML = `
        <div style="border:2px solid #000; padding:20px; background:#fff; color:#000; font-family:serif;">
          <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:14px;">
            <h3 style="font-size:1.1rem; margin:0; text-transform:uppercase;">FORM 6 - MANIFEST FOR MOVEMENT OF E-WASTE</h3>
            <p style="font-size:0.8rem; margin:4px 0;">[See Rule 19(1) of E-Waste (Management) Rules, 2022]</p>
          </div>

          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; margin-bottom:14px;">
            <tr>
              <td style="border:1px solid #000; padding:6px; width:40%;"><strong>1. Manifest Document No:</strong></td>
              <td style="border:1px solid #000; padding:6px;">MAN-CPCB-MH-2026-00449</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:6px;"><strong>2. Informal Collector/Sender:</strong></td>
              <td style="border:1px solid #000; padding:6px;">COL-RAMU-01 (Dharavi Scrap Cluster, Mumbai)</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:6px;"><strong>3. Authorized Recycler/Receiver:</strong></td>
              <td style="border:1px solid #000; padding:6px;">Eco-Regal Green Refiners Pvt Ltd (Reg: CPCB/EPR/2023/MH/4491)</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:6px;"><strong>4. Description of E-Waste:</strong></td>
              <td style="border:1px solid #000; padding:6px;">${subCat} (Intact, Unburnt)</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:6px;"><strong>5. Total Certified Weight:</strong></td>
              <td style="border:1px solid #000; padding:6px;">${weightVal} (Scale OCR Verified)</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:6px;"><strong>6. Safe Handover Timestamp:</strong></td>
              <td style="border:1px solid #000; padding:6px;">${new Date().toLocaleString()}</td>
            </tr>
          </table>

          <div style="display:flex; justify-content:space-between; margin-top:24px; font-size:0.85rem;">
            <div>_______________________<br>कबाड़ी साथी हस्ताक्षर (Collector)</div>
            <div style="text-align:right;">_______________________<br>अधिकृत रिसाइक्लर मुहर व हस्ताक्षर</div>
          </div>
        </div>
        <button class="btn-primary" style="width:100%; margin-top:16px;" onclick="window.print()">🖨️ प्रिंट CPCB फॉर्म-6</button>
      `;
    }

    if (modal) modal.classList.add('active');
  }
}

window.recyclerCockpit = new RecyclerCockpitManager();
