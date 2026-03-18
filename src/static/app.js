document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Initialize app
  fetchActivities();
});

// Function to fetch activities from API
async function fetchActivities() {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");

  try {
    const response = await fetch("/activities");
    const activities = await response.json();

    // Clear loading message
    activitiesList.innerHTML = "";

    // Populate activities list
    Object.entries(activities).forEach(([name, details]) => {
      const activityCard = document.createElement("div");
      activityCard.className = "activity-card";

      const spotsLeft = details.max_participants - details.participants.length;

      activityCard.innerHTML = `
        <h4>${name}</h4>
        <p>${details.description}</p>
        <p><strong>Schedule:</strong> ${details.schedule}</p>
        <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        <div class="participants-section">
          <p><strong>Participants:</strong></p>
          <ul>
            ${details.participants.length > 0 ? details.participants.map(p => `
              <li>
                <span class="participant-email">${p}</span>
                <button class="delete-btn" onclick="deleteParticipant('${name}', '${p}')">×</button>
              </li>
            `).join('') : '<li>No participants yet</li>'}
          </ul>
        </div>
      `;

      activitiesList.appendChild(activityCard);

      // Add option to select dropdown
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      activitySelect.appendChild(option);
    });
  } catch (error) {
    activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
    console.error("Error fetching activities:", error);
  }
}

// Function to handle form submission
async function handleSignup(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const activity = document.getElementById("activity").value;
  const messageDiv = document.getElementById("message");
  const signupForm = document.getElementById("signup-form");

  try {
    const response = await fetch(
      `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
      }
    );

    const result = await response.json();

    if (response.ok) {
      messageDiv.textContent = result.message;
      messageDiv.className = "success";
      signupForm.reset();
      // Refresh activities to show updated participant list
      fetchActivities();
    } else {
      messageDiv.textContent = result.detail || "An error occurred";
      messageDiv.className = "error";
    }

    messageDiv.classList.remove("hidden");

    // Hide message after 5 seconds
    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  } catch (error) {
    messageDiv.textContent = "Failed to sign up. Please try again.";
    messageDiv.className = "error";
    messageDiv.classList.remove("hidden");
    console.error("Error signing up:", error);
  }
}

// Function to handle participant deletion
async function deleteParticipant(activityName, email) {
  try {
    const response = await fetch(
      `/activities/${encodeURIComponent(activityName)}/unregister?email=${encodeURIComponent(email)}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (response.ok) {
      // Refresh the activities list
      fetchActivities();
      showMessage(result.message, "success");
    } else {
      showMessage(result.detail || "An error occurred", "error");
    }
  } catch (error) {
    showMessage("Failed to unregister participant. Please try again.", "error");
    console.error("Error unregistering:", error);
  }
}

// Function to show messages
function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = type;
  messageDiv.classList.remove("hidden");

  // Hide message after 5 seconds
  setTimeout(() => {
    messageDiv.classList.add("hidden");
  }, 5000);
}

// Initialize event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", handleSignup);
  
  // Initialize app
  fetchActivities();
});

// Function to handle participant deletion
async function deleteParticipant(activityName, email) {
  try {
    const response = await fetch(
      `/activities/${encodeURIComponent(activityName)}/unregister?email=${encodeURIComponent(email)}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (response.ok) {
      // Refresh the activities list
      fetchActivities();
      showMessage(result.message, "success");
    } else {
      showMessage(result.detail || "An error occurred", "error");
    }
  } catch (error) {
    showMessage("Failed to unregister participant. Please try again.", "error");
    console.error("Error unregistering:", error);
  }
}

// Function to show messages
function showMessage(message, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = type;
  messageDiv.classList.remove("hidden");

  // Hide message after 5 seconds
  setTimeout(() => {
    messageDiv.classList.add("hidden");
  }, 5000);
}
