// ==========================================================================
// ई-सेतु पुर्ज़ा बचाओ (Cannibalization & Re-Use Radar - 100% Regional)
// Identifies reusable components to fetch 4x-10x higher income than shredding
// ==========================================================================

class CannibalizationRadar {
  constructor() {
    this.currentIndex = 0;
    this.sampleDevices = [
      {
        id: 'dev-laptop-lenovo',
        name: 'पुराना लेनोवो थिंकपैड लैपटॉप (Lenovo Laptop)',
        scrap_weight_kg: 2.2,
        scrap_shred_value_inr: 180,
        reusable_components: [
          { name: '8GB DDR4 लैपटॉप रैम (RAM)', condition: '100% चालू स्थिति', repair_market_val: 650, market_hub: 'लैमिंगटन रोड रिपेयर मार्केट' },
          { name: '256GB तेज SSD स्टोरेज', condition: 'स्वस्थ व सुरक्षित डेटा', repair_market_val: 700, market_hub: 'कुर्ला इलेक्ट्रॉनिक्स मार्केट' },
          { name: '14 इंच फुल-एचडी स्क्रीन डिस्प्ले', condition: 'साबुत, कोई दरार नहीं', repair_market_val: 1200, market_hub: 'नेहरू प्लेस रिपेयर हब' }
        ],
        total_cannibal_value_inr: 2550,
        extra_earnings_inr: 2370
      },
      {
        id: 'dev-desktop-pc',
        name: 'पुराना डेस्कटॉप कंप्यूटर कैबिनेट (Desktop PC)',
        scrap_weight_kg: 6.5,
        scrap_shred_value_inr: 320,
        reusable_components: [
          { name: '500W पावर सप्लाई (SMPS)', condition: 'वोल्टेज स्थिर व चालू', repair_market_val: 450, market_hub: 'धारावी रिपेयर क्लस्टर' },
          { name: '16GB डेस्कटॉप रैम स्टिक', condition: 'जांची हुई चालू रैम', repair_market_val: 800, market_hub: 'लैमिंगटन रोड रिपेयर मार्केट' },
          { name: 'तांबे का भारी कूलिंग फैन', condition: 'शुद्ध तांबे के पाइप', repair_market_val: 350, market_hub: 'कुर्ला स्क्रैप यार्ड' }
        ],
        total_cannibal_value_inr: 1600,
        extra_earnings_inr: 1280
      },
      {
        id: 'dev-smart-tv',
        name: '32-इंच एलईडी स्मार्ट टीवी (32" Smart LED TV)',
        scrap_weight_kg: 4.8,
        scrap_shred_value_inr: 140,
        reusable_components: [
          { name: 'एलईडी बैकलाइट ड्राइवर बोर्ड', condition: 'बिना शॉर्ट सर्किट', repair_market_val: 550, market_hub: 'ग्रांट रोड रिपेयर क्लस्टर' },
          { name: 'एचडी मदरबोर्ड व वाई-फाई कार्ड', condition: 'सॉफ्टवेयर चालू', repair_market_val: 850, market_hub: 'सीलमपुर मार्केट, दिल्ली' },
          { name: 'स्टीरियो स्पीकर यूनिट (20W)', condition: 'साउंड क्लीयर', repair_market_val: 250, market_hub: 'कुर्ला वेस्ट मार्केट' }
        ],
        total_cannibal_value_inr: 1650,
        extra_earnings_inr: 1510
      }
    ];
  }

  analyzeDevice(index = 0) {
    this.currentIndex = index;
    return this.sampleDevices[index] || this.sampleDevices[0];
  }

