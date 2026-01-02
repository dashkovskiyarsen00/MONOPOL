const state = {
  token: localStorage.getItem("token"),
  user: null,
  rooms: [],
  room: null,
  socket: null,
  lobbyPolling: null,
};

const view = document.getElementById("view");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authHint = document.getElementById("authHint");
const switchAuth = document.getElementById("switchAuth");

const routes = {
  "/": renderHome,
  "/lobby": renderLobby,
  "/profile": renderProfile,
  "/shop": renderShop,
  "/cases": renderCases,
  "/leaderboard": renderLeaderboard,
  "/settings": renderSettings,
  "/admin": renderAdmin,
  "/game": renderGame,
};

function navigate(path) {
  window.location.hash = path;
}

function getPath() {
  const hash = window.location.hash.replace("#", "");
  return hash || "/";
}

function render() {
  const path = getPath();
  const base = path.split("/").slice(0, 2).join("/") || "/";
  const route = routes[base] || renderHome;
  route(path);
}

function setAuthState() {
  loginButton.classList.toggle("hidden", Boolean(state.user));
  logoutButton.classList.toggle("hidden", !state.user);
}

function showModal(show) {
  authModal.classList.toggle("hidden", !show);
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (state.token) headers.authorization = state.token;
  const response = await fetch(path, { ...options, headers });
  return response.json();
}

async function loadProfile() {
  if (!state.token) return;
  const data = await api("/api/profile");
  if (data.user) {
    state.user = data.user;
  }
}

function setupAuth() {
  let isLogin = true;

  loginButton.addEventListener("click", () => {
    isLogin = true;
    authTitle.textContent = "Вход";
    switchAuth.textContent = "Регистрация";
    authHint.textContent = "";
    showModal(true);
  });

  logoutButton.addEventListener("click", () => {
    state.token = null;
    state.user = null;
    localStorage.removeItem("token");
    setAuthState();
    render();
  });

  switchAuth.addEventListener("click", () => {
    isLogin = !isLogin;
    authTitle.textContent = isLogin ? "Вход" : "Регистрация";
    switchAuth.textContent = isLogin ? "Регистрация" : "Вход";
    authHint.textContent = "";
  });

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(authForm);
    const payload = Object.fromEntries(formData.entries());
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const data = await api(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (data.error) {
      authHint.textContent = data.error;
      return;
    }
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("token", data.token);
    showModal(false);
    setAuthState();
    render();
  });

  authModal.addEventListener("click", (event) => {
    if (event.target === authModal) {
      showModal(false);
    }
  });
}

function renderHome() {
  view.innerHTML = `
    <section class="card">
      <h1 class="section-title">Онлайн-монополия для друзей</h1>
      <p class="hint">
        Создавайте комнаты, играйте в реалтайме и развивайте свой рейтинг.
      </p>
      <div style="margin-top: 16px; display: flex; gap: 12px;">
        <button onclick="navigate('/lobby')">Играть</button>
        <button class="ghost" onclick="navigate('/profile')">Профиль</button>
      </div>
    </section>
  `;
}

