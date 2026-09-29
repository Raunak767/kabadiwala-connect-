// ==========================================================================
// ई-सेतु मास्टर एप्लीकेशन कंट्रोलर (app.js)
// 100% Regional Languages • Sidebar Profile & Last Month Recycler Buyer Data
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  console.log('[ई-सेतु] एप्लीकेशन लोड हो रहा है...');

  // Setup Event Listeners & Initial Render
  setupRoleSwitcher();
  setupLanguageSwitcher();
  setupPersonaSwitcher();
  setupModals();
  renderRatesBoard();
  renderKhata();
  renderUnitEconomics();
  renderSidebarProfile();

  // Listen to Store and Vernacular events
  document.addEventListener('store_ready', () => {
    renderRatesBoard();
    renderKhata();
    updateProfileUI();
    renderSidebarProfile();
  });

  document.addEventListener('lot_added', () => {
    renderKhata();
    if (window.recyclerCockpit) window.recyclerCockpit.renderCockpit();
  });

  document.addEventListener('handover_completed', () => {
    renderKhata();
    updateProfileUI();
    renderSidebarProfile();
    if (window.recyclerCockpit) window.recyclerCockpit.renderCockpit();
  });

  document.addEventListener('language_changed', () => {
    renderRatesBoard();
    renderKhata();
    renderUnitEconomics();
    updateProfileUI();
    renderSidebarProfile();
  });

  document.addEventListener('profile_changed', () => {
    updateProfileUI();
    renderKhata();
    renderSidebarProfile();
  });

  // Check Service Worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => console.log('[ई-सेतु] सर्विस वर्कर पंजीकृत हुआ।'))
      .catch((e) => console.log('[ई-सेतु] SW नोट:', e));
  }

  // Set initial vernacular translations
  if (window.vernacular) {
    window.vernacular.updateDOM();
  }
}

// 0. Sidebar Open / Close Controls (Mobile Drawer & Desktop Pane)
window.openSidebar = function() {
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
  renderSidebarProfile();
};

window.closeSidebar = function() {
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
};

// 0.1 Render Sidebar Kabadiwala Profile, Last Month Stats & Sold-To Recycler Data
function renderSidebarProfile() {
  const profile = window.store.getActiveProfile();
  if (!profile) return;

  const nameEl = document.getElementById('sidebarPersonaName');
  const roleEl = document.getElementById('sidebarPersonaRole');
  const badgeEl = document.getElementById('sidebarKarmaBadge');
  const earningsEl = document.getElementById('sidebarLastMonthEarnings');
  const wasteEl = document.getElementById('sidebarLastMonthWaste');
  const buyersListEl = document.getElementById('sidebarBuyersList');

  if (nameEl) nameEl.textContent = profile.persona_name || 'रामू शिंदे';
  if (roleEl) roleEl.textContent = `${profile.role || 'कबाड़ी साथी'} • ${profile.base_location || 'मुंबई'}`;
  if (badgeEl) badgeEl.textContent = `${profile.karma_tier || 'हरित योद्धा'} (${profile.swachh_karma_score || 680} अंक)`;

  const stats = profile.last_month_stats || { earnings_inr: 28450, waste_sold_kg: 210.5 };
  if (earningsEl) earningsEl.textContent = `₹${(stats.earnings_inr || 28450).toLocaleString('en-IN')}`;
  if (wasteEl) wasteEl.textContent = `${stats.waste_sold_kg || 210.5} kg`;

  // Render dummy data of to whom the kabad was sold to
  if (buyersListEl) {
    const buyers = profile.sold_to_recyclers || [
      {
        recycler_name: "इको-रीगल ग्रीन रिफाइनर्स प्रा. लि.",
        facility_location: "तलोजा MIDC, नवी मुंबई",
        cpcb_reg: "CPCB/EPR/2023/MH/4491",
        category: "सर्वर व कंप्यूटर मदरबोर्ड (PCB)",
        weight_kg: 68.5,
        amount_paid_inr: 26030,
        payment_mode: "नकद (CASH)",
        date: "24 अगस्त 2026",
        receipt_no: "REC-MUM-8841"
      }
    ];

    buyersListEl.innerHTML = buyers.map((b) => `
      <div class="buyer-history-card">
        <div class="buyer-company-name">🏢 ${b.recycler_name}</div>
        <div class="buyer-meta">
          📍 ${b.facility_location}<br>
          📜 CPCB Reg: <strong style="color:#c2410c;">${b.cpcb_reg}</strong><br>
          📦 माल: <strong>${b.category}</strong> (${b.weight_kg} kg)<br>
          📅 तारीख: ${b.date} • रसीद: ${b.receipt_no}
        </div>
        <div class="buyer-payout-row">
          <span class="badge ${b.payment_mode && b.payment_mode.includes('नकद') ? 'badge-green' : 'badge-gold'}" style="font-size:0.65rem;">
            ${b.payment_mode}
          </span>
          <span class="buyer-amount">+ ₹${b.amount_paid_inr.toLocaleString('en-IN')}</span>
        </div>
      </div>
    `).join('');
  }
}

