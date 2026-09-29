module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const imei = (req.query && req.query.imei) || 'IMEI-863920048192014';
  const isClean = !imei.includes('STOLEN');
  
  res.status(200).json({
    imei: imei,
    ceir_status: isClean ? 'CLEAN_VERIFIED' : 'BLACKLISTED_STOLEN',
    safe_to_recycle: isClean,
    certificate_clause: 'E-Waste Rules 2022 - Section 4(3) Safe Transport Exemption',
    timestamp: new Date().toISOString()
  });
};
