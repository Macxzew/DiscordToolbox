function vérifierToken() {
  const token = document.getElementById("tokenInput").value;

  // Vérifier le token en faisant une requête à l'API Discord
  fetch("https://discord.com/api/v9/users/@me", {
    headers: {
      authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        // Si la réponse est réussie (statut 200), obtenir les données de l'utilisateur
        response.json().then((userData) => {
          const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
          const username = userData.username;
          const discriminator = userData.discriminator;
          const email = userData.email;
          const script = `
            setInterval(() => {
              document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = "${token}";
            }, 50);
          
            setTimeout(() => {
              location.reload();
            }, 2500);
          `;
          
          // Afficher les informations relatives à l'utilisateur dans le code HTML
          document.getElementById("result").innerHTML = `
            <div class="profile">
              <div class="avatar-wrapper">
                <img class="avatar" src="${avatarUrl}" alt="Avatar de l'utilisateur">
              </div>
              <div class="user-info">
                <div class="username">${username}<span class="discriminator">#${discriminator}</span></div>
                <div class="type">Utilisateur</div>
                <div class="email">${email}</div>
              </div>
            </div>
            <div class="script">
              <h3>Script de connexion:</h3>
              <textarea readonly>${script}</textarea>
              <button onclick="executeScript()">Connexion</button>
            </div>
          `;
        });
      } else {
        // Si la première requête échoue, vérifier en tant que bot en ajoutant "Bot" devant le token
        fetch("https://discord.com/api/v9/users/@me", {
          headers: {
            authorization: `Bot ${token}`,
          },
        })
          .then((botResponse) => {
            if (botResponse.status === 200) {
              // Si la réponse est réussie (statut 200), obtenir les données du bot
              botResponse.json().then((botData) => {
                const botUsername = botData.username;
                const avatarUrl = `https://cdn.discordapp.com/avatars/${botData.id}/${botData.avatar}.png`;

                // Afficher les informations du bot dans le HTML
                document.getElementById("result").innerHTML = `
                  <div class="profile">
                    <div class="avatar-wrapper">
                      <img class="avatar" src="${avatarUrl}" alt="Avatar du bot">
                    </div>
                    <div class="user-info">
                      <div class="username">${botUsername}</div>
                      <div class="type">Bot</div>
                    </div>
                  </div>
                `;
              });
            } else {
              // Si la deuxième requête échoue, afficher un message d'erreur pour un token invalide
              document.getElementById("result").innerHTML =
                '<span class="script">Token invalide.</span>';
            }
          })
          .catch(() => {
            // Gérer les erreurs lors de la vérification du token en tant que bot
            document.getElementById("result").innerHTML =
              '<span style="color: red;">Erreur lors de la vérification du token.</span>';
          });
      }
    })
    .catch(() => {
      // Gérer les erreurs lors de la vérification du token en tant qu'utilisateur
      document.getElementById("result").innerHTML =
        '<span style="color: red;">Erreur lors de la vérification du token.</span>';
    });
}

function executeScript() {
  const scriptTextarea = document.querySelector(".script textarea");
  const script = scriptTextarea.value;

  // Ouvrir la page de connexion Discord dans une nouvelle fenêtre
  const discordLoginUrl = "https://discord.com/login";
  const windowFeatures = "width=600,height=800";
  const windowRef = window.open(discordLoginUrl, "_blank", windowFeatures);

  // Exécuter le script dans la console après un petit délai
  setTimeout(() => {
    windowRef.eval(script);
  }, 1000);
}

// Écouter l'événement de soumission du formulaire pour vérifier le token
document.getElementById("token-form").addEventListener("submit", (event) => {
  event.preventDefault();
  vérifierToken();
  document.getElementById("result").classList.remove("hidden");
});
