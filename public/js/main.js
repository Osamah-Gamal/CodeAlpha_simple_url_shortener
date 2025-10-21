
// for shorten url and create a new url...
async function shortenUrl() {
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const originalUrlSpan = document.getElementById('originalUrl');
    const shortUrlLink = document.getElementById('shortUrl');
    
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.success) {
            originalUrlSpan.textContent = data.originalUrl;
            shortUrlLink.textContent = data.shortUrl;
            shortUrlLink.href = data.shortUrl;
            resultDiv.style.display = 'block';
            urlInput.value = '';
            
           
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while shortening the URL');
    }
}

// copy url to clipboard
async function copyToClipboard() {
    const shortUrl = document.getElementById('shortUrl').href;
    
    try {
        await navigator.clipboard.writeText(shortUrl);
        alert('Link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy link..!!');
    }
}

// load all urls...
async function loadStats() {
    try {
        const response = await fetch('/api/urls');
        const urls = await response.json();
        
        const statsDiv = document.getElementById('stats');
        
        if (urls.length === 0) {
            statsDiv.innerHTML = '<p>No links yet</p>';
            return;
        }
        
        let html = `
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Short url</th>
                        <th>Original url</th>
                        <th>Creat at</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        urls.forEach(url => {
            const shortUrl = `${url.short_code}`;
            const createdDate = new Date(url.created_at).toLocaleDateString();
            
            html += `
                <tr>
                    <td><a href="${shortUrl}" target="_blank">${shortUrl}</a></td>
                    <td title="${url.original_url}">${url.original_url.substring(0, 50)}...</td>
                    <td>${createdDate}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        statsDiv.innerHTML = html;
    } catch (error) {
        console.error('Error loading stats:', error);
        alert('Error loading statistics');
    }
}

// handel input search...
function handleSearch() {
    const searchTerm = document.getElementById('urlInput').value.trim();
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    searchUrls(searchTerm);
}
// searching...
async function searchUrls(searchTerm) {
    const searchResults = document.getElementById('searchResults');
    const resultDiv = document.getElementById('result');
    
    // ---
    resultDiv.style.display = 'none';

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const urls = await response.json();
        
        if (urls.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>No results found for "${searchTerm}"</p>
                    <p>Try a different search term or create a new short URL</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-info">
                <h4>🔍 Search Results</h4>
                <p>Found ${urls.length} result(s) for "${searchTerm}"</p>
                <button onclick="clearSearch()" class="clear-search">Clear Search</button>
            </div>
            <table class="search-table">
                <thead>
                    <tr>
                        <th>Short url</th>
                        <th>Original url</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        urls.forEach(url => {
            const shortUrl = `${url.short_code}`;
            const createdDate = new Date(url.created_at).toLocaleDateString();
            
            html += `
                <tr>
                    <td><a href="${shortUrl}" target="_blank">${shortUrl}</a></td>
                    <td title="${url.original_url}">${url.original_url.substring(0, 50)}${url.original_url.length > 50 ? '...' : ''}</td>
                    <td>${createdDate}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        searchResults.innerHTML = html;
    } catch (error) {
        console.error('Error searching:', error);
        alert('Error performing search');
    }
}

// clear ...
function clearSearch() {
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('urlInput').value = '';
    document.getElementById('result').style.display = 'none';
}


// for ues enter key from keyboard...
document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        shortenUrl();
    }
});

// fouc..
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('urlInput').focus();
});