const Url = require('../models/Url');

// for show the init home => "index.ejs"
exports.getHomePage = (req, res) => {
    res.render('index');
};


// for redirect to original url...
exports.redirectToUrl = (req, res) => {
    const { shortCode } = req.params;

    console.log('Attempting to redirect short url...:', shortCode);

    Url.findUrlByShortCode(shortCode, (err, url) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal server error');
        }

        if (!url) {
            console.log('Short URL not found:', shortCode);
            return res.status(404).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>Short URL Not Found..!!</h1>
                        <p>The short URL <strong>${shortCode}</strong> does not exist.</p>
                        <a href="/">← Back to Home</a>
                    </body>
                </html>
            `);
        }

         // redirect to the original url...
        console.log('Redirecting to:', url.original_url);

        res.redirect(url.original_url);
    });
};


// for shorten url and insert new url...
exports.shortenUrl = async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

         try{
            new URL(url);
        }
        catch{
            return res.status(400).json({error:"invalid url !!"});
        }

        Url.insertUrl(url, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }

            // ex: https://.....
            const shortUrl = `${result.shortCode}`;
            
            res.json({
                success: true,
                shortUrl: shortUrl,
                originalUrl: url,
                shortCode: result.shortCode
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// for get all urls 
exports.getAllUrls = (req, res) => {
    Url.getAllUrls((err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error!' });
        }
        res.json(rows);
    });
};
// في controllers/urlController.js - أضف هذه الدالة
exports.searchUrls = (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    Url.searchUrls(q, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
};