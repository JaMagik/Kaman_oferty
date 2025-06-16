// src/data/tables/acData.js

export const acScopeTemplate = [
    ['', 'Organizacja stanowiska montażowego', 'Przygotowanie miejsca pracy w sposób umożliwiający bezpieczne i możliwie bezinwazyjne wykonanie prac.', 'kpl.', '1'],
    ['', 'Montaż wspornika pod jednostkę zewnętrzną', 'Instalacja elementów mocujących na elewacji budynku lub stabilnym fundamencie.', 'kpl.', '1'],
    ['', 'Wykonanie przepustów instalacyjnych', 'Wykonanie otworu w ścianie konstrukcyjnej o średnicy ok. 60mm.', 'szt.', '1'],
    ['', 'Wykonanie instalacji chłodniczej', 'Rozprowadzenie przewodów miedzianych w izolacji termicznej między jednostkami.', 'kpl.', '1'],
    ['', 'Odprowadzenie skroplin', 'Wykonanie układu odprowadzającego kondensat w sposób grawitacyjny.', 'kpl.', '1'],
    ['', 'Podłączenia elektryczne i komunikacyjne', 'Podłączenie urządzeń do instalacji elektrycznej oraz połączeń komunikacyjnych między jednostkami.', 'kpl.', '1'],
    ['', 'Materiały montażowe', 'Użycie odpowiednich obejm, profili, śrub i taśm w celu trwałego i estetycznego zamocowania instalacji.', 'kpl.', '1'],
    ['', 'Montaż kanałów maskujących', 'Montaż białych kanałów PVC dla estetycznego prowadzenia instalacji naściennej (do 3 mb w cenie).', 'kpl.', '1'],
    ['', 'Wykonanie próżni i test szczelności', 'Usunięcie powietrza i wilgoci z układu chłodniczego przy użyciu pompy próżniowej.', 'szt.', '1'],
    ['', 'Uruchomienie i testy systemu', 'Włączenie klimatyzatora, sprawdzenie działania w trybie chłodzenia i grzania.', 'szt.', '1'],
    ['', 'Konfiguracja sterowania', 'Ustawienie funkcji pilota, harmonogramów oraz parametrów pracy.', 'kpl.', '1'],
    ['', 'Dokumentacja i gwarancja', 'Przekazanie dokumentów instalacyjnych, karty gwarancyjnej oraz instrukcji obsługi.', 'kpl.', '1'],
    ['', 'Szkolenie użytkownika', 'Przekazanie zasad eksploatacji, omówienie czynności konserwacyjnych oraz trybów pracy urządzenia.', 'szt.', '1'],
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