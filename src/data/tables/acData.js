// src/data/tables/acData.js

export const acScopeTemplate = [
  ['1', 'Organizacja stanowiska montażowego', 'kpl.', '1', 'Przygotowanie miejsca pracy w sposób umożliwiający bezpieczne i możliwie bezinwazyjne wykonanie prac.'],
  ['2', 'Montaż wspornika pod jednostkę zewnętrzną', 'kpl.', '1', 'Instalacja elementów mocujących na elewacji budynku lub stabilnym fundamencie.'],
  ['3', 'Wykonanie przepustów instalacyjnych', 'szt.', '1', 'Wykonanie otworu w ścianie konstrukcyjnej o średnicy ok. 60 mm.'],
  ['4', 'Wykonanie instalacji chłodniczej', 'kpl.', '1', 'Rozprowadzenie przewodów miedzianych w izolacji termicznej między jednostkami.'],
  ['5', 'Odprowadzenie skroplin', 'kpl.', '1', 'Wykonanie układu odprowadzającego kondensat w sposób grawitacyjny.'],
  ['6', 'Podłączenia elektryczne i komunikacyjne', 'kpl.', '1', 'Podłączenie urządzeń do instalacji elektrycznej oraz połączeń komunikacyjnych między jednostkami.'],
  ['7', 'Materiały montażowe', 'kpl.', '1', 'Użycie odpowiednich obejm, profili, śrub i taśm w celu trwałego i estetycznego zamocowania instalacji.'],
  ['8', 'Montaż kanałów maskujących', 'kpl.', '1', 'Montaż białych kanałów PVC dla estetycznego prowadzenia instalacji naściennej (do 3 mb w cenie).'],
  ['9', 'Wykonanie próżni i test szczelności', 'szt.', '1', 'Usunięcie powietrza i wilgoci z układu chłodniczego przy użyciu pompy próżniowej.'],
  ['10', 'Uruchomienie i testy systemu', 'szt.', '1', 'Włączenie klimatyzatora, sprawdzenie działania w trybie chłodzenia i grzania.'],
  ['11', 'Konfiguracja sterowania', 'kpl.', '1', 'Ustawienie funkcji pilota, harmonogramów oraz parametrów pracy.'],
  ['12', 'Dokumentacja i gwarancja', 'kpl.', '1', 'Przekazanie dokumentów instalacyjnych, karty gwarancyjnej oraz instrukcji obsługi.'],
  ['13', 'Szkolenie użytkownika', 'szt.', '1', 'Przekazanie zasad eksploatacji, omówienie czynności konserwacyjnych oraz trybów pracy urządzenia.'],
];

export const vivaxAcModels = {
  'VIVAX Y-Design': {
    '3.5 kW': {
      indoor: 'Jednostka wew. Y-Design 3.5 kW (AEVI)',
      outdoor: 'Jednostka zew. Y-Design 3.5 kW (ACP-12CH35AEVIS)',
    }
  },
  'VIVAX H-Design': {
    '3.5 kW': {
      indoor: 'Jednostka wew. H-Design 3.5 kW (AEHI+)',
      outdoor: 'Jednostka zew. H-Design 3.5 kW (ACP-12CH35AEHI+)',
    }
  },
  'VIVAX Q-Design': {
    '2.6 kW': { indoor: 'Jednostka wew. Q-Design 2.6 kW (AEQIs)', outdoor: 'Jednostka zew. Q-Design 2.6 kW (ACP-09CH25AEQIs)' },
    '3.5 kW': { indoor: 'Jednostka wew. Q-Design 3.5 kW (AEQIs)', outdoor: 'Jednostka zew. Q-Design 3.5 kW (ACP-12CH35AEQIs)' },
    '5.3 kW': { indoor: 'Jednostka wew. Q-Design 5.3 kW (AEQIs)', outdoor: 'Jednostka zew. Q-Design 5.3 kW (ACP-18CH50AEQIS)' },
    '7.0 kW': { indoor: 'Jednostka wew. Q-Design 7.0 kW (AEQIs)', outdoor: 'Jednostka zew. Q-Design 7.0 kW (ACP-24CH70AEQIs)' }
  },
  'VIVAX N-Design': {
    '2.6 kW': { indoor: 'Jednostka wew. N-Design 2.6 kW (AENI)', outdoor: 'Jednostka zew. N-Design 2.6 kW (ACP-09CH25AENI)' },
    '3.5 kW': { indoor: 'Jednostka wew. N-Design 3.5 kW (AENI)', outdoor: 'Jednostka zew. N-Design 3.5 kW (ACP-12CH35AENI)' },
    '5.3 kW': { indoor: 'Jednostka wew. N-Design 5.3 kW (AENI)', outdoor: 'Jednostka zew. N-Design 5.3 kW (ACP-18CH50AENI)' }
  },
  'VIVAX M-Design': {
    '2.6 kW': { indoor: 'Jednostka wew. N-Design 2.6 kW (AENI)', outdoor: 'Jednostka zew. N-Design 2.6 kW (ACP-09CH25AENI)' },
    '3.5 kW': { indoor: 'Jednostka wew. N-Design 3.5 kW (AENI)', outdoor: 'Jednostka zew. N-Design 3.5 kW (ACP-12CH35AENI)' },
    '5.3 kW': { indoor: 'Jednostka wew. N-Design 5.3 kW (AENI)', outdoor: 'Jednostka zew. N-Design 5.3 kW (ACP-18CH50AENI)' }
  }
};


// === NOWY, BRAKUJĄCY EKSPORT ===
export const vivaxAcBaseTables = {};
for (const series in vivaxAcModels) {
    vivaxAcBaseTables[series] = {};
    for (const model in vivaxAcModels[series]) {
        vivaxAcBaseTables[series][model] = []; // Pusta tablica, bo dane są budowane dynamicznie w index.js
    }
}
// Dodajemy też generyczny zakres dla Mitsubishi AC
vivaxAcBaseTables['MITSUBISHI AY'] = {'2.5-5.0 kW': acScopeTemplate};
vivaxAcBaseTables['MITSUBISHI HR'] = {'2.5-5.0 kW': acScopeTemplate};