async function renderLobby() {
  const data = await api("/api/lobby");
  state.rooms = data.rooms || [];
  view.innerHTML = `
    <div class="grid cols-2">
      <section class="card">
        <h2 class="section-title">Лобби</h2>
        <div class="rooms">
          ${state.rooms
            .map(
              (room) => `
            <div class="room-item">
              <div>
                <div><strong>${room.id}</strong> · <span class="badge">${room.mode}</span></div>
                <div class="hint">${room.players} игроков · ${room.status}</div>
              </div>
              <button onclick="navigate('/game/${room.id}')">Войти</button>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
      <section class="card">
        <h2 class="section-title">Создать комнату</h2>
        <form id="createRoomForm" class="grid" style="gap: 12px;">
          <label>
            Режим
            <select name="mode" id="roomMode">
              <option value="casual">Casual</option>
              <option value="fast">Fast</option>
              <option value="ranked">Ranked</option>
            </select>
          </label>
          <label>
            Игроков
            <input type="number" name="players" value="4" min="2" max="6" />
          </label>
          <button type="submit">Создать</button>
        </form>
      </section>
    </div>
  `;

  const form = document.getElementById("createRoomForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const dataResponse = await api("/api/lobby/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    navigate(`/game/${dataResponse.room.id}`);
  });
}

async function renderProfile() {
  await loadProfile();
  if (!state.user) {
    view.innerHTML = `<section class="card"><h2 class="section-title">Войдите, чтобы открыть профиль</h2></section>`;
    return;
  }
  const { stats, inventory } = state.user;
  view.innerHTML = `
    <div class="grid cols-2">
      <section class="card">
        <h2 class="section-title">${state.user.nickname}</h2>
        <div class="stat-row"><span>Ранг</span><strong>${state.user.rank}</strong></div>
        <div class="stat-row"><span>MMR</span><strong>${state.user.rating}</strong></div>
        <div class="stat-row"><span>Мастерство</span><strong>${state.user.mastery}</strong></div>
        <div class="stat-row"><span>Игр сыграно</span><strong>${stats.games}</strong></div>
        <div class="stat-row"><span>Побед</span><strong>${stats.wins}</strong></div>
        <div class="stat-row"><span>Винрейт</span><strong>${stats.winRate}%</strong></div>
        <div class="stat-row"><span>Время</span><strong>${stats.totalTime} мин</strong></div>
        <div class="stat-row"><span>Макс. капитал</span><strong>${stats.maxCapital}</strong></div>
      </section>
      <section class="card">
        <h2 class="section-title">Инвентарь</h2>
        <div class="stat-row"><span>Монеты</span><strong>${inventory.coins}</strong></div>
        <div class="stat-row"><span>Скин</span><strong>${inventory.activeSkin}</strong></div>
        <div class="stat-row"><span>Рамка</span><strong>${inventory.activeFrame}</strong></div>
        <div class="stat-row"><span>Эффект</span><strong>${inventory.activeEffect}</strong></div>
      </section>
    </div>
  `;
}

async function renderShop() {
  const data = await api("/api/shop");
  view.innerHTML = `
    <section class="card">
      <h2 class="section-title">Магазин</h2>
      <div class="grid cols-3">
        ${[...(data.skins || []), ...(data.frames || []), ...(data.effects || [])]
          .map(
            (item) => `
          <div class="card">
            <h3>${item.name}</h3>
            <p class="hint">Цена: ${item.price} монет</p>
            <button class="ghost">Купить</button>
          </div>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderCases() {
  view.innerHTML = `
    <section class="card">
      <h2 class="section-title">Кейсы</h2>
      <p class="hint">Открывайте кейсы и получайте редкие предметы.</p>
      <div style="margin-top: 16px; display: flex; gap: 12px;">
        <button>Открыть кейс (300 монет)</button>
        <button class="ghost">Посмотреть дроп</button>
      </div>
    </section>
  `;
}

async function renderLeaderboard() {
  const data = await api("/api/leaderboard");
  view.innerHTML = `
    <section class="card">
      <h2 class="section-title">Лидерборд</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Никнейм</th>
            <th>Победы</th>
            <th>Игры</th>
            <th>Рейтинг</th>
          </tr>
        </thead>
        <tbody>
          ${(data.list || [])
            .map(
              (row) => `
            <tr>
              <td>${row.nickname}</td>
              <td>${row.wins}</td>
              <td>${row.games}</td>
              <td>${row.rating}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderSettings() {
  view.innerHTML = `
    <section class="card">
      <h2 class="section-title">Настройки</h2>
      <div class="stat-row"><span>Тема</span><strong>Тёмная</strong></div>
      <div class="stat-row"><span>Звук</span><strong>Вкл.</strong></div>
      <div class="stat-row"><span>Язык</span><strong>Русский</strong></div>
    </section>
  `;
}

function renderAdmin() {
  view.innerHTML = `
    <section class="card">
      <h2 class="section-title">Админ-панель</h2>
      <p class="hint">Базовый просмотр пользователей будет доступен при подключении к базе.</p>
    </section>
  `;
}

function createBoardTiles(board) {
  const grid = new Array(121).fill(null);
  const positions = [];
  for (let i = 0; i < 11; i += 1) {
    positions.push([0, i]);
  }
  for (let i = 1; i < 11; i += 1) {
    positions.push([i, 10]);
  }
  for (let i = 9; i >= 0; i -= 1) {
    positions.push([10, i]);
  }
  for (let i = 9; i >= 1; i -= 1) {
    positions.push([i, 0]);
  }

  positions.slice(0, 40).forEach((pos, index) => {
    const [row, col] = pos;
    grid[row * 11 + col] = board[index];
  });
  return grid;
}

function renderBoard(room) {
  const tiles = createBoardTiles(room.board);
  return `
    <div class="board">
      ${tiles
        .map((tile) => {
          if (!tile) return '<div class="tile"></div>';
          const bandStyle = tile.color ? `style="background:${tile.color}"` : "";
          return `
            <div class="tile ${tile.type === "corner" ? "corner" : ""}">
              ${tile.color ? `<div class="band" ${bandStyle}></div>` : ""}
              <div class="name">${tile.name}</div>
              ${tile.price ? `<div class="price">${tile.price}</div>` : ""}
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPlayers(room) {
  return `
    ${room.players
      .map(
        (player, index) => `
      <div class="player-card">
        <strong>${player.nickname}</strong>
        <div class="pill">Позиция: ${player.position}</div>
        <div class="pill">Кэш: ${player.cash}</div>
        <div class="pill">Свойства: ${player.properties.length}</div>
        ${index === room.currentPlayerIndex ? '<div class="badge">Ход игрока</div>' : ""}
      </div>
    `
      )
      .join("")}
  `;
}

function renderGame(path) {
  const roomId = path.split("/")[2] || "lobby";
  if (!state.socket) {
    state.socket = io();
    state.socket.on("room:update", (room) => {
      state.room = room;
      renderGame(path);
    });
    state.socket.on("rooms:update", () => {
      if (getPath().startsWith("/lobby")) renderLobby();
    });
  }

  if (!state.room || state.room.id !== roomId) {
    state.socket.emit("room:join", {
      roomId,
      nickname: state.user?.nickname,
    });
  }

  const room = state.room || { board: [], players: [], currentPlayerIndex: 0 };

  view.innerHTML = `
    <div class="board-layout">
      <aside class="sidebar">
        <section class="card">
          <h3>Игроки</h3>
          ${renderPlayers(room)}
        </section>
        <section class="card">
          <h3>Действия</h3>
          <button id="rollDice">Бросить кубики</button>
          <button class="ghost" onclick="navigate('/lobby')">Выйти</button>
        </section>
      </aside>
      <div>
        ${renderBoard(room)}
      </div>
      <aside class="sidebar">
        <section class="card">
          <h3>Логи</h3>
          <div class="chat">История ходов будет отображаться здесь.</div>
        </section>
      </aside>
    </div>
  `;

  const rollButton = document.getElementById("rollDice");
  rollButton.addEventListener("click", () => {
    state.socket.emit("game:roll", { roomId });
  });
}

window.addEventListener("hashchange", render);

setupAuth();
loadProfile().then(() => {
  setAuthState();
  render();
});
