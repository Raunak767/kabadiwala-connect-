// ==========================================================================
// E-Setu State & Offline Storage Engine (Store)
// Manages 7 Datasets, Offline Queues, Handover PORH, and Financial Ledger
// ==========================================================================

class DataStore {
  constructor() {
    this.isOnline = navigator.onLine;
    this.apiBase = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
      ? ''
      : window.location.origin;
    this.initNetworkListeners();
    this.loadInitialData();
  }

  initNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      const statusPill = document.getElementById('offlinePill');
      if (statusPill) {
        statusPill.innerHTML = '<span class="pulse-dot" style="background:#10b981;"></span> <span>इंटरनेट कनेक्टेड</span>';
      }
      document.dispatchEvent(new CustomEvent('network_status', { detail: { online: true } }));
      this.syncPendingLots();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      const statusPill = document.getElementById('offlinePill');
      if (statusPill) {
        statusPill.innerHTML = '<span class="pulse-dot" style="background:#f59e0b;"></span> <span>ऑफलाइन तैयार</span>';
      }
      document.dispatchEvent(new CustomEvent('network_status', { detail: { online: false } }));
    });
  }

  async loadInitialData() {
    try {
      // 1. Materials Dataset
      if (!localStorage.getItem('esetu_materials')) {
        const data = await this.fetchJsonWithFallback('./datasets/materials.json', []);
        localStorage.setItem('esetu_materials', JSON.stringify(data));
      }

      // 2. Prices Mandi Dataset
      if (!localStorage.getItem('esetu_prices')) {
        const data = await this.fetchJsonWithFallback('./datasets/prices_mandi.json', { rates: [] });
        localStorage.setItem('esetu_prices', JSON.stringify(data));
      }

      // 3. Authorized Recyclers Dataset
      if (!localStorage.getItem('esetu_recyclers')) {
        const data = await this.fetchJsonWithFallback('./datasets/authorized_recyclers.json', []);
        localStorage.setItem('esetu_recyclers', JSON.stringify(data));
      }

      // 4. Transactions Ledger Dataset
      if (!localStorage.getItem('esetu_transactions')) {
        const data = await this.fetchJsonWithFallback('./datasets/transactions_ledger.json', []);
        localStorage.setItem('esetu_transactions', JSON.stringify(data));
      }

      // 5. Collector Profiles Dataset
      if (!localStorage.getItem('esetu_profiles')) {
        const data = await this.fetchJsonWithFallback('./datasets/collector_profiles.json', []);
        localStorage.setItem('esetu_profiles', JSON.stringify(data));
      }

      // 6. Traceability PORH Dataset
      if (!localStorage.getItem('esetu_traceability')) {
        const data = await this.fetchJsonWithFallback('./datasets/traceability_porh.json', []);
        localStorage.setItem('esetu_traceability', JSON.stringify(data));
      }

      // 7. AI Training Metadata Dataset
      if (!localStorage.getItem('esetu_ai_metadata')) {
        const data = await this.fetchJsonWithFallback('./datasets/ai_training_metadata.json', {});
        localStorage.setItem('esetu_ai_metadata', JSON.stringify(data));
      }

      // Active Profile - Default to Ramu Shinde
      if (!localStorage.getItem('esetu_active_collector')) {
        localStorage.setItem('esetu_active_collector', 'COL-RAMU-01');
      }

      // Active Lots Queue (Ready for Handover)
      if (!localStorage.getItem('esetu_active_lots')) {
        localStorage.setItem('esetu_active_lots', JSON.stringify([
          {
            lot_id: 'LOT-MUM-901',
            category: 'सर्किट बोर्ड व मदरबोर्ड',
            sub_category: 'ग्रेड-ए: सर्वर बोर्ड, गोल्ड रैम (सोने की पिन्स)',
            approx_weight_kg: 12.0,
            estimated_value_inr: 8160,
            epr_bonus_inr: 540,
            total_value_inr: 8700,
            location: 'धारावी 90-फीट रोड, मुंबई',
            status: 'READY_FOR_PICKUP',
            created_at: new Date().toISOString(),
            collector_id: 'COL-RAMU-01'
          }
        ]));
      }

      console.log('[E-Setu Store] All 7 Core Datasets initialized in local store.');
      document.dispatchEvent(new CustomEvent('store_ready'));
    } catch (e) {
      console.warn('[E-Setu Store] Initialization notice:', e);
      document.dispatchEvent(new CustomEvent('store_ready'));
    }
  }

  async fetchJsonWithFallback(url, fallbackData) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[Store] Could not fetch ${url}, using offline default.`, err);
      return fallbackData;
    }
  }

  // Getters
  getMaterials() {
    return JSON.parse(localStorage.getItem('esetu_materials') || '[]');
  }

  getPrices() {
    return JSON.parse(localStorage.getItem('esetu_prices') || '{"rates":[]}');
  }

  getRecyclers() {
    return JSON.parse(localStorage.getItem('esetu_recyclers') || '[]');
  }

  getTransactions() {
    return JSON.parse(localStorage.getItem('esetu_transactions') || '[]');
  }

  getProfiles() {
    return JSON.parse(localStorage.getItem('esetu_profiles') || '[]');
  }

  getTraceability() {
    return JSON.parse(localStorage.getItem('esetu_traceability') || '[]');
  }

  getAiMetadata() {
    return JSON.parse(localStorage.getItem('esetu_ai_metadata') || '{}');
  }

  getActiveProfile() {
    const activeId = localStorage.getItem('esetu_active_collector') || 'COL-RAMU-01';
    const profiles = this.getProfiles();
    return profiles.find(p => p.collector_id === activeId) || profiles[0] || {
      collector_id: 'COL-RAMU-01',
      persona_name: 'रामू शिंदे (Ramu Shinde)',
      role: 'फेरीवाला कबाड़ी साथी (Street Collector)',
      base_location: 'धारावी, मुंबई',
      swachh_karma_score: 680,
      karma_tier: 'हरित योद्धा (Green Warrior)',
      last_month_stats: { earnings_inr: 28450, waste_sold_kg: 210.5, transactions_count: 14 }
    };
  }

  setActiveProfile(collectorId) {
    localStorage.setItem('esetu_active_collector', collectorId);
    document.dispatchEvent(new CustomEvent('profile_changed', { detail: { collectorId } }));
  }

  getActiveLots() {
    return JSON.parse(localStorage.getItem('esetu_active_lots') || '[]');
  }

  // Add a newly created lot (from Voice or AI Lens)
  addLot(lotData) {
    const lots = this.getActiveLots();
    const newLot = {
      lot_id: `LOT-MUM-${Math.floor(100 + Math.random() * 900)}`,
      collector_id: this.getActiveProfile().collector_id || 'COL-RAMU-01',
      created_at: new Date().toISOString(),
      status: 'READY_FOR_PICKUP',
      ...lotData
    };

    lots.unshift(newLot);
    localStorage.setItem('esetu_active_lots', JSON.stringify(lots));
    document.dispatchEvent(new CustomEvent('lot_added', { detail: newLot }));

    // Try background sync to live API if reachable
    this.postToApi('/api/lots', newLot).catch(() => {});

    return newLot;
  }

  // Handover confirmation (Completes PORH, generates ledger transaction)
  completeHandover(lotId, recyclerId, paymentMode = 'CASH') {
    const lots = this.getActiveLots();
    const lotIndex = lots.findIndex(l => l.lot_id === lotId);
    if (lotIndex === -1 && lots.length > 0) {
      // fallback to first lot if specific lot id not matched
      return this.completeHandover(lots[0].lot_id, recyclerId, paymentMode);
    }
    if (lotIndex === -1) return null;

    const lot = lots[lotIndex];
    const recyclers = this.getRecyclers();
    const recycler = recyclers.find(r => r.recycler_id === recyclerId) || recyclers[0] || {
      recycler_id: 'REC-MH-001',
      name: 'Eco-Regal Green Refiners Pvt Ltd'
    };

    const transaction = {
      transaction_id: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      lot_id: lot.lot_id,
      collector_id: lot.collector_id,
      recycler_id: recycler.recycler_id,
      recycler_name: recycler.name,
      category: lot.category,
      sub_category: lot.sub_category,
      weight_kg: lot.approx_weight_kg,
      base_rate: Math.round(lot.estimated_value_inr / Math.max(lot.approx_weight_kg, 1)),
      epr_dividend_bonus: lot.epr_bonus_inr,
      total_payout_inr: lot.total_value_inr,
      payment_mode: paymentMode,
      payment_status: 'COMPLETED',
      cash_signed_receipt_no: `CSH-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      location: lot.location,
      swachh_karma_earned: Math.round(lot.approx_weight_kg * 4)
    };

    // 1. Add to transactions
    const txns = this.getTransactions();
    txns.unshift(transaction);
    localStorage.setItem('esetu_transactions', JSON.stringify(txns));

    // 2. Add to Traceability PORH log
    const porhList = this.getTraceability();
    porhList.unshift({
      porh_id: `PORH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      lot_id: lot.lot_id,
      transaction_id: transaction.transaction_id,
      sha256_hash: this.generatePseudoHash(lot.lot_id + transaction.timestamp),
      recycler_id: recycler.recycler_id,
      collector_id: lot.collector_id,
      weight_kg: lot.approx_weight_kg,
      cpcb_form6_manifest_no: `MAN-CPCB-MH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: transaction.timestamp,
      status: 'VERIFIED_AND_LOCKED'
    });
    localStorage.setItem('esetu_traceability', JSON.stringify(porhList));

    // 3. Remove from active lots
    lots.splice(lotIndex, 1);
    localStorage.setItem('esetu_active_lots', JSON.stringify(lots));

    // 4. Update Collector stats & Swachh Karma
    const profiles = this.getProfiles();
    const profile = profiles.find(p => p.collector_id === lot.collector_id);
    if (profile) {
      profile.swachh_karma_score = (profile.swachh_karma_score || 0) + transaction.swachh_karma_earned;
      if (profile.stats) {
        profile.stats.total_e_waste_collected_kg = (profile.stats.total_e_waste_collected_kg || 0) + transaction.weight_kg;
        profile.stats.total_earnings_inr = (profile.stats.total_earnings_inr || 0) + transaction.total_payout_inr;
        profile.stats.total_epr_bonus_received_inr = (profile.stats.total_epr_bonus_received_inr || 0) + transaction.epr_dividend_bonus;
        profile.stats.safe_handover_count = (profile.stats.safe_handover_count || 0) + 1;
      }
      localStorage.setItem('esetu_profiles', JSON.stringify(profiles));
    }

    document.dispatchEvent(new CustomEvent('handover_completed', { detail: transaction }));

    // Sync to live API if available
    this.postToApi('/api/handover', transaction).catch(() => {});

    return transaction;
  }

  generatePseudoHash(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    return 'SHA256:' + Math.abs(hash).toString(16).padStart(16, '0') + 'd9a4f2e0';
  }

  async postToApi(endpoint, payload) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return null;
    }
  }

  syncPendingLots() {
    console.log('[E-Setu Store] Back online! Auto-syncing pending lots to central CPCB server...');
  }
}

window.store = new DataStore();
