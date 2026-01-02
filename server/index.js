const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const users = new Map();
const sessions = new Map();
const rooms = new Map();

const createInitialBoard = () => {
  const colors = [
    "#8b5d33",
    "#7fb1ff",
    "#d26bc0",
    "#f39b44",
    "#e24f4f",
    "#f0d34a",
    "#3bb273",
    "#1b2f7a",
  ];
  const brands = [
    "Apple",
    "Google",
    "Amazon",
    "Netflix",
    "Coca-Cola",
    "Nike",
    "Adidas",
    "BMW",
    "Mercedes",
    "Sony",
    "Casio",
    "Remington",
    "Primark",
    "H&M",
    "ZARA",
    "Samsung",
    "Intel",
    "Meta",
    "Spotify",
    "McDonald's",
    "Starbucks",
    "Uber",
  ];
  const board = [];
  let brandIndex = 0;
  for (let i = 0; i < 40; i += 1) {
    if ([0, 10, 20, 30].includes(i)) {
      board.push({
        id: i,
        type: "corner",
        name: ["Старт", "Тюрьма", "Бесплатная парковка", "В тюрьму"][
          [0, 10, 20, 30].indexOf(i)
        ],
      });
      continue;
    }
    if ([2, 7, 17, 22, 33, 36].includes(i)) {
      board.push({ id: i, type: "chance", name: "Шанс" });
      continue;
    }
    if ([4, 38].includes(i)) {
      board.push({ id: i, type: "tax", name: "Налог" });
      continue;
    }
    if ([5, 15, 25, 35].includes(i)) {
      board.push({ id: i, type: "rail", name: "Транспорт" });
      continue;
    }
    const color = colors[Math.floor((i - 1) / 5) % colors.length];
    board.push({
      id: i,
      type: "property",
      name: brands[brandIndex % brands.length],
      color,
      price: 100 + (i % 10) * 20,
      rent: 10 + (i % 8) * 5,
    });
    brandIndex += 1;
  }
  return board;
};

const defaultRoom = () => ({
  id: "lobby",
  mode: "casual",
  board: createInitialBoard(),
  players: [],
  bank: 200000,
  currentPlayerIndex: 0,
  status: "waiting",
  createdAt: Date.now(),
});

rooms.set("lobby", defaultRoom());

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  nickname: user.nickname,
  avatar: user.avatar,
  stats: user.stats,
  rating: user.rating,
  rank: user.rank,
  mastery: user.mastery,
  inventory: user.inventory,
});

const createUser = (email, password) => {
  const id = `u_${Math.random().toString(36).slice(2, 9)}`;
  const nickname = email.split("@")[0];
  const user = {
    id,
    email,
    password,
    nickname,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=64&h=64",
    stats: {
      games: 0,
      wins: 0,
      winRate: 0,
      totalTime: 0,
      maxCapital: 1500,
    },
    rating: 1000,
    rank: "Бронза",
    mastery: 1,
    inventory: {
      coins: 1200,
      skins: ["classic"],
      activeSkin: "classic",
      frames: ["neon"],
      activeFrame: "neon",
      effects: ["spark"],
      activeEffect: "spark",
    },
  };
  users.set(email, user);
  return user;
};

const getRoomList = () =>
  Array.from(rooms.values()).map((room) => ({
    id: room.id,
    mode: room.mode,
    players: room.players.length,
    status: room.status,
  }));

app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  if (users.has(email)) {
    return res.status(409).json({ error: "User already exists" });
  }
  const user = createUser(email, password);
  const token = `token_${Math.random().toString(36).slice(2)}`;
  sessions.set(token, user.id);
  return res.json({ token, user: sanitizeUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = `token_${Math.random().toString(36).slice(2)}`;
  sessions.set(token, user.id);
  return res.json({ token, user: sanitizeUser(user) });
});

app.post("/api/auth/reset", (req, res) => {
  const { email } = req.body;
  if (!email || !users.has(email)) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({ message: "Reset link simulated", token: "reset-token" });
});

app.get("/api/profile", (req, res) => {
  const token = req.headers.authorization;
  const userId = sessions.get(token);
  const user = Array.from(users.values()).find((entry) => entry.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ user: sanitizeUser(user) });
});

