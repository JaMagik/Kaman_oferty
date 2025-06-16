import React, { useState } from 'react';
import { insulationMaterialTypes, wallScope, roofScope, basementScope } from '../data/tables/insulationData';
import { generateInsulationOfferPDF } from '../utils/insulationPdfGenerator';

const jobTypes = {
  sciany: 'Ocieplenie ścian zewnętrznych',
  strop: 'Ocieplenie stropu / poddasza',
  piwnica: 'Izolacja fundamentów / piwnicy',
};

const createNewJob = () => ({
  type: 'sciany',
  area: '',
  materialKey: Object.keys(insulationMaterialTypes)[0],
});

export default function InsulationOfferForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState('');
  const [price, setPrice] = useState('');
  const [isNetto, setIsNetto] = useState(false);
  const [jobs, setJobs] = useState([createNewJob()]);

  const handleJobChange = (index, field, value) => {
    const newJobs = [...jobs];
    newJobs[index][field] = value;
    setJobs(newJobs);
  };

  const addJob = () => {
    setJobs([...jobs, createNewJob()]);
  };

  const removeJob = (index) => {
    const newJobs = jobs.filter((_, i) => i !== index);
    setJobs(newJobs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !price.trim()) {
      alert('Uzupełnij Imię i Nazwisko oraz Cenę!');
      return;
    }
    setIsProcessing(true);
    const pdfBlob = await generateInsulationOfferPDF({ userName, price, isNetto, jobs });
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Oferta_Elewacja_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setIsProcessing(false);
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Generator Ofert - Elewacje / Ocieplenia</h2>
      
      <div className="input-group">
        <label>Imię i Nazwisko Klienta:</label>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>

      <div className="input-group">
        <label>Cena Końcowa (PLN):</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>

      <div className="input-group-inline">
        <input type="checkbox" id="ins_isNetto" checked={isNetto} onChange={(e) => setIsNetto(e.target.checked)} />
        <label htmlFor="ins_isNetto">Pokaż cenę jako netto</label>
      </div>

      {jobs.map((job, index) => (
        <fieldset key={index} className="component-fieldset">
          <legend>Zakres prac #{index + 1}</legend>
          {jobs.length > 1 && (
            <button type="button" onClick={() => removeJob(index)} className="remove-button">Usuń</button>
          )}
          <div className="input-group">
            <label>Typ ocieplenia:</label>
            <select value={job.type} onChange={(e) => handleJobChange(index, 'type', e.target.value)}>
              {Object.keys(jobTypes).map(key => (
                <option key={key} value={key}>{jobTypes[key]}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Metraż (m²):</label>
            <input type="number" value={job.area} onChange={(e) => handleJobChange(index, 'area', e.target.value)} placeholder="np. 150" />
          </div>
          <div className="input-group">
            <label>Materiał izolacyjny:</label>
            <select value={job.materialKey} onChange={(e) => handleJobChange(index, 'materialKey', e.target.value)}>
              {Object.keys(insulationMaterialTypes).map(key => (
                <option key={key} value={key}>{insulationMaterialTypes[key].name}</option>
              ))}
            </select>
          </div>
        </fieldset>
      ))}

      <button type="button" onClick={addJob} className="secondary-action">Dodaj kolejny zakres prac</button>
      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Przetwarzanie...' : 'Generuj Ofertę'}
      </button>
    </form>
  );
}