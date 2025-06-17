import { useState, useEffect } from 'react';

/**
 * Ten hook zarządza całą logiką Trello: autoryzacją, stanem połączenia i wysyłaniem plików.
 */
export function useTrello() {
  const [trelloCardId, setTrelloCardId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("trello_access_token") || "");
  const [accessTokenSecret, setAccessTokenSecret] = useState(() => localStorage.getItem("trello_access_token_secret") || "");

  const isAuthorized = !!accessToken && !!accessTokenSecret;

  // Efekt uruchamiany raz, aby pobrać ID karty i ustawić nasłuchiwanie na autoryzację
  useEffect(() => {
    // Pobieranie ID karty z parametrów URL
    const params = new URLSearchParams(window.location.search);
    const cardIdFromUrl = params.get('trelloCardId');
    if (cardIdFromUrl) {
      setTrelloCardId(cardIdFromUrl);
    }

    // Nasłuchiwanie na zmiany w localStorage, które są ustawiane przez callback autoryzacji
    const handleStorageChange = (event) => {
      if (event.key === 'trello_access_token' || event.key === 'trello_access_token_secret') {
        const token = localStorage.getItem('trello_access_token');
        const secret = localStorage.getItem('trello_access_token_secret');
        if (token && secret) {
          setAccessToken(token);
          setAccessTokenSecret(secret);
          alert("Połączono z Trello!");
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Sprzątanie po odmontowaniu komponentu
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Pusta tablica oznacza, że ten efekt uruchomi się tylko raz

  // Funkcja otwierająca okno autoryzacji Trello
  const handleTrelloAuth = () => {
    const width = 600, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open('/api/trelloAuth/start.js', 'TrelloAuth', `width=${width},height=${height},left=${left},top=${top}`);
  };

  // Funkcja wysyłająca plik PDF do Trello
  const savePdfToTrello = async (pdfBlob, fileName) => {
    if (!pdfBlob) return alert("Brak pliku PDF do wysłania!");
    if (!trelloCardId) return alert("Brak ID karty Trello. Nie można zapisać.");
    if (!isAuthorized) return alert("Brak autoryzacji Trello. Najpierw połącz z Trello!");
    
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
        if (res.ok) {
          alert("PDF został zapisany w Trello!");
        } else {
          throw new Error(data.message);
        }
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