// src/utils/oknaNestPdfGenerator.jsx
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// Definiujemy ścieżki do szablonów dla Okien Nest
const OKNA_NEST_COVER_PATH = '/pdf_templates/okna_nest/1_okladka_okna_nest.pdf';
const COMMON_CONTACT_PAGE_PATH = '/pdf_templates/common/5_kontakt_nest.pdf'; // Reużywamy wspólnej strony kontaktowej

export async function generateOknaNestPDF(userName, uploadedPdfFile) {
  if (!userName?.trim() || !uploadedPdfFile) {
    alert('Brak nazwy klienta lub pliku PDF!');
    return null;
  }

  try {
    // --- WCZYTANIE POTRZEBNYCH PLIKÓW ---
    const assetsToLoad = [
      fetch(OKNA_NEST_COVER_PATH).then(res => {
        if (!res.ok) throw new Error(`Nie udało się wczytać okładki Okna Nest: ${OKNA_NEST_COVER_PATH}. Sprawdź ścieżkę i czy plik istnieje w 'public'.`);
        return res.arrayBuffer();
      }),
      uploadedPdfFile.arrayBuffer(), // Wczytaj zawartość wgranego pliku
      fetch(COMMON_CONTACT_PAGE_PATH).then(res => {
        if (!res.ok) throw new Error(`Nie udało się wczytać strony kontaktowej: ${COMMON_CONTACT_PAGE_PATH}.`);
        return res.arrayBuffer();
      }),
      fetch('/fonts/OpenSans-Regular.ttf').then(res => { // Czcionka, jeśli potrzebna do np. dodania numerów stron
        if (!res.ok) throw new Error(`Nie udało się wczytać czcionki OpenSans-Regular.ttf.`);
        return res.arrayBuffer();
      })
    ];

    const [
      coverPdfBytes,
      uploadedPdfBytes,
      contactPdfBytes,
      fontBytes // Na razie nieużywana, ale wczytana dla spójności
    ] = await Promise.all(assetsToLoad);

    // --- TWORZENIE NOWEGO DOKUMENTU PDF ---
    const finalPdfDoc = await PDFDocument.create();
    finalPdfDoc.registerFontkit(fontkit);
    // const customFont = await finalPdfDoc.embedFont(fontBytes); // Jeśli będziesz dodawać tekst

    // 1. Dodaj okładkę Okna Nest
    const coverDoc = await PDFDocument.load(coverPdfBytes);
    const [copiedCoverPage] = await finalPdfDoc.copyPages(coverDoc, [0]);
    finalPdfDoc.addPage(copiedCoverPage);

    // 2. Dodaj strony z wgranego PDFa
    const uploadedDoc = await PDFDocument.load(uploadedPdfBytes);
    const uploadedPagesCount = uploadedDoc.getPageCount();
    for (let i = 0; i < uploadedPagesCount; i++) {
      const [copiedUploadedPage] = await finalPdfDoc.copyPages(uploadedDoc, [i]);
      finalPdfDoc.addPage(copiedUploadedPage);
    }

    // 3. Dodaj stronę kontaktową
    const contactDoc = await PDFDocument.load(contactPdfBytes);
    const [copiedContactPage] = await finalPdfDoc.copyPages(contactDoc, [0]);
    finalPdfDoc.addPage(copiedContactPage);

    // --- ZAPIS I ZWROT PLIKU ---
    const pdfBytes = await finalPdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('Błąd podczas generowania PDF dla Okien Nest:', error);
    alert(`Wystąpił błąd podczas generowania oferty Okna Nest: ${error.message}.`);
    return null;
  }
}