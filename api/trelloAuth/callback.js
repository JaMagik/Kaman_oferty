import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import fetch from 'node-fetch';

const OAUTH_ACCESS_TOKEN_URL = 'https://trello.com/1/OAuthGetAccessToken';
const TRELLO_PUBLIC_API_KEY = process.env.TRELLO_PUBLIC_API_KEY;
const TRELLO_SECRET = process.env.TRELLO_SECRET;

// Upewnij się, że ten adres jest poprawny!
const APP_BASE_URL = 'https://kaman-oferty.vercel.app';
  
const parseCookies = (cookieHeader) => {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });
  return list;
};

export default async function handler(req, res) {
  if (!TRELLO_PUBLIC_API_KEY || !TRELLO_SECRET) {
    return res.status(500).send("Brak kluczy Trello w zmiennych środowiskowych.");
  }
  
  const { oauth_token, oauth_verifier } = req.query;
  const cookies = parseCookies(req.headers.cookie);
  const oauth_token_secret = cookies.trello_oauth_secret;

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).send("Brak wymaganych parametrów autoryzacji. Sesja mogła wygasnąć.");
  }

  const oauth = OAuth({
    consumer: { key: TRELLO_PUBLIC_API_KEY, secret: TRELLO_SECRET },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  const request_data = {
    url: OAUTH_ACCESS_TOKEN_URL,
    method: 'POST',
    data: { oauth_token, oauth_verifier }
  };
  
  const params = new URLSearchParams();
  params.append('oauth_token', oauth_token);
  params.append('oauth_verifier', oauth_verifier);

  const headers = oauth.toHeader(
    oauth.authorize(request_data, { key: oauth_token, secret: oauth_token_secret })
  );

  try {
    const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const text = await response.text();
    // Usuń ciasteczko po użyciu
    res.setHeader('Set-Cookie', 'trello_oauth_secret=; HttpOnly; Path=/; Max-Age=0');

    if (!response.ok) {
      return res.status(response.status).send(`Błąd podczas pobierania tokenu dostępu z Trello: ${text}`);
    }

    const accessParams = new URLSearchParams(text);
    const accessToken = accessParams.get('oauth_token');
    const accessTokenSecret = accessParams.get('oauth_token_secret');

    if (!accessToken || !accessTokenSecret) {
      return res.status(400).send("Niekompletne dane uwierzytelniające otrzymane z Trello.");
    }

    // Wyślij odpowiedź HTML, która uruchomi skrypt w przeglądarce
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Autoryzacja Trello</title></head>
        <body>
          <p>Autoryzacja zakończona pomyślnie. To okno zostanie zamknięte.</p>
          <script>
            const payload = {
              type: 'TRELLO_OAUTH_SUCCESS',
              accessToken: '${accessToken}',
              accessTokenSecret: '${accessTokenSecret}'
            };
  
            // Metoda 1: Zapis do localStorage (dla listenera 'storage')
            try {
              localStorage.setItem('trello_access_token', payload.accessToken);
              localStorage.setItem('trello_access_token_secret', payload.accessTokenSecret);
            } catch (e) {
              console.error('Błąd zapisu do localStorage', e);
            }
            
            // Metoda 2: Wysłanie wiadomości do okna-rodzica (jako fallback)
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(payload, '${APP_BASE_URL}');
            }
  
            // Zamknij okno
            setTimeout(() => { window.close(); }, 150);
          </script>
        </body>
      </html>
    `);
  } catch (e) {
    res.status(500).send("Wystąpił wewnętrzny błąd serwera: " + e.message);
  }
}