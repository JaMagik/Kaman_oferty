export const radiatorHierarchy = {
  stalowe: {
    name: 'Grzejniki stalowe płytowe',
    // Przypisujemy wszystkie PDFy dla grzejników stalowych
    datasheets: [
      '/pdf_templates/diamond/Folder_Grzejniki_Stalowe-1.pdf',
      '/pdf_templates/diamond/Folder_Grzejniki_Stalowe-3.pdf',
      '/pdf_templates/diamond/Folder_Grzejniki_Stalowe-4.pdf',
      '/pdf_templates/diamond/Folder_Grzejniki_Stalowe-5.pdf',
    ],
    connections: {
      boczne: {
        name: 'Podłączenie boczne (K)',
        panelTypes: {
          K11: { name: '1 płyta / 1 konwektor (K11)', models: ['DIAMOND_K11_600x1000'] },
          K21: { name: '2 płyty / 1 konwektor (K21)', models: ['DIAMOND_K21_600x1000'] },
          K22: { name: '2 płyty / 2 konwektory (K22)', models: ['DIAMOND_K22_600x1000', 'DIAMOND_K22_600x1200'] },
          K33: { name: '3 płyty / 3 konwektory (K33)', models: ['DIAMOND_K33_600x1000'] },
        }
      },
      dolne: {
        name: 'Podłączenie dolne (V)',
        panelTypes: {
          V11: { name: '1 płyta / 1 konwektor (V11)', models: ['DIAMOND_V11_600x1000'] },
          V21: { name: '2 płyty / 1 konwektor (V21)', models: ['DIAMOND_V21_600x1000'] },
          V22: { name: '2 płyty / 2 konwektory (V22)', models: ['DIAMOND_V22_600x1000', 'DIAMOND_V22_600x1200'] },
          V33: { name: '3 płyty / 3 konwektory (V33)', models: ['DIAMOND_V33_600x1000'] },
        }
      }
    }
  },
  aluminiowe: {
    name: 'Grzejniki aluminiowe członowe',
    // Przypisujemy wszystkie PDFy dla grzejników aluminiowych
    datasheets: [
      '/pdf_templates/diamond/Folder_Grzejniki_Aluminiowe-1.pdf',
      '/pdf_templates/diamond/Folder_Grzejniki_Aluminiowe-2.pdf',
      '/pdf_templates/diamond/Folder_Grzejniki_Aluminiowe-3.pdf',
      '/pdf_templates/diamond/Folder_Grzejniki_Aluminiowe-4.pdf',
    ],
    connections: {
      boczne: {
        name: 'Standardowe (boczne)',
        panelTypes: {
          Wulkan: { name: 'Linia Wulkan', models: ['DIAMOND_ALU_WULKAN_H350', 'DIAMOND_ALU_WULKAN_H500', 'DIAMOND_ALU_WULKAN_H800'] },
          Gejzer: { name: 'Linia Gejzer', models: ['DIAMOND_ALU_GEJZER_H500'] },
        }
      }
    }
  }
};

// Płaska struktura z danymi końcowymi, bez zmian
export const radiatorTypesData = {
  'DIAMOND_K11_600x1000': { name: 'Grzejnik stalowy Diamond K11 600x1000', description: 'Typ K11 (1 płyta, 1 konwektor), podłączenie boczne.' },
  'DIAMOND_K21_600x1000': { name: 'Grzejnik stalowy Diamond K21 600x1000', description: 'Typ K21 (2 płyty, 1 konwektor), podłączenie boczne.' },
  'DIAMOND_K22_600x1000': { name: 'Grzejnik stalowy Diamond K22 600x1000', description: 'Najpopularniejszy wariant. Typ K22 (2 płyty, 2 konwektory), podłączenie boczne.' },
  'DIAMOND_K22_600x1200': { name: 'Grzejnik stalowy Diamond K22 600x1200', description: 'Najpopularniejszy wariant. Typ K22 (2 płyty, 2 konwektory), podłączenie boczne.' },
  'DIAMOND_K33_600x1000': { name: 'Grzejnik stalowy Diamond K33 600x1000', description: 'Wysoka moc. Typ K33 (3 płyty, 3 konwektory), podłączenie boczne.' },
  'DIAMOND_V11_600x1000': { name: 'Grzejnik stalowy Diamond V11 600x1000', description: 'Wbudowany zawór termostatyczny. Typ V11 (1 płyta, 1 konwektor), podłączenie dolne.' },
  'DIAMOND_V21_600x1000': { name: 'Grzejnik stalowy Diamond V21 600x1000', description: 'Wbudowany zawór termostatyczny. Typ V21 (2 płyty, 1 konwektor), podłączenie dolne.' },
  'DIAMOND_V22_600x1000': { name: 'Grzejnik stalowy Diamond V22 600x1000', description: 'Najpopularniejszy wariant z wbudowanym zaworem. Typ V22 (2 płyty, 2 konwektory), podłączenie dolne.' },
  'DIAMOND_V22_600x1200': { name: 'Grzejnik stalowy Diamond V22 600x1200', description: 'Najpopularniejszy wariant z wbudowanym zaworem. Typ V22 (2 płyty, 2 konwektory), podłączenie dolne.' },
  'DIAMOND_V33_600x1000': { name: 'Grzejnik stalowy Diamond V33 600x1000', description: 'Wysoka moc i wbudowany zawór. Typ V33 (3 płyty, 3 konwektory), podłączenie dolne.' },
  'DIAMOND_ALU_WULKAN_H350': { name: 'Grzejnik aluminiowy Wulkan H350', description: 'Wysokość 350mm, podłączenie boczne 350mm. Członowy, 15 lat gwarancji.' },
  'DIAMOND_ALU_WULKAN_H500': { name: 'Grzejnik aluminiowy Wulkan H500', description: 'Wysokość 500mm, podłączenie boczne 500mm. Członowy, 15 lat gwarancji.' },
  'DIAMOND_ALU_WULKAN_H800': { name: 'Grzejnik aluminiowy Wulkan H800', description: 'Wysokość 800mm, podłączenie boczne 800mm. Członowy, 15 lat gwarancji.' },
  'DIAMOND_ALU_GEJZER_H500': { name: 'Grzejnik aluminiowy Gejzer H500', description: 'Wysokość 500mm, podłączenie boczne 500mm. Zwiększona powierzchnia żeber.' },
};

