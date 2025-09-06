const Url = require('../models/Url');
const generateShortcode = require('../utils/generateShortcode');

// Helper to get expiry date
function getExpiry(minutes) {
    return new Date(Date.now() + minutes * 60000);
}

exports.shortenUrl = async (req, res) => {
    const { originalUrl, validity, customCode } = req.body;
    if (!originalUrl) return res.status(400).json({ error: 'Original URL required.' });

    let shortcode = customCode || generateShortcode();
    let expiresAt = getExpiry(validity || 30);

    // Ensure global uniqueness
    let exists = await Url.findOne({ shortcode });
    if (exists) {
        if (customCode) return res.status(409).json({ error: 'Custom shortcode already in use.' });
        // Try to generate a new one
        do {
            shortcode = generateShortcode();
            exists = await Url.findOne({ shortcode });
        } while (exists);
    }

    const urlDoc = new Url({ originalUrl, shortcode, expiresAt });
    await urlDoc.save();
    res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${shortcode}`, expiresAt });
};

exports.redirectUrl = async (req, res) => {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ shortcode: code });
    if (!urlDoc) return res.status(404).json({ error: 'Short URL not found.' });
    if (urlDoc.expiresAt < new Date()) return res.status(410).json({ error: 'Short URL expired.' });
    urlDoc.visits += 1;
    await urlDoc.save();
    res.redirect(urlDoc.originalUrl);
};

exports.getAnalytics = async (req, res) => {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ shortcode: code });
    if (!urlDoc) return res.status(404).json({ error: 'Short URL not found.' });
    res.json({
        originalUrl: urlDoc.originalUrl,
        shortcode: urlDoc.shortcode,
        createdAt: urlDoc.createdAt,
        expiresAt: urlDoc.expiresAt,
        visits: urlDoc.visits
    });
};