// 1. Role Switcher: Collector Mobile vs. Recycler Cockpit
function setupRoleSwitcher() {
  const collectorBtn = document.getElementById('roleCollectorBtn');
  const recyclerBtn = document.getElementById('roleRecyclerBtn');
  const collectorView = document.getElementById('collectorView');
  const recyclerView = document.getElementById('recyclerCockpitView');

  if (!collectorBtn || !recyclerBtn) return;

  collectorBtn.addEventListener('click', () => {
    collectorBtn.classList.add('active');
    recyclerBtn.classList.remove('active');
    if (collectorView) collectorView.style.display = 'block';
    if (recyclerView) recyclerView.style.display = 'none';
  });

  recyclerBtn.addEventListener('click', () => {
    recyclerBtn.classList.add('active');
    collectorBtn.classList.remove('active');
    if (collectorView) collectorView.style.display = 'none';
    if (recyclerView) recyclerView.style.display = 'block';
    if (window.recyclerCockpit) window.recyclerCockpit.init();
  });
}

// 2. Language Switcher (Supports 7 Regional Languages)
function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.currentTarget || e.target;
      const lang = targetBtn.getAttribute('data-lang');
      if (window.vernacular) window.vernacular.setLanguage(lang);
      window.closeSidebar();
    });
  });
}

// 3. Field Usability Persona Switcher (Ramu vs Babu Bhai)
function setupPersonaSwitcher() {
  document.querySelectorAll('.persona-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.persona-chip').forEach(c => c.classList.remove('active'));
      const targetChip = e.currentTarget || e.target;
      targetChip.classList.add('active');
      const id = targetChip.getAttribute('data-id');
      window.store.setActiveProfile(id);
    });
  });
}

function updateProfileUI() {
  const profile = window.store.getActiveProfile();
  const karmaEl = document.getElementById('activeKarmaScore');
  const badgeEl = document.getElementById('activeTierBadge');

  if (karmaEl) karmaEl.textContent = profile.swachh_karma_score || 680;
  if (badgeEl) badgeEl.textContent = profile.karma_tier || 'हरित योद्धा';
}

// 4. Rates & Mandi Price Board
function renderRatesBoard() {
  const container = document.getElementById('ratesBoardGrid');
  if (!container) return;

  const prices = window.store.getPrices();
  const rates = prices.rates || [];
  const lang = window.vernacular ? window.vernacular.currentLang : 'hi';

  if (rates.length === 0) {
    container.innerHTML = '<p style="color:#6b7280; padding:10px;">मंडी दरें लोड हो रही हैं...</p>';
    return;
  }

  container.innerHTML = rates.map((r) => {
    const displayName = lang === 'mr' ? r.name_mr : (lang === 'bho' ? r.name_hi : r.name_hi);
    return `
      <div class="rate-card">
        <div class="rate-header">
          <span class="rate-name">${displayName}</span>
          <span class="badge ${r.trend === 'up' ? 'badge-green' : (r.trend === 'down' ? 'badge-red' : 'badge-gold')}">
            ${r.trend === 'up' ? '▲ ' + r.change_24h : (r.trend === 'down' ? '▼ ' + r.change_24h : '● ' + r.change_24h)}
          </span>
        </div>
        <div class="rate-price">₹${r.base_price} <span class="rate-unit">/ ${r.unit === 'kg' ? 'किलो' : r.unit}</span></div>
        <div class="epr-bonus-tag">
          + ₹${r.epr_bonus} ${window.vernacular ? window.vernacular.t('epr_bonus') : 'ईपीआर बोनस'} (नकद)
        </div>
      </div>
    `;
  }).join('');
}

