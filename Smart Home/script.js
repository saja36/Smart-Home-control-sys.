// Show loading indicator
function showLoading() {
  const spinner = document.createElement('div');
  spinner.id = 'loading-spinner';
  spinner.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(spinner);
}

// Hide loading indicator
function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) {
    spinner.remove();
  }
}

// Send data to the back-end
function sendDataToBackend(sensorType, value) {
  showLoading();
  fetch('http://your-backend-api.com/update-sensor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sensorType: sensorType,
      value: value,
    }),
  })
    .then(response => response.json())
    .then(data => {
      hideLoading();
      alert(`${sensorType} updated successfully to ${value}`);
      console.log(`${sensorType} updated successfully:`, data);
    })
    .catch(error => {
      hideLoading();
      alert(`Error while updating ${sensorType}: ${error.message}`);
      console.error('Error updating sensor data:', error);
    });
}

// Update light value when the button is clicked
function updateLightData() {
  const lightValue = document.getElementById('light').value;
  if (lightValue === "" || lightValue < 0 || lightValue > 1000) {
    alert("Please enter a valid light value (0 - 1000)");
    return;
  }
  document.getElementById('light-value').innerText = `${lightValue}%`;
  sendDataToBackend('light', lightValue);
}

// Update humidity value when the button is clicked
function updateHumidityData() {
  const humidityValue = document.getElementById('humidity').value;
  if (humidityValue === "" || humidityValue < 0 || humidityValue > 100) {
    alert("Please enter a valid humidity value (0 - 100)");
    return;
  }
  document.getElementById('humidity-value').innerText = `${humidityValue}%`;
  sendDataToBackend('humidity', humidityValue);
}

// Update temperature value when the button is clicked
function updateTemperatureData() {
  const temperatureValue = document.getElementById('temperature').value;
  if (temperatureValue === "" || temperatureValue < -50 || temperatureValue > 100) {
    alert("Please enter a valid temperature value (-50 to 100 °C)");
    return;
  }
  document.getElementById('temperature-value').innerText = `${temperatureValue}°C`;
  sendDataToBackend('temperature', temperatureValue);
}

// Monitor sensors from the back-end and update the page
function updateSensorData() {
  fetch('http://your-backend-api.com/get-sensor-data')
    .then(response => response.json())
    .then(data => {
      if (!data) {
        alert('No sensor data received');
        return;
      }

      // Update sensor values
      if (document.getElementById('light-value'))
        document.getElementById('light-value').innerText = data.light ? `${data.light}%` : "N/A";

      if (document.getElementById('humidity-value'))
        document.getElementById('humidity-value').innerText = data.humidity ? `${data.humidity}%` : "N/A";

      if (document.getElementById('temperature-value'))
        document.getElementById('temperature-value').innerText = data.temperature ? `${data.temperature}°C` : "N/A";

      // Fire card
      const fireCard = document.getElementById('fire-data')?.parentElement;
      if (fireCard) {
        if (data.fire) {
          fireCard.classList.add('alert-card');
          document.getElementById('fire-data').innerText = "Fire Detected";
        } else {
          fireCard.classList.remove('alert-card');
          document.getElementById('fire-data').innerText = "No fire detected";
        }
      }

      // Gas card
      const gasCard = document.getElementById('gas-data')?.parentElement;
      if (gasCard) {
        if (data.gas) {
          gasCard.classList.add('alert-card');
          document.getElementById('gas-data').innerText = "Gas levels are abnormal!";
        } else {
          gasCard.classList.remove('alert-card');
          document.getElementById('gas-data').innerText = "Gas levels are normal";
        }
      }

      // Rain card
      const rainCard = document.getElementById('rain-data')?.parentElement;
      if (rainCard) {
        if (data.rain) {
          rainCard.classList.add('alert-card');
          document.getElementById('rain-data').innerText = "Rain Detected";
        } else {
          rainCard.classList.remove('alert-card');
          document.getElementById('rain-data').innerText = "No rain detected";
        }
      }

    })
    .catch(error => {
      alert('Error while fetching sensor data');
      console.error('Error fetching sensor data:', error);
    });
}

// Load sensor data on page load
window.onload = function () {
  updateSensorData();
};

// Logout handler (shared logic)
function logout() {
  window.location.href = "goodbye.html";
}
