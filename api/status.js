module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'active',
    mode: 'vercel-edge',
    features: [
      'Acoustic Copper Resonance Analyzer (~3.1kHz FFT)',
      'CEIR Safe-Scrap Legal Shield',
      'AI Cannibalization & Re-Use Radar',
      'Proof of Responsible Handover (PORH)',
      'CPCB Form-6 Manifest Generator'
    ],
    timestamp: new Date().toISOString()
  });
};
