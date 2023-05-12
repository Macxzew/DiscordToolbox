// Récupération des éléments du DOM
const form = document.getElementById('discord-form');
const previewContent = document.getElementById('preview-content');
const response = document.getElementById('response');
const contentTypeSelect = document.getElementById('content-type');
const messageGroup = document.getElementById('message-group');
const embedGroup = document.getElementById('embed-group');

// Écouteur d'événement pour mettre à jour l'aperçu lorsqu'un champ est modifié
form.addEventListener('input', updatePreview);
// Écouteur d'événement pour envoyer le message lors de la soumission du formulaire
form.addEventListener('submit', sendMessage);
// Écouteur d'événement pour basculer les champs en fonction du type de contenu sélectionné
contentTypeSelect.addEventListener('change', toggleContentFields);

// Fonction pour mettre à jour l'aperçu en fonction des valeurs des champs
function updatePreview(event) {
  const selectedOption = contentTypeSelect.value;

  if (selectedOption === 'message') {
    const message = document.getElementById('message').value;
    previewContent.innerText = message || 'Pas de message à prévisualiser.';
  } else if (selectedOption === 'embed') {
    const embedTitle = document.getElementById('embed-title').value;
    const embedDescription = document.getElementById('embed-description').value;
    const embedThumbnail = document.getElementById('embed-thumbnail').value;
    const embedImage = document.getElementById('embed-image').value;
    const embedColor = document.getElementById('embed-color').value;

    const embedPreview = `
      Titre : ${embedTitle}
      Description : ${embedDescription}
      Miniature : ${embedThumbnail}
      Image : ${embedImage}
      Couleur : ${embedColor}
    `;

    previewContent.innerText = embedPreview;
  }
}

// Fonction pour envoyer le message
function sendMessage(event) {
  event.preventDefault();

  const url = document.getElementById('webhook-url').value;
  const selectedOption = contentTypeSelect.value;
  const message = document.getElementById('message').value;

  let payload;

  if (selectedOption === 'message') {
    payload = {
      content: message
    };
  } else if (selectedOption === 'embed') {
    const embedTitle = document.getElementById('embed-title').value;
    const embedDescription = document.getElementById('embed-description').value;
    const embedThumbnail = document.getElementById('embed-thumbnail').value;
    const embedImage = document.getElementById('embed-image').value;
    const embedColor = document.getElementById('embed-color').value;

    payload = {
      embeds: [
        {
          title: embedTitle,
          description: embedDescription,
          thumbnail: {
            url: embedThumbnail
          },
          image: {
            url: embedImage
          },
          color: parseInt(embedColor.replace('#', ''), 16)
        }
      ]
    };
  }

  // Envoi de la requête fetch pour envoyer le message via un webhook
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.ok) {
        showResponse('success', 'Message envoyé !');
      } else {
        showResponse('error', 'Une erreur est survenue.');
      }
    })
    .catch(error => showResponse('error', error.message));

  updatePreview();
}

// Fonction pour afficher la réponse
function showResponse(type, message) {
  response.className = type;
  response.innerText = message;
  response.classList.remove('hidden');
}

// Fonction pour masquer la réponse
function hideResponse() {
  response.classList.add('hidden');
  response.innerText = '';
}

// Fonction pour basculer les champs en fonction du type de contenu sélectionné
function toggleContentFields() {
  const selectedOption = contentTypeSelect.value;

  if (selectedOption === 'message') {
    messageGroup.classList.remove('hidden');
    embedGroup.classList.add('hidden');
  } else if (selectedOption === 'embed') {
    messageGroup.classList.add('hidden');
    embedGroup.classList.remove('hidden');
  }
}
