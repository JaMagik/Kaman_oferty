import React, { useState, useEffect } from 'react';
import { radiatorHierarchy, radiatorTypesData } from '../data/tables/radiatorsData';
import { generateRadiatorsOfferPDF } from '../utils/radiatorsPdfGenerator';

const roomNameOptions = [ 'Salon', 'Kuchnia', 'Pokój', 'Sypialnia', 'Łazienka', 'Korytarz', 'Wiatrołap', 'Garaż', 'Pom. gospodarcze' ];

const initialMaterial = Object.keys(radiatorHierarchy)[0];
const initialConnection = Object.keys(radiatorHierarchy[initialMaterial].connections)[0];
const initialPanelType = Object.keys(radiatorHierarchy[initialMaterial].connections[initialConnection].panelTypes)[0];
const initialRadiatorKey = radiatorHierarchy[initialMaterial].connections[initialConnection].panelTypes[initialPanelType].models[0];

const createNewRoom = () => ({
  name: roomNameOptions[0],
  area: '',
  material: initialMaterial,
  connection: initialConnection,
  panelType: initialPanelType,
  radiatorKey: initialRadiatorKey,
});

export default function RadiatorsOfferForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState('');
  const [price, setPrice] = useState('');
  const [isNetto, setIsNetto] = useState(false);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [rooms, setRooms] = useState([createNewRoom()]);

  useEffect(() => {
    const newRooms = Array.from({ length: numberOfRooms }, (_, i) => {
      return rooms[i] || createNewRoom();
    });
    setRooms(newRooms);
  }, [numberOfRooms]);

  const handleRoomDataChange = (index, field, value) => {
    const newRooms = [...rooms];
    const oldRoom = { ...newRooms[index] };
    newRooms[index][field] = value;
    const newRoom = newRooms[index];

    // Resetowanie zagnieżdżonych opcji przy zmianie nadrzędnej
    if (field === 'material') {
      newRoom.connection = Object.keys(radiatorHierarchy[newRoom.material].connections)[0];
      newRoom.panelType = Object.keys(radiatorHierarchy[newRoom.material].connections[newRoom.connection].panelTypes)[0];
      newRoom.radiatorKey = radiatorHierarchy[newRoom.material].connections[newRoom.connection].panelTypes[newRoom.panelType].models[0];
    } else if (field === 'connection') {
      newRoom.panelType = Object.keys(radiatorHierarchy[newRoom.material].connections[newRoom.connection].panelTypes)[0];
      newRoom.radiatorKey = radiatorHierarchy[newRoom.material].connections[newRoom.connection].panelTypes[newRoom.panelType].models[0];
    } else if (field === 'panelType') {
      newRoom.radiatorKey = radiatorHierarchy[newRoom.material].connections[newRoom.connection].panelTypes[newRoom.panelType].models[0];
    }

    setRooms(newRooms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !price.trim()) {
      alert('Uzupełnij Imię i Nazwisko oraz Cenę!');
      return;
    }
    setIsProcessing(true);
    const pdfBlob = await generateRadiatorsOfferPDF({ userName, price, isNetto, rooms });
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Oferta_Grzejniki_KAMAN_${userName.replace(/ /g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setIsProcessing(false);
  };

  const renderRadiatorSelectors = (room, index) => {
    const availableConnections = radiatorHierarchy[room.material]?.connections || {};
    const availablePanelTypes = availableConnections[room.connection]?.panelTypes || {};
    const availableModels = availablePanelTypes[room.panelType]?.models || [];

    return (
      <>
        <div className="input-group">
          <label>Rodzaj grzejnika:</label>
          <select value={room.material} onChange={(e) => handleRoomDataChange(index, 'material', e.target.value)}>
            {Object.keys(radiatorHierarchy).map(key => (
              <option key={key} value={key}>{radiatorHierarchy[key].name}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Rodzaj podłączenia:</label>
          <select value={room.connection} onChange={(e) => handleRoomDataChange(index, 'connection', e.target.value)}>
            {Object.keys(availableConnections).map(key => (
              <option key={key} value={key}>{availableConnections[key].name}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Typ płyty / Rodzaj:</label>
          <select value={room.panelType} onChange={(e) => handleRoomDataChange(index, 'panelType', e.target.value)}>
            {Object.keys(availablePanelTypes).map(key => (
              <option key={key} value={key}>{availablePanelTypes[key].name}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Konkretny model:</label>
          <select value={room.radiatorKey} onChange={(e) => handleRoomDataChange(index, 'radiatorKey', e.target.value)}>
            {availableModels.map(key => (
              <option key={key} value={key}>{radiatorTypesData[key]?.name || key}</option>
            ))}
          </select>
        </div>
      </>
    );
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Generator Ofert - Grzejniki</h2>
      
      <div className="input-group">
        <label htmlFor="rad_userName">Imię i Nazwisko Klienta:</label>
        <input type="text" id="rad_userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Podaj imię i nazwisko" required />
      </div>

      <div className="input-group">
        <label htmlFor="rad_price">Cena Końcowa (PLN):</label>
        <input type="text" id="rad_price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Podaj cenę" required />
      </div>

      <div className="input-group-inline">
        <input type="checkbox" id="rad_isNetto" checked={isNetto} onChange={(e) => setIsNetto(e.target.checked)} />
        <label htmlFor="rad_isNetto">Pokaż cenę jako netto</label>
      </div>

      <div className="input-group">
        <label htmlFor="rad_roomCount">Ilość pomieszczeń:</label>
        <input type="number" id="rad_roomCount" value={numberOfRooms} onChange={(e) => setNumberOfRooms(parseInt(e.target.value, 10) || 0)} min="1" max="30" />
      </div>

      {rooms.map((room, index) => (
        <fieldset key={index} className="component-fieldset">
          <legend>Pomieszczenie #{index + 1}</legend>
          <div className="input-group">
            <label htmlFor={`room_name_${index}`}>Nazwa pomieszczenia:</label>
            <select id={`room_name_${index}`} value={room.name} onChange={(e) => handleRoomDataChange(index, 'name', e.target.value)}>
              {roomNameOptions.map(option => (<option key={option} value={option}>{option}</option>))}
            </select>
          </div>
          <div className="input-group">
              <label htmlFor={`room_area_${index}`}>Metraż (m²):</label>
              <input type="number" id={`room_area_${index}`} value={room.area} onChange={(e) => handleRoomDataChange(index, 'area', e.target.value)} placeholder="np. 25" />
          </div>
          {renderRadiatorSelectors(room, index)}
        </fieldset>
      ))}

      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Przetwarzanie...' : 'Generuj PDF z grzejnikami'}
      </button>
    </form>
  );
}