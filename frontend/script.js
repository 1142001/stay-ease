const API = "https://stay-easee.onrender.com/api";

// ================= LOGIN =================
async function login() {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    console.log("Response:", res);

    const data = await res.json();
    console.log("Data:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location = "index.html";
    } else {
      alert(data.message);
    }

  } catch (err) {
    console.log("ERROR:", err);
    alert("Backend not reachable");
  }
}

// ================= SIGNUP =================
async function signup() {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful");
    } else {
      alert(data.message || data);
    }
  } catch (err) {
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
  const res = await fetch(`${API}/rooms`);
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
async function book(roomId) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ roomId, date: new Date() })
  });

  alert("Booked!");
  window.location = "dashboard.html";
}

// ================= USER BOOKINGS =================
async function getBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/bookings/my-bookings`, {
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

  const res = await fetch(`${API}/bookings/all`, {
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
  const res = await fetch(`${API}/rooms`);
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

  await fetch(`${API}/rooms/${id}`, {
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

  await fetch(`${API}/rooms`, {
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

// ================= AUTO LOAD =================
if (document.getElementById("rooms")) getRooms();
if (document.getElementById("bookings")) getBookings();
if (document.getElementById("adminRooms")) getAdminRooms();
if (document.getElementById("adminBookings")) getAllBookings();