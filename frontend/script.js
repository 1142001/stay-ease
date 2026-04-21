const API = "https://stay-easee.onrender.com/api";

// ================= LOGIN =================
async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("https://stay-easee.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful");
      window.location.href = "dashboard.html";
    } else {
      alert("Token not received");
    }

  } catch (err) {
    console.log(err);
    alert("Backend not reachable");
  }
}

// ================= SIGNUP =================
async function signup() {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log({ name, email, password });

    const res = await fetch("https://stay-easee.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    console.log("RESPONSE:", data);

    if (!res.ok) {
      alert(data.message || "Signup failed");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Signup successful");

  } catch (err) {
    console.log(err);
    alert("Backend not reachable");
  }
}
// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ================= ROOMS =================
let allRooms = [];

async function getRooms() {
  const res = await fetch("https://stay-easee.onrender.com/api/rooms");
  const data = await res.json();
  allRooms = data;
  displayRooms(data);
}

function displayRooms(data) {
  document.getElementById("rooms").innerHTML =
    data.map(r => `
      <div class="col-md-4">
        <div class="card p-3 shadow mb-3">
          <h5>${r.title}</h5>
          <p>₹${r.price}</p>
          <p>${r.location}</p>
          <button onclick="book('${r._id}')" class="btn btn-primary">Book</button>
        </div>
      </div>
    `).join("");
}

// ================= BOOK =================
async function bookRoom(roomId) {
  try {
    const token = localStorage.getItem("token");

    const checkIn = prompt("Enter check-in date (YYYY-MM-DD)");
    const checkOut = prompt("Enter check-out date (YYYY-MM-DD)");

    const res = await fetch("https://stay-easee.onrender.com/api/bookings/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        roomId,
        checkIn,
        checkOut
      })
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      alert(data.message || "Booking failed");
      return;
    }

    alert("Room booked successfully!");

  } catch (err) {
    console.log(err);
    alert("Error booking room");
  }
}
// ================= USER BOOKINGS =================
async function getBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://stay-easee.onrender.com/api/bookings/my-bookings", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  document.getElementById("bookings").innerHTML =
    data.map(b => `
      <div class="col-md-4">
        <div class="card p-3 shadow mb-3">
          <h5>${b.roomId?.title}</h5>
          <p>Status: ${b.status}</p>
        </div>
      </div>
    `).join("");
}

// ================= ADMIN BOOKINGS =================
async function getAllBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://stay-easee.onrender.com/api/bookings/all", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  document.getElementById("adminBookings").innerHTML =
    data.map(b => `
      <div>
        <h5>${b.roomId?.title}</h5>
        <p>${b.userId?.email}</p>
        <p>${b.status}</p>
      </div>
    `).join("");
}

// ================= ADMIN ROOMS =================
async function getAdminRooms() {
  const res = await fetch("https://stay-easee.onrender.com/api/rooms");
  const data = await res.json();

  document.getElementById("adminRooms").innerHTML =
    data.map(r => `
      <div>
        <h5>${r.title}</h5>
        <button onclick="deleteRoom('${r._id}')">Delete</button>
      </div>
    `).join("");
}

async function deleteRoom(id) {
  const token = localStorage.getItem("token");

  await fetch("https://stay-easee.onrender.com/api/rooms/${id}", {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  alert("Deleted");
  getAdminRooms();
}

// ================= ADD ROOM =================
async function addRoom() {
  const token = localStorage.getItem("token");

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const location = document.getElementById("location").value;

  if (!title || !price || !location) {
    alert("All fields required");
    return;
  }

  await fetch("https://stay-easee.onrender.com/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title, price, location })
  });

  alert("Room added!");
  getAdminRooms();
}
//================== LOAD ROOMS =================

async function loadRooms() {
  try {
    const res = await fetch("https://stay-easee.onrender.com/api/rooms");
    const rooms = await res.json();

    console.log("ROOMS:", rooms);

    const container = document.getElementById("roomsContainer");
    container.innerHTML = "";

    rooms.forEach(room => {
      container.innerHTML += `
        <div class="col-md-4">
          <div class="card mb-4 shadow">
            <div class="card-body">
              <h5 class="card-title">${room.title}</h5>
              <p class="card-text">Location: ${room.location}</p>
              <p class="card-text">Price: ₹${room.price}</p>
              <button onclick="bookRoom('${room._id}')" class="btn btn-success w-100">
                Book Now
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.log(err);
    alert("Error loading rooms");
  }
}

//================== BOOK ROOM =================
async function bookRoom(roomId) {
  try {
    const token = localStorage.getItem("token");

    const checkIn = document.getElementById(`checkIn-${roomId}`).value;
    const checkOut = document.getElementById(`checkOut-${roomId}`).value;

    if (!checkIn || !checkOut) {
      alert("Please select dates");
      return;
    }

    const res = await fetch("https://stay-easee.onrender.com/api/bookings/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        roomId,
        checkIn,
        checkOut
      })
    });

    const data = await res.json();
    console.log("BOOKING:", data);

    if (!res.ok) {
      alert(data.message || "Booking failed");
      return;
    }

    alert("Room booked successfully ✅");

  } catch (err) {
    console.log(err);
    alert("Error booking room");
  }
}

// ================= AUTO LOAD =================
if (document.getElementById("rooms")) loadRooms();
if (document.getElementById("bookings")) getBookings();
if (document.getElementById("adminRooms")) getAdminRooms();
if (document.getElementById("adminBookings")) getAllBookings();