/**
 * Podstawowy, ogólny zakres prac przy montażu instalacji grzejnikowej.
 * Będzie on wyświetlany na górze tabeli w każdej ofercie.
 */
export const radiatorsBaseScope = [
    ['', 'Przygotowanie i zabezpieczenie miejsca pracy', 'Zabezpieczenie podłóg, ścian i mebli folią oraz kartonem w strefie prowadzonych robót instalacyjnych.', 'szt.', '1'],
    ['', 'Demontaż istniejących grzejników i armatury', 'Odłączenie, spuszczenie wody, bezpieczne zdemontowanie grzejników, zaworów i konsol wraz z wyniesieniem do miejsca składowania.', 'kpl.', '1'],
    ['', 'Rozprowadzenie / korekta rurociągów instalacji C.O.', 'Wykonanie lub przeróbka podejść do grzejników w systemie PEX/AL/PEX, miedź lub stal pre-izolowana zgodnie ze sztuką instalacyjną.', 'kpl.', '1'],
    ['', 'Montaż zawieszeń i konsol pod grzejniki', 'Precyzyjne wypoziomowanie oraz zakotwienie uchwytów grzejnikowych dostosowanych do rodzaju ściany (beton, cegła, płyta g-k).', 'kpl.', '1'],
    ['', 'Dostawa i montaż nowych grzejników', 'Grzejniki płytowe lub konwektorowe dobrane do obliczeniowego zapotrzebowania mocy, w kolorze RAL 9016 lub innym zgodnie z projektem.', 'kpl.', '1'],
    ['', 'Montaż zaworów termostatycznych', 'Instalacja zaworów z przyłączem M30×1.5 wraz z głowicami termostatycznymi umożliwiającymi indywidualną regulację temperatury każdego pomieszczenia.', 'kpl.', '1'],
    ['', 'Montaż zaworów odcinających / powrotnych', 'Zawory serwisowe umożliwiające demontaż grzejnika bez opróżniania całego układu.', 'kpl.', '1'],
    ['', 'Montaż zestawów przyłączeniowych dolnych / prostych', 'Estetyczne zestawy maskujące z rozetami, nyplami i przedłużkami zapewniające szczelne, ukryte podłączenie grzejnika.', 'kpl.', '1'],
    ['', 'Montaż odpowietrzników automatycznych i ręcznych', 'Zapewnienie bezproblemowego odpowietrzania instalacji w najwyższych punktach oraz na każdym grzejniku.', 'kpl.', '1'],
    ['', 'Izolacja termiczna przewodów', 'Otulina kauczukowa lub polietylenowa ograniczająca straty ciepła i zapobiegająca roszeniu rur w przestrzeniach nieogrzewanych.', 'kpl.', '1'],
    ['', 'Instalacja filtra magnetycznego / siatkowego', 'Separator zanieczyszczeń chroniący armaturę i wymienniki przed osadami magnetytowymi i cząstkami stałymi.', 'szt.', '1'],
    ['', 'Uzupełnienie i uzdatnienie wody instalacyjnej', 'Napełnienie instalacji wodą z dodatkiem inhibitora korozji i biocydu, zgodnie z normą VDI 2035.', 'kpl.', '1'],
    ['', 'Test ciśnieniowy (próba szczelności)', 'Próba wodna 1.5-krotnością ciśnienia roboczego lub próba powietrzna z zapisaniem wyników w protokole.', 'szt.', '1'],
    ['', 'Równoważenie hydrauliczne instalacji', 'Ustawienie nastaw wstępnych zaworów i/lub montaż zaworów regulacyjnych w celu osiągnięcia wymaganego przepływu przez każdy grzejnik.', 'kpl.', '1'],
    ['', 'Uruchomienie systemu i regulacja termiczna', 'Gradualne rozgrzanie instalacji, kalibracja głowic termostatycznych, pomiar temperatury powrotu i korekta nastaw.', 'szt.', '1'],
    ['', 'Instruktaż obsługi dla użytkownika', 'Przekazanie informacji o regulacji, serwisie i ekonomicznej eksploatacji instalacji grzejnikowej.', 'szt.', '1'],
    ['', 'Dokumentacja powykonawcza i protokół odbioru', 'Komplet dokumentów obejmujący schematy, karty gwarancyjne, wyniki prób i deklaracje zgodności.', 'kpl.', '1'],
    ['', 'Gwarancja i serwis', '5-letnia gwarancja na osprzęt i grzejniki przy zachowaniu zaleceń serwisowych – zapewniamy wsparcie techniczne.', 'kpl.', '1'],
];