// 5. Dost Khata (Cash & UPI Ledger)
function renderKhata() {
  const lotsContainer = document.getElementById('activeLotsContainer');
  const txnsContainer = document.getElementById('transactionsHistoryContainer');
  const lots = window.store.getActiveLots();
  const txns = window.store.getTransactions();

  if (lotsContainer) {
    if (lots.length === 0) {
      lotsContainer.innerHTML = '<p style="color:#6b7280; text-align:center; padding:16px;">कोई लंबित लॉट नहीं है। ऊपर माइक दबाकर लॉट बनाएं!</p>';
    } else {
      lotsContainer.innerHTML = lots.map((l) => `
        <div style="background:#ffffff; border:1px solid var(--peach-200); border-radius:12px; padding:14px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.02); flex-wrap:wrap; gap:8px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="color:#1f2937; font-size:0.95rem;">${l.sub_category}</strong>
              <span class="badge badge-gold">${l.lot_id}</span>
            </div>
            <div style="font-size:0.8rem; color:#6b7280; margin-top:4px;">
              वजन: <strong style="color:#1f2937;">${l.approx_weight_kg} किलो</strong> • ${l.location}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.25rem; font-weight:800; color:#ea580c;">₹${l.total_value_inr}</div>
            <button class="btn-primary" style="padding:6px 14px; font-size:0.8rem; margin-top:6px;" onclick="openHandshakeModal('${l.lot_id}')">
              🤝 हैंडओवर करें
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  if (txnsContainer) {
    if (txns.length === 0) {
      txnsContainer.innerHTML = '<p style="color:#6b7280; padding:10px; font-size:0.85rem;">कोई पिछला लेन-देन नहीं मिला।</p>';
    } else {
      txnsContainer.innerHTML = txns.map((t) => `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--peach-100); padding:10px 0; flex-wrap:wrap; gap:6px;">
          <div>
            <div style="font-size:0.9rem; color:#1f2937; font-weight:700;">${t.sub_category} (${t.weight_kg} किलो)</div>
            <div style="font-size:0.75rem; color:#6b7280;">
              ${new Date(t.timestamp).toLocaleDateString()} • ${t.recycler_name}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1rem; font-weight:800; color:#15803d;">+ ₹${t.total_payout_inr}</div>
            <span class="badge ${t.payment_mode === 'CASH' || (t.payment_mode && t.payment_mode.includes('नकद')) ? 'badge-green' : 'badge-gold'}" style="font-size:0.65rem;">
              ${t.payment_mode === 'CASH' || (t.payment_mode && t.payment_mode.includes('नकद')) ? '💵 नकद मिला' : '📱 UPI मिला'}
            </span>
          </div>
        </div>
      `).join('');
    }
  }
}

// 6. Interactive Unit Economics Calculator (100% Vernacular)
function renderUnitEconomics() {
  const container = document.getElementById('unitEconomicsContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card" style="margin-top:24px; border-left:4px solid var(--peach-500); background:#ffffff;">
      <h3 style="font-size:1.15rem; color:#1f2937; margin-bottom:6px;">💰 कमाई तुलना: पिछवाड़े जलाना vs ई-सेतु अधिकृत बिक्री</h3>
      <p style="font-size:0.85rem; color:#4b5563; margin-bottom:16px;">
        50 किलो कंप्यूटर कबाड़ (20kg मदरबोर्ड, 15kg केबल, 15kg प्लास्टिक/एसएमपीएस) पर आधारित वास्तविक तुलना:
      </p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; margin-bottom:14px;">
        <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:12px; padding:14px;">
          <h4 style="color:#be123c; font-size:0.95rem; margin-bottom:8px;">❌ अनधिकृत बिचौलिया / तेज़ाब</h4>
          <div style="font-size:0.8rem; color:#475569; line-height:1.6;">
            • कबाड़ का दबा हुआ भाव: ₹4,800<br>
            • तराजू में काँटा मारना: - ₹350<br>
            • सरकारी ईपीआर बोनस: ₹0<br>
            • स्वास्थ्य नुकसान: फेफड़े व चमड़ी जलना
          </div>
          <div style="border-top:1px solid #fecdd3; margin-top:10px; padding-top:8px;">
            <div style="font-size:0.8rem; color:#64748b;">जेब में कुल नकद:</div>
            <div style="font-size:1.4rem; font-weight:800; color:#dc2626;">₹4,450</div>
          </div>
        </div>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px;">
          <h4 style="color:#15803d; font-size:0.95rem; margin-bottom:8px;">✅ ई-सेतु अधिकृत रिसाइक्लर</h4>
          <div style="font-size:0.8rem; color:#475569; line-height:1.6;">
            • पारदर्शी मंडी भाव: ₹5,600<br>
            • काँटा परख (0% धोखाधड़ी): ₹0 नुकसान<br>
            • सीधा नकद EPR बोनस: + ₹650<br>
            • सुरक्षा किट + स्वास्थ्य बीमा कवर
          </div>
          <div style="border-top:1px solid #bbf7d0; margin-top:10px; padding-top:8px;">
            <div style="font-size:0.8rem; color:#64748b;">जेब में कुल नकद:</div>
            <div style="font-size:1.4rem; font-weight:800; color:#059669;">₹6,250 (+40.4% अधिक!)</div>
          </div>
        </div>
      </div>
      <div style="font-size:0.85rem; color:#c2410c; text-align:center; font-weight:700; background:#fff7ed; padding:10px; border-radius:8px; border:1px solid var(--peach-200);">
        💡 ई-सेतु से जुड़कर हर कबाड़ी साथी प्रति माह ₹12,000 से ₹18,000 तक अतिरिक्त नकद कमा सकता है!
      </div>
    </div>
  `;
}

// 7. Modals Control & Cleanup
function setupModals() {
  const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    if (window.scrapLens) window.scrapLens.stopCamera();
    if (window.acousticTester) window.acousticTester.stop();
    if (window.porhHandshake) window.porhHandshake.stopCountdown();
  };

  // Close button click
  document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  // Overlay click to close
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function openScannerModal() {
  const modal = document.getElementById('scannerModal');
  const video = document.getElementById('scannerVideo');
  const results = document.getElementById('scannerResultsContainer');
  if (modal) modal.classList.add('active');
  if (window.scrapLens) {
    window.scrapLens.startCamera(video);
    window.scrapLens.renderAnalysisResult(results, 'pcb_gold');
  }
}

function openAcousticModal() {
  const modal = document.getElementById('acousticModal');
  const canvas = document.getElementById('frequencyCanvas');
  if (modal) modal.classList.add('active');
  if (window.acousticTester) {
    window.acousticTester.initCanvas(canvas);
    window.acousticTester.startTest();
  }
}

function openLegalShieldModal() {
  const modal = document.getElementById('legalShieldModal');
  const container = document.getElementById('legalShieldContent');
  if (modal) modal.classList.add('active');
  if (window.legalShield) {
    window.legalShield.renderCertificateHTML(container);
  }
}

function openCannibalizationModal() {
  const modal = document.getElementById('cannibalModal');
  const container = document.getElementById('cannibalContent');
  if (modal) modal.classList.add('active');
  if (window.cannibalizationRadar) {
    window.cannibalizationRadar.renderAnalysisHTML(container, 0);
  }
}

function openHandshakeModal(lotId) {
  const modal = document.getElementById('handshakeModal');
  const container = document.getElementById('handshakeContent');
  if (modal) modal.classList.add('active');
  if (window.porhHandshake) {
    window.porhHandshake.renderHandshakeModal(container, lotId);
  }
}

// Toast Alert Helper
window.showAppToast = function(msg, type = 'info') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #ffffff;
      color: #ea580c;
      padding: 12px 24px;
      border-radius: 9999px;
      border: 2px solid var(--peach-400);
      box-shadow: 0 10px 30px rgba(249, 115, 22, 0.25);
      z-index: 2000;
      font-size: 0.95rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      max-width: 90vw;
      text-align: center;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.pointerEvents = 'auto';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
  }, 3500);
};

// Global Exposure
window.openScannerModal = openScannerModal;
window.openAcousticModal = openAcousticModal;
window.openLegalShieldModal = openLegalShieldModal;
window.openCannibalizationModal = openCannibalizationModal;
window.openHandshakeModal = openHandshakeModal;
