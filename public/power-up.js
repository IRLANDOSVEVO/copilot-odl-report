window.TrelloPowerUp.initialize({

  // ✅ dentro le card
  'card-buttons': function (t, options) {
    return [{
      text: 'Copilot ODL',
      callback: function (t) {
        return t.popup({
          title: "Copilot ODL",
          url: '/powerup',
          height: 600
        });
      }
    }];
  },

  // 🔥 ✅ VISUALIZZAZIONE BACHECA
  'board-buttons': function (t, options) {
    return [{
      text: 'Copilot ODL',
      callback: function (t) {
        return t.popup({
          title: "Copilot ODL - Board",
          url: '/powerup',
          height: 700,
          width: 500
        });
      }
    }];
  }

});
