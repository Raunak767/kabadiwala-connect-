module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    platform: 'vercel-serverless',
    service: 'e-setu-platform',
    version: '2026.1.0',
    timestamp: new Date().toISOString(),
    cpcb_compliance: 'E-Waste (Management) Rules, 2022'
  });
};