  renderAnalysisHTML(containerElement, deviceIndex = 0) {
    this.currentIndex = deviceIndex;
    const dev = this.analyzeDevice(deviceIndex);
    const lang = window.vernacular.currentLang;

    containerElement.innerHTML = `
      <div style="background:#ffffff; border:1px solid var(--peach-200); border-radius:16px; padding:16px;">
        
        <!-- Device Tab Selector -->
        <div style="display:flex; gap:6px; margin-bottom:14px; overflow-x:auto; padding-bottom:4px;">
          <button class="btn-secondary" style="font-size:0.78rem; padding:6px 10px; ${deviceIndex === 0 ? 'background:linear-gradient(135deg, #ff8a65, #ea580c); color:#fff; border-color:#ea580c;' : ''}" onclick="window.cannibalizationRadar.renderAnalysisHTML(document.getElementById('cannibalContent'), 0)">
            💻 लेनोवो लैपटॉप
          </button>
          <button class="btn-secondary" style="font-size:0.78rem; padding:6px 10px; ${deviceIndex === 1 ? 'background:linear-gradient(135deg, #ff8a65, #ea580c); color:#fff; border-color:#ea580c;' : ''}" onclick="window.cannibalizationRadar.renderAnalysisHTML(document.getElementById('cannibalContent'), 1)">
            🖥️ डेस्कटॉप कैबिनेट
          </button>
          <button class="btn-secondary" style="font-size:0.78rem; padding:6px 10px; ${deviceIndex === 2 ? 'background:linear-gradient(135deg, #ff8a65, #ea580c); color:#fff; border-color:#ea580c;' : ''}" onclick="window.cannibalizationRadar.renderAnalysisHTML(document.getElementById('cannibalContent'), 2)">
            📺 32" स्मार्ट टीवी
          </button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <span class="badge badge-gold">एआई पुर्ज़ा बचाओ राडार</span>
            <h3 style="font-size:1.15rem; color:#1f2937; margin-top:6px;">${dev.name}</h3>
            <p style="font-size:0.85rem; color:#6b7280;">कबाड़ वजन: ${dev.scrap_weight_kg} किलो</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:#6b7280;">तोड़ने का कबाड़ भाव:</div>
            <div style="font-size:1.1rem; color:#dc2626; font-weight:700; text-decoration:line-through;">₹${dev.scrap_shred_value_inr}</div>
          </div>
        </div>

        <div style="background:#fff7ed; border:1px solid var(--peach-300); border-radius:12px; padding:14px; margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.8rem; color:#c2410c; font-weight:700;">💡 पुर्ज़े अलग करके बेचने का मूल्य:</div>
              <div style="font-size:1.8rem; color:#ea580c; font-weight:900;">₹${dev.total_cannibal_value_inr}</div>
            </div>
            <div class="badge badge-green" style="font-size:0.85rem; padding:8px 14px;">
              + ₹${dev.extra_earnings_inr} अतिरिक्त नकद!
            </div>
          </div>
        </div>

        <h4 style="font-size:0.95rem; color:#1f2937; margin-bottom:10px;">
          🔍 चालू पुर्ज़े (जिन्हें तोड़ना नहीं है):
        </h4>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${dev.reusable_components.map(c => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; border:1px solid var(--peach-200); padding:10px 14px; border-radius:8px;">
              <div>
                <strong style="color:#1f2937; font-size:0.9rem;">${c.name}</strong>
                <div style="font-size:0.75rem; color:#059669; font-weight:600;">● ${c.condition} • ${c.market_hub}</div>
              </div>
              <div style="font-size:1.1rem; font-weight:800; color:#ea580c;">₹${c.repair_market_val}</div>
            </div>
          `).join('')}
        </div>

        <button class="btn-primary" style="width:100%; margin-top:18px;" onclick="window.cannibalizationRadar.confirmHarvesting('${dev.id}', ${dev.total_cannibal_value_inr})">
          🤝 नजदीकी रिपेयर दुकान को भेजें (सीधी कमाई)
        </button>
      </div>
    `;

    const voiceAlerts = {
      hi: `रुकिए! इसके चालू पुर्ज़ों को कबाड़ में न तोड़ें, रिपेयर मार्केट में ₹${dev.total_cannibal_value_inr} मिलेंगे!`,
      mr: `सावधान! या उपकरणाचे सुटे भाग चालू आहेत. भंगारात फोडू नका, ₹${dev.total_cannibal_value_inr} मिळतील!`,
      bho: `रुकीं! एह सामान के पुर्जा एकदम चालू बा। एकरा के कबाड़ में मत तोड़ीं, रिपेयर दुकान से ₹${dev.total_cannibal_value_inr} मिली!`,
      pa: `ਰੁਕੋ ਜੀ! ਇਸਦੇ ਸਪੇਅਰ ਪਾਰਟਸ ਬਿਲਕੁਲ ਚਾਲੂ ਹਨ। ਇਸਨੂੰ ਕਬਾੜ ਵਿੱਚ ਨਾ ਤੋੜੋ, ਰਿਪੇਅਰ ਮਾਰਕੀਟ 'ਚੋਂ ₹${dev.total_cannibal_value_inr} ਮਿਲਣਗੇ!`,
      bn: `থামুন! এর যন্ত্রাংশগুলো সচল আছে। ভাঙারিতে না ভেঙে রিপেয়ার দোকানে দিলে ₹${dev.total_cannibal_value_inr} টাকা পাবেন!`,
      ta: `பொறுங்கள்! இதன் பாகங்கள் வேலை செய்கின்றன. உடைக்காதீர்கள், ₹${dev.total_cannibal_value_inr} கிடைக்கும்!`,
      te: `ఆగండి! దీని విడిభాగాలు పనిచేస్తున్నాయి. పగలగొట్టకండి, రిపేర్ మార్కెట్‌లో ₹${dev.total_cannibal_value_inr} లభిస్తాయి!`
    };

    window.voiceEngine.speak(voiceAlerts[lang] || voiceAlerts['hi']);
  }

  confirmHarvesting(devId, value) {
    if (window.showAppToast) {
      window.showAppToast(`✅ रिपेयर मार्केट कनेक्ट हो गया! ऑर्डर मूल्य: ₹${value}`, 'success');
    }
  }
}

window.cannibalizationRadar = new CannibalizationRadar();