app.get("/api/lobby", (req, res) => {
  return res.json({ rooms: getRoomList() });
});

app.post("/api/lobby/create", (req, res) => {
  const { mode, players } = req.body;
  const id = `room_${Math.random().toString(36).slice(2, 8)}`;
  const room = {
    id,
    mode: mode || "casual",
    board: createInitialBoard(),
    players: [],
    maxPlayers: players || 4,
    currentPlayerIndex: 0,
    status: "waiting",
    createdAt: Date.now(),
  };
  rooms.set(id, room);
  io.emit("rooms:update", getRoomList());
  return res.json({ room });
});

app.get("/api/shop", (req, res) => {
  return res.json({
    skins: [
      { id: "classic", name: "Классика", price: 0 },
      { id: "neon", name: "Неон", price: 400 },
      { id: "gold", name: "Золото", price: 900 },
    ],
    frames: [
      { id: "neon", name: "Неоновая рамка", price: 200 },
      { id: "diamond", name: "Алмазная", price: 700 },
    ],
    effects: [
      { id: "spark", name: "Искры", price: 150 },
      { id: "comet", name: "Комета", price: 350 },
    ],
  });
});

app.get("/api/leaderboard", (req, res) => {
  const list = Array.from(users.values())
    .map((user) => ({
      nickname: user.nickname,
      wins: user.stats.wins,
      games: user.stats.games,
      rating: user.rating,
    }))
    .sort((a, b) => b.rating - a.rating);
  return res.json({ list });
});

const ensureRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      mode: "casual",
      board: createInitialBoard(),
      players: [],
      currentPlayerIndex: 0,
      status: "waiting",
      createdAt: Date.now(),
    });
  }
  return rooms.get(roomId);
};

const advanceTurn = (room) => {
  room.currentPlayerIndex =
    (room.currentPlayerIndex + 1) % room.players.length;
};

io.on("connection", (socket) => {
  socket.on("room:join", ({ roomId, nickname }) => {
    const room = ensureRoom(roomId);
    const player = {
      id: socket.id,
      nickname: nickname || `Player-${socket.id.slice(0, 4)}`,
      position: 0,
      cash: 1500,
      properties: [],
      inJail: false,
      lastRoll: [0, 0],
    };
    room.players.push(player);
    socket.join(roomId);
    io.to(roomId).emit("room:update", room);
    io.emit("rooms:update", getRoomList());
  });

  socket.on("room:leave", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    room.players = room.players.filter((p) => p.id !== socket.id);
    if (room.players.length === 0 && roomId !== "lobby") {
      rooms.delete(roomId);
    }
    socket.leave(roomId);
    io.to(roomId).emit("room:update", room);
    io.emit("rooms:update", getRoomList());
  });

  socket.on("game:roll", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room || room.players.length === 0) return;
    const player = room.players[room.currentPlayerIndex];
    if (!player || player.id !== socket.id) return;
    const roll = [
      Math.ceil(Math.random() * 6),
      Math.ceil(Math.random() * 6),
    ];
    player.lastRoll = roll;
    player.position = (player.position + roll[0] + roll[1]) % 40;
    const tile = room.board[player.position];
    if (tile.type === "property") {
      const owned = room.players.some((p) => p.properties.includes(tile.id));
      if (!owned && player.cash >= tile.price) {
        player.cash -= tile.price;
        player.properties.push(tile.id);
      } else if (owned && !player.properties.includes(tile.id)) {
        player.cash -= tile.rent;
      }
    }
    if (tile.type === "tax") {
      player.cash -= 100;
    }
    if (tile.type === "corner" && tile.name === "В тюрьму") {
      player.position = 10;
      player.inJail = true;
    }
    advanceTurn(room);
    io.to(roomId).emit("room:update", room);
  });

  socket.on("disconnect", () => {
    rooms.forEach((room, roomId) => {
      room.players = room.players.filter((p) => p.id !== socket.id);
      if (room.players.length === 0 && roomId !== "lobby") {
        rooms.delete(roomId);
      }
      io.to(roomId).emit("room:update", room);
    });
    io.emit("rooms:update", getRoomList());
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
