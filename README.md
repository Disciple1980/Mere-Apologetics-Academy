# Mere Apologetics Academy — Clean Build

AI-assisted argument reconstruction training for Mere Apologetics Academy.

## Project structure

- `index.html` — mobile-first Academy UI
- `app.js` — exercise flow and feedback rendering
- `style.css` — UI styling
- `api/evaluate.js` — server-side AI Professor endpoint
- `vercel.json` — Vercel function configuration
- `manifest.json` — installable web-app metadata

## Vercel setup

Add an Environment Variable to the Vercel project:

- `OPENAI_API_KEY` — your OpenAI API key
- Optional: `OPENAI_MODEL` — defaults to `gpt-5.6-luna`

The API key is read only by the server-side function and is never included in browser code.

After adding the variable, redeploy the project.
