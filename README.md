## IAM International Logistics Co., Ltd. website

Static HTML + Express for IAM International Logistics — China–Nigeria procurement, trading, industrial supply and logistics.

### Run locally

```powershell
node "c:\Users\PC\ToolA BuildTech\backend\server.js"
```

Open http://localhost:3000

### Structure

- `index.html` and inner pages (`about.html`, `services.html`, `products-*.html`, `china-sourcing.html`, `quote.html`, …)
- `css/site.css`, `js/site.js`, `js/forms.js`
- `data/products.json` — category data for later CMS use
- `backend/server.js` — `/api/health`, `/api/contact`, `/api/enquiry` (quote/project/contact + optional file as base64)
- `robots.txt`, `sitemap.xml`

Copy `backend/.env.example` to `backend/.env` and set SMTP to receive enquiries by email. Without SMTP, submissions are logged on the server.

WhatsApp staff notifications use the same enquiry endpoint. Set `WHATSAPP_ENABLED=false` until Meta phone registration and a server-side access token are in place. The token stays in `backend/.env` and is never sent to the browser. Email delivery stays in place alongside WhatsApp.

Domain spelling used throughout: **iamcorperate.com**
