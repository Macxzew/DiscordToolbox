const form = document.getElementById('discord-form');
const previewContent = document.getElementById('preview-content');
const response = document.getElementById('response');
const contentTypeSelect = document.getElementById('content-type');
const messageGroup = document.getElementById('message-group');
const embedGroup = document.getElementById('embed-group');

form.addEventListener('input', updatePreview);
form.addEventListener('submit', sendMessage);
contentTypeSelect.addEventListener('change', toggleContentFields);

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
      Titre: ${embedTitle}
      Description: ${embedDescription}
      Miniature: ${embedThumbnail}
      Image: ${embedImage}
      Couleur: ${embedColor}
    `;

    previewContent.innerText = embedPreview;
  }
}

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

function showResponse(type, message) {
  response.className = type;
  response.innerText = message;
  response.classList.remove('hidden');
}

function hideResponse() {
  response.classList.add('hidden');
  response.innerText = '';
}

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
