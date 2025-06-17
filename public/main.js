// ZMIENIONY ADRES URL APLIKACJI
const KAMAN_APP_URL = 'https://kaman-oferty.vercel.app';

window.TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: `${KAMAN_APP_URL}/logo.png`,
      text: 'Generuj ofertę Kaman',
      callback: function (t_click_context) {
        return t_click_context.card('id')
          .then(function (card) {
            const cardId = card.id;
            // Tutaj używamy nowego adresu URL
            const url = `${KAMAN_APP_URL}?trelloCardId=${cardId}`;
            return t_click_context.modal({
              url: url,
              fullscreen: true,
              title: 'Generator Ofert Kaman',
              args: { cardId }
            });
          })
          .catch(function (error) {
            t_click_context.alert({
              message: `Błąd: ${error.message || 'Nieznany'}`,
              duration: 6,
              display: 'error'
            });
          });
      }
    }];
  }
}, {
  appName: 'Kaman Oferty Power-Up'
});