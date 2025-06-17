import React from 'react';
import { useTrello } from '../hooks/useTrello';

/**
 * Ten komponent wyświetla przyciski do interakcji z Trello.
 * Otrzymuje dane wygenerowanego PDF-a i nazwę pliku jako propsy.
 */
export default function TrelloActions({ generatedPdfData, fileName, userName }) {
  const { trelloCardId, isAuthorized, isSaving, handleTrelloAuth, savePdfToTrello } = useTrello();

  const handleSave = () => {
    const finalFileName = `Oferta_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
    savePdfToTrello(generatedPdfData, finalFileName);
  };
  
  // Jeśli nie jesteśmy w kontekście Trello (brak ID karty), nie pokazuj nic
  if (!trelloCardId) {
    return null;
  }
  
  const isReadyToSave = !!generatedPdfData;

  return (
    <div className="trello-actions-container" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      <button
        type="button"
        onClick={handleTrelloAuth}
        disabled={isAuthorized}
        style={{ width: '100%', background: isAuthorized ? "#4caf50" : "#026aa7", color: "white" }}
      >
        {isAuthorized ? "Połączono z Trello" : "Połącz z Trello"}
      </button>

      {isReadyToSave && (
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isAuthorized}
          style={{ width: '100%', marginTop: '10px' }}
        >
          {isSaving ? "Zapisywanie..." : "Zapisz w Trello"}
        </button>
      )}
    </div>
  );
}