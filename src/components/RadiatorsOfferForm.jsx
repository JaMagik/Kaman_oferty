import React, { useState } from 'react';
import { radiatorHierarchy, radiatorTypesData } from '../data/tables/radiatorsData';
import { generateRadiatorsOfferPDF } from '../utils/radiatorsPdfGenerator';

const roomNameOptions = [ 'Salon', 'Kuchnia', 'Pokój', 'Sypialnia', 'Łazienka', 'Korytarz', 'Wiatrołap', 'Garaż', 'Pom. gospodarcze' ];

// Funkcja tworząca domyślny obiekt grzejnika
const createNewRadiator = () => {
  const material = Object.keys(radiatorHierarchy)[0];
  const connection = Object.keys(radiatorHierarchy[material].connections)[0];
  const panelType = Object.keys(radiatorHierarchy[material].connections[connection].panelTypes)[0];
  const height = Object.keys(radiatorHierarchy[material].connections[connection].panelTypes[panelType].heights)[0];
  const radiatorKey = radiatorHierarchy[material].connections[connection].panelTypes[panelType].heights[height].models[0];
  
  return { material, connection, panelType, height, radiatorKey, id: Date.now() + Math.random() };
};

// Funkcja tworząca domyślny obiekt pomieszczenia
const createNewRoom = () => ({
  name: roomNameOptions[0],
  area: '',
  radiators: [createNewRadiator()],
  id: Date.now()
});

export default function InsulationOfferForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState('');
  const [price, setPrice] = useState('');
  const [isNetto, setIsNetto] = useState(false);
  const [rooms, setRooms] = useState([createNewRoom()]);

  const addRoom = () => setRooms([...rooms, createNewRoom()]);
  const removeRoom = (roomIndex) => setRooms(rooms.filter((_, i) => i !== roomIndex));

  const handleRoomInfoChange = (roomIndex, field, value) => {
    const newRooms = [...rooms];
    newRooms[roomIndex][field] = value;
    setRooms(newRooms);
  };
  
  const addRadiatorToRoom = (roomIndex) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].radiators.push(createNewRadiator());
    setRooms(newRooms);
  };

  const removeRadiatorFromRoom = (roomIndex, radiatorId) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].radiators = newRooms[roomIndex].radiators.filter(rad => rad.id !== radiatorId);
    setRooms(newRooms);
  };

  const handleRadiatorChange = (roomIndex, radiatorIndex, field, value) => {
    const newRooms = [...rooms];
    const radiator = newRooms[roomIndex].radiators[radiatorIndex];
    radiator[field] = value;

    // Kaskadowe resetowanie wartości
    if (field === 'material') {
        radiator.connection = Object.keys(radiatorHierarchy[radiator.material].connections)[0];
        radiator.panelType = Object.keys(radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes)[0];
        radiator.height = Object.keys(radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[radiator.panelType].heights)[0];
        radiator.radiatorKey = radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[radiator.panelType].heights[radiator.height].models[0];
    } else if (field === 'connection') {
        radiator.panelType = Object.keys(radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes)[0];
        radiator.height = Object.keys(radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[radiator.panelType].heights)[0];
        radiator.radiatorKey = radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[radiator.panelType].heights[radiator.height].models[0];
    } else if (field === 'panelType') {
        radiator.height = Object.keys(radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[radiator.panelType].heights)[0];
        radiator.radiatorKey = radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[radiator.panelType].heights[radiator.height].models[0];
    } else if (field === 'height') {
        radiator.radiatorKey = radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[radiator.panelType].heights[radiator.height].models[0];
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
  
  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Generator Ofert - Grzejniki</h2>
      
      <div className="input-group">
        <label>Imię i Nazwisko Klienta:</label>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div className="input-group">
        <label>Cena Końcowa (PLN):</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div className="input-group-inline">
        <input type="checkbox" id="rad_isNetto" checked={isNetto} onChange={(e) => setIsNetto(e.target.checked)} />
        <label htmlFor="rad_isNetto">Pokaż cenę jako netto</label>
      </div>

      <hr/>

      {rooms.map((room, roomIndex) => (
        <fieldset key={room.id} className="component-fieldset">
          <legend>Pomieszczenie #{roomIndex + 1}</legend>
          {rooms.length > 1 && <button type="button" onClick={() => removeRoom(roomIndex)} className="remove-button">Usuń Pomieszczenie</button>}
          
          <div className="inline-inputs">
            <div className="input-group">
              <label>Nazwa pomieszczenia:</label>
              <select value={room.name} onChange={(e) => handleRoomInfoChange(roomIndex, 'name', e.target.value)}>
                {roomNameOptions.map(option => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
            <div className="input-group">
              <label>Metraż (m²):</label>
              <input type="number" value={room.area} onChange={(e) => handleRoomInfoChange(roomIndex, 'area', e.target.value)} placeholder="np. 25" />
            </div>
          </div>
          
          {room.radiators.map((radiator, radiatorIndex) => {
            const hierarchy = radiatorHierarchy[radiator.material]?.connections[radiator.connection]?.panelTypes[radiator.panelType]?.heights || {};
            return (
              <div key={radiator.id} className="radiator-group">
                {room.radiators.length > 1 && <button type="button" onClick={() => removeRadiatorFromRoom(roomIndex, radiator.id)} className="remove-button mini">Usuń Grzejnik</button>}
                <div className="input-group">
                  <label>Rodzaj materiału:</label>
                  <select value={radiator.material} onChange={(e) => handleRadiatorChange(roomIndex, radiatorIndex, 'material', e.target.value)}>
                    {Object.keys(radiatorHierarchy).map(key => (<option key={key} value={key}>{radiatorHierarchy[key].name}</option>))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Podłączenie:</label>
                  <select value={radiator.connection} onChange={(e) => handleRadiatorChange(roomIndex, radiatorIndex, 'connection', e.target.value)}>
                    {Object.keys(radiatorHierarchy[radiator.material].connections).map(key => (<option key={key} value={key}>{radiatorHierarchy[radiator.material].connections[key].name}</option>))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Typ płyty:</label>
                   <select value={radiator.panelType} onChange={(e) => handleRadiatorChange(roomIndex, radiatorIndex, 'panelType', e.target.value)}>
                    {Object.keys(radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes).map(key => (<option key={key} value={key}>{radiatorHierarchy[radiator.material].connections[radiator.connection].panelTypes[key].name}</option>))}
                  </select>
                </div>
                 <div className="input-group">
                  <label>Wysokość:</label>
                   <select value={radiator.height} onChange={(e) => handleRadiatorChange(roomIndex, radiatorIndex, 'height', e.target.value)}>
                    {Object.keys(hierarchy).map(key => (<option key={key} value={key}>{hierarchy[key].name}</option>))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Model:</label>
                   <select value={radiator.radiatorKey} onChange={(e) => handleRadiatorChange(roomIndex, radiatorIndex, 'radiatorKey', e.target.value)}>
                    {(hierarchy[radiator.height]?.models || []).map(key => (<option key={key} value={key}>{radiatorTypesData[key]?.name || key}</option>))}
                  </select>
                </div>
              </div>
            )
          })}
          <button type="button" onClick={() => addRadiatorToRoom(roomIndex)} className="secondary-action mini">Dodaj grzejnik w tym pomieszczeniu</button>
        </fieldset>
      ))}

      <button type="button" onClick={addRoom} className="secondary-action">Dodaj kolejne pomieszczenie</button>
      <button type="submit" disabled={isProcessing}>{isProcessing ? 'Przetwarzanie...' : 'Generuj Ofertę'}</button>
    </form>
  );
}