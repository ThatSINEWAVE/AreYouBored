document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const box = document.querySelector('.box');
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', () => {
    fadeOut(box, () => {
      showActivityTypes();
    });
  });

  function showActivityTypes() {
    const activityTypes = [
      'recreational', 'social', 'charity', 'cooking', 'education', 'relaxation', 'busywork'
    ];

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = 'Choose your type of activity';
    box.appendChild(description);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    box.appendChild(buttonsContainer);

    activityTypes.forEach(type => {
      const button = document.createElement('button');
      button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      button.addEventListener('click', () => {
        fadeOut(box, () => {
          showParticipantOptions(type);
        });
      });
      buttonsContainer.appendChild(button);
    });

    fadeIn(box);
  }

  function showParticipantOptions(type) {
    const participantNumbers = [1, 2, 3, 4, 5, 6, 8];

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = 'How many people will take part in the activity?';
    box.appendChild(description);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    box.appendChild(buttonsContainer);

    participantNumbers.forEach(number => {
      const button = document.createElement('button');
      button.textContent = number;
      button.addEventListener('click', () => {
        fadeOut(box, () => {
          fetchActivity(type, number);
        });
      });
      buttonsContainer.appendChild(button);
    });

    fadeIn(box);
  }

  function fetchActivity(type, participants, retries = 3) {
  const endpoint = `https://bored-api.appbrewery.com/filter?participants=${participants}&type=${type}`;
  const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(endpoint);
  fetch(proxyUrl)
    .then(response => response.json())
    .then(data => {
      try {
        const result = JSON.parse(data.contents);
        const randomActivity = result[Math.floor(Math.random() * result.length)];
        showActivity(randomActivity);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        console.log('Response from API:', data.contents);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      if (retries > 0) {
        console.log(`Retrying after ${3 - retries + 1} seconds...`);
        setTimeout(() => {
          fetchActivity(type, participants, retries - 1);
        }, (3 - retries + 1) * 1000); // Exponential backoff: wait 1 second for each retry
      } else {
        console.error('Max retries exceeded. Unable to fetch data.');
      }
    });
}

  function showActivity(activity) {
    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = 'Your activity is...';
    box.appendChild(description);

    const activityDescription = document.createElement('p');
    activityDescription.classList.add('activity-description');
    activityDescription.textContent = activity.activity;
    box.appendChild(activityDescription);

    const details = document.createElement('div');
    details.classList.add('activity-details');
    box.appendChild(details);

    addDetail(details, 'Type', capitalizeFirstLetter(activity.type));
    addDetail(details, 'Participants', activity.participants);
    addDetail(details, 'Availability', convertToRating(activity.availability));
    addDetail(details, 'Accessibility', activity.accessibility);
    addDetail(details, 'Duration', `A few ${activity.duration}`);
    addDetail(details, 'Kid Friendly', activity.kidFriendly ? 'Yes' : 'No');
    addLink(details, 'Link', activity.link);

    fadeIn(box);
  }

  function addDetail(container, label, value) {
    if (value) {
      const detail = document.createElement('p');
      detail.innerHTML = `<strong>${label}:</strong> ${value}`;
      container.appendChild(detail);
    }
  }

  function addLink(container, label, url) {
    if (url) {
      const detail = document.createElement('p');
      detail.innerHTML = `<strong>${label}:</strong> <a href="${url}" target="_blank">${url}</a>`;
      container.appendChild(detail);
    }
  }

  function convertToRating(value) {
    return Math.round(value * 5);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function fadeOut(element, callback) {
    element.classList.add('fade-out');
    setTimeout(() => {
      element.classList.add('hidden');
      element.classList.remove('fade-out');
      element.innerHTML = '<h1>Are You Bored?</h1>';
      if (callback) callback();
    }, 500);
  }

  function fadeIn(element) {
    element.classList.remove('hidden');
    element.classList.add('fade-in');
    setTimeout(() => {
      element.classList.remove('fade-in');
    }, 500);
  }
});
