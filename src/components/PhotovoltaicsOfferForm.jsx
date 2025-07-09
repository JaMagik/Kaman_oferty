import React, { useState } from 'react';
import { inverterTypesData, storageTypesData } from '../data/tables/photovoltaicsData';

// Załóżmy, że masz jakiś styl CSS dla formularza, np. w pliku FormStyles.css
// import './FormStyles.css';

const PhotovoltaicsOfferForm = ({ onFormSubmit }) => {
  const [inverterTypeKey, setInverterTypeKey] = useState(Object.keys(inverterTypesData)[0]);
  const [panelPower, setPanelPower] = useState(455);
  const [panelCount, setPanelCount] = useState(10);
  const [includeStorage, setIncludeStorage] = useState(false);
  const [storageModules, setStorageModules] = useState(1);
  const [customerData, setCustomerData] = useState({ name: '', address: '' });

  const handleInverterChange = (e) => {
    const newInverterKey = e.target.value;
    setInverterTypeKey(newInverterKey);

    // Resetuj moduły magazynu do domyślnych wartości przy zmianie falownika
    if (newInverterKey === 'SOLPLANET_AI_HB_G2') {
      setStorageModules(3); // Minimalna wartość dla Solplanet
    } else {
      setStorageModules(1); // Domyślna wartość dla innych
    }
  };

  const handleStorageModulesChange = (e) => {
    const newModules = Number(e.target.value);
    setStorageModules(newModules);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
        inverterTypeKey,
        panelPower,
        panelCount,
        includeStorage,
        storageModules,
        customerData
    };
    onFormSubmit(formData);
  };

  const renderStorageOptions = () => {
    if (!includeStorage) return null;
    
    const isSolplanet = inverterTypeKey === 'SOLPLANET_AI_HB_G2';
    const minModules = isSolplanet ? 3 : 1;
    const maxModules = isSolplanet ? 8 : 4; // Załóżmy 4 dla innych jako domyślne
    const options = [];
    for (let i = minModules; i <= maxModules; i++) {
        options.push(<option key={i} value={i}>{i} moduły</option>);
    }

    return (
        <div className="input-group" style={{paddingLeft: '15px', marginTop: '10px'}}>
            <label htmlFor="storageModules">
                {isSolplanet 
                    ? `Ilość modułów magazynu (${minModules}-${maxModules}):`
                    : 'Ilość modułów magazynu:'
                }
            </label>
            <select 
                id="storageModules" 
                value={storageModules} 
                onChange={handleStorageModulesChange}
            >
                {options}
            </select>
            {isSolplanet && storageModules < minModules &&
                <small style={{color: 'red'}}>Dla Solplanet Ai-HB G2 wymagane są co najmniej 3 moduły.</small>
            }
        </div>
    );
  };


  return (
    <form onSubmit={handleSubmit} className="offer-form">
      <h2>Formularz oferty fotowoltaicznej</h2>

      <div className="input-group">
        <label htmlFor="inverterType">Typ falownika:</label>
        <select id="inverterType" value={inverterTypeKey} onChange={handleInverterChange}>
          {Object.entries(inverterTypesData).map(([key, data]) => (
            <option key={key} value={key}>{data.name}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="panelPower">Moc paneli (Wp):</label>
        <input 
            type="number" 
            id="panelPower" 
            value={panelPower}
            onChange={e => setPanelPower(Number(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label htmlFor="panelCount">Liczba paneli:</label>
        <input 
            type="number" 
            id="panelCount" 
            value={panelCount}
            onChange={e => setPanelCount(Number(e.target.value))}
        />
      </div>

      <div className="input-group checkbox-group">
        <input 
            type="checkbox" 
            id="includeStorage" 
            checked={includeStorage}
            onChange={e => setIncludeStorage(e.target.checked)}
        />
        <label htmlFor="includeStorage">Dołącz magazyn energii</label>
      </div>

      {renderStorageOptions()}

      <div className="input-group">
        <label htmlFor="customerName">Imię i nazwisko klienta:</label>
        <input 
            type="text" 
            id="customerName" 
            value={customerData.name}
            onChange={e => setCustomerData({...customerData, name: e.target.value})}
        />
      </div>

       <div className="input-group">
        <label htmlFor="customerAddress">Adres instalacji:</label>
        <input 
            type="text" 
            id="customerAddress" 
            value={customerData.address}
            onChange={e => setCustomerData({...customerData, address: e.target.value})}
        />
      </div>
      
      <button type="submit" className="submit-btn">Wygeneruj ofertę</button>
    </form>
  );
};

export default PhotovoltaicsOfferForm;