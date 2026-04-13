const API = "https://stay-ease-2.onrender.com/api";

// ================= LOGIN =================
async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log(data);

    if (res.ok && data.token) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      alert("Login successful");
      window.location = "index.html";
    } else {
      alert(data);
    }

  } catch (err) {
    console.log(err);
    alert("Backend not running or connection error");
  }
}

//================== SIGNUP =================
async function signup() {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      alert("Signup successful");
      window.location = "login.html";
    } else {
      alert(data);
    }

  } catch (err) {
    console.log(err);
    alert("Backend not running or connection error");
  }
}


// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  alert("Logged out!");
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

// ================= FILTER =================
function filterRooms() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const min = document.getElementById("minPrice").value;
  const max = document.getElementById("maxPrice").value;

  const filtered = allRooms.filter(r =>
    (r.title.toLowerCase().includes(search) || r.location.toLowerCase().includes(search)) &&
    (!min || r.price >= min) &&
    (!max || r.price <= max)
  );

  displayRooms(filtered);
}

// ================= BOOK =================
async function book(roomId) {
  const user = JSON.parse(localStorage.getItem("user"));

  await fetch(`${API}/bookings`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ userId: user._id, roomId, date: new Date() })
  });

  alert("Booked!");
  window.location = "dashboard.html";
}

// ================= BOOKINGS =================
async function getBookings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${API}/bookings/${user._id}`);
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

// ================= ADMIN ROOMS =================
async function getAdminRooms() {
  const res = await fetch(`${API}/rooms`);
  const data = await res.json();

  document.getElementById("adminRooms").innerHTML =
    data.map(r => `
      <div>
        <h5>${r.title}</h5>
        <button onclick="deleteRoom('${r._id}')">Delete</button>
        <button onclick="editRoom('${r._id}', '${r.title}', '${r.price}', '${r.location}')">Edit</button>
      </div>
    `).join("");
}

async function deleteRoom(id) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/rooms/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });

  alert("Deleted");
  getAdminRooms();
}

// ================= UPDATE ROOM =================
function editRoom(id, title, price, location) {
  const newTitle = prompt("Title", title);
  const newPrice = prompt("Price", price);
  const newLocation = prompt("Location", location);

  updateRoom(id, newTitle, newPrice, newLocation);
}

async function updateRoom(id, title, price, location) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/rooms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title, price, location })
  });

  alert("Updated");
  getAdminRooms();
}
// ================= ADMIN BOOKINGS =================
async function getAllBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/bookings`, {
    headers: { "Authorization": "Bearer " + token }
  });

  const data = await res.json();

  document.getElementById("adminBookings").innerHTML =
    data.map(b => `
      <div>
        <h5>${b.roomId?.title}</h5>
        <p>${b.userId?.email}</p>
        <p>${b.status}</p>
        <button onclick="updateStatus('${b._id}','Approved')">Approve</button>
        <button onclick="updateStatus('${b._id}','Rejected')">Reject</button>
      </div>
    `).join("");
}

async function updateStatus(id, status) {
  const token = localStorage.getItem("token");

  await fetch(`${API}/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ status })
  });

  alert("Updated");
  getAllBookings();
}


// ================= ADD ROOM =================

async function addRoom() {
  const token = localStorage.getItem("token");

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const location = document.getElementById("location").value;
  const image = document.getElementById("image").value;


  const res = await fetch(`${API}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title, price, location, image })
  });

  const text = await res.text();
  console.log(text);

  try {
    const data = JSON.parse(text);
    alert("Room added!");
    getAdminRooms();
  } catch {
    alert("Server Error: " + text);
  }
  if (!title || !price || !location) {
  alert("All fields required");
  return;
}
}

// ================= AUTO LOAD =================
if (document.getElementById("rooms")) getRooms();
if (document.getElementById("bookings")) getBookings();
if (document.getElementById("adminRooms")) getAdminRooms();
if (document.getElementById("adminBookings")) getAllBookings();