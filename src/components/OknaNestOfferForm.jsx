// src/components/OknaNestOfferForm.jsx
import React, { useState } from 'react';
import { generateOknaNestPDF } from '../utils/oknaNestPdfGenerator'; // We will create this file next

export default function OknaNestOfferForm() {
  const [userName, setUserName] = useState('');
  const [uploadedPdfFile, setUploadedPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === "application/pdf") {
        setUploadedPdfFile(event.target.files[0]);
      } else {
        alert("Proszę wybrać plik PDF.");
        event.target.value = null; // Reset file input
        setUploadedPdfFile(null);
      }
    }
  };

  const handleGeneratePDF = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('Uzupełnij Imię i Nazwisko Klienta!');
      return;
    }
    if (!uploadedPdfFile) {
      alert('Proszę wybrać plik PDF do przetworzenia!');
      return;
    }

    setIsProcessing(true);
    try {
      const pdfBlob = await generateOknaNestPDF(userName, uploadedPdfFile);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Oferta_OknaNest_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // Reset form
        setUserName('');
        setUploadedPdfFile(null);
        if (document.getElementById('okna_uploadedPdf')) {
          document.getElementById('okna_uploadedPdf').value = null;
        }
      }
    } catch (error) {
      console.error("Błąd podczas generowania PDF dla Okien Nest:", error);
      alert(`Wystąpił błąd: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="form-container okna-nest-generator" onSubmit={handleGeneratePDF}>
      <h2>Generator Okna Nest</h2>
      
      <div className="input-group">
        <label htmlFor="okna_userName">Imię i Nazwisko Klienta:</label>
        <input 
          type="text" 
          id="okna_userName" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          placeholder="Podaj imię i nazwisko" 
          required 
        />
      </div>

      <div className="input-group">
        <label htmlFor="okna_uploadedPdf">Wgraj PDF z ofertą Okien Nest:</label>
        <input 
          type="file" 
          id="okna_uploadedPdf" 
          accept=".pdf" 
          onChange={handleFileChange} 
          required 
        />
        {uploadedPdfFile && <p style={{fontSize: '0.8em', marginTop: '5px'}}>Wybrano: {uploadedPdfFile.name}</p>}
      </div>

      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Przetwarzanie...' : 'Generuj PDF Okna Nest'}
      </button>
    </form>
  );
}