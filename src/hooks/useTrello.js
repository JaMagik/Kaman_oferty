import { useState, useEffect } from 'react';

/**
 * Hook zarządzający całą logiką Trello: autoryzacją, stanem połączenia i wysyłaniem plików.
 */
export function useTrello() {
  const [trelloCardId, setTrelloCardId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("trello_access_token") || "");
  const [accessTokenSecret, setAccessTokenSecret] = useState(() => localStorage.getItem("trello_access_token_secret") || "");

  const isAuthorized = !!accessToken && !!accessTokenSecret;

  // Efekt uruchamiany raz, aby pobrać ID karty i ustawić nasłuchiwanie na autoryzację
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardIdFromUrl = params.get('trelloCardId');
    if (cardIdFromUrl) {
      setTrelloCardId(cardIdFromUrl);
    }

    // Funkcja do obsługi pomyślnej autoryzacji
    const handleAuthSuccess = (token, secret) => {
      // Sprawdź !isAuthorized, aby uniknąć wielokrotnego alertu
      if (token && secret && !(localStorage.getItem("trello_access_token") && localStorage.getItem("trello_access_token_secret"))) { 
        localStorage.setItem('trello_access_token', token);
        localStorage.setItem('trello_access_token_secret', secret);
        setAccessToken(token);
        setAccessTokenSecret(secret);
        alert("Połączono z Trello!");
      }
    };

    // Listener dla metody 'storage'
    const handleStorageChange = (event) => {
      if (event.key === 'trello_access_token' || event.key === 'trello_access_token_secret') {
        const token = localStorage.getItem('trello_access_token');
        const secret = localStorage.getItem('trello_access_token_secret');
        handleAuthSuccess(token, secret);
      }
    };

    // Listener dla metody 'postMessage'
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'TRELLO_OAUTH_SUCCESS') {
        handleAuthSuccess(event.data.accessToken, event.data.accessTokenSecret);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Uruchamiamy tylko raz

  // Funkcja otwierająca okno autoryzacji Trello
  const handleTrelloAuth = () => {
    const width = 600, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open('/api/trelloAuth/start.js', 'TrelloAuth', `width=${width},height=${height},left=${left},top=${top}`);
  };

  // Funkcja wysyłająca plik PDF do Trello
  const savePdfToTrello = async (pdfBlob, fileName) => {
    if (!pdfBlob) {
        alert("Brak pliku PDF do wysłania!");
        return;
    }
    if (!trelloCardId) {
        alert("Brak ID karty Trello. Nie można zapisać.");
        return;
    }
    if (!isAuthorized) {
        alert("Brak autoryzacji Trello. Najpierw połącz z Trello!");
        return;
    }
    
    setIsSaving(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64PdfDataUrl = reader.result;
      try {
        const res = await fetch('/api/saveToTrello.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: trelloCardId,
            accessToken,
            accessTokenSecret,
            fileDataUrl: base64PdfDataUrl,
            fileName: fileName,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        alert("PDF został zapisany w Trello!");
      } catch (error) {
        alert(`Błąd zapisu w Trello: ${error.message}`);
      } finally {
        setIsSaving(false);
      }
    };
    reader.readAsDataURL(pdfBlob);
  };

  return {
    trelloCardId,
    isAuthorized,
    isSaving,
    handleTrelloAuth,
    savePdfToTrello,
  };
}