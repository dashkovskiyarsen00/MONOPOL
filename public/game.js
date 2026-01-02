const tabs = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.tab-panel');
const gameOverlay = document.getElementById('game-overlay');
const openGame = document.getElementById('open-game');
const quickJoin = document.getElementById('quick-join');
const createRoom = document.getElementById('create-room');
const exitGame = document.getElementById('exit-game');
const notification = document.getElementById('notification');
const openHelp = document.getElementById('open-help');
const switchAccount = document.getElementById('switch-account');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchEmpty = document.getElementById('search-empty');
const editProfile = document.getElementById('edit-profile');
const settingsInputs = document.querySelectorAll('[data-setting]');
const buyButtons = document.querySelectorAll('.buy-button');
const gameTitle = document.getElementById('game-title');
const gameMeta = document.getElementById('game-meta');
const matchEvents = document.getElementById('match-events');
const rollDiceButton = document.getElementById('roll-dice');
const surrenderButton = document.getElementById('surrender-game');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const diceValues = document.querySelectorAll('.dice-panel .dice');
const diceStatus = document.getElementById('dice-status');
const searchResults = document.getElementById('search-results');
const roomList = document.getElementById('room-list');
const roomEmpty = document.getElementById('room-empty');
const onlineCount = document.getElementById('online-count');
const playersList = document.getElementById('players-list');
const profileName = document.getElementById('profile-name');
const profileRank = document.getElementById('profile-rank');
const profileClan = document.getElementById('profile-clan');
const profileLevel = document.getElementById('profile-level');
const profileElo = document.getElementById('profile-elo');
const profileWins = document.getElementById('profile-wins');
const profileLosses = document.getElementById('profile-losses');
const profileIncome = document.getElementById('profile-income');
const profileStreak = document.getElementById('profile-streak');
const roomModal = document.getElementById('room-modal');
const closeRoomModalButton = document.getElementById('close-room-modal');
const roomForm = document.getElementById('room-form');
const roomNameInput = document.getElementById('room-name');
const roomPlayersInput = document.getElementById('room-players');
const roomModeInput = document.getElementById('room-mode');
const roomThemeInput = document.getElementById('room-theme');
const roomBetInput = document.getElementById('room-bet');
const roomPrivacyInput = document.getElementById('room-privacy');
const authOverlay = document.getElementById('auth-overlay');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginIdentity = document.getElementById('login-identity');
const loginPassword = document.getElementById('login-password');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const boardElement = document.getElementById('game-board');
const boardWrapper = document.querySelector('.board-wrapper');
const quickPhrasesToggle = document.getElementById('quick-phrases-toggle');
const quickPhrasesMenu = document.getElementById('quick-phrases-menu');
const emojiRow = document.getElementById('emoji-row');
const chatMessages = document.getElementById('chat-messages');
const addBotButton = document.getElementById('add-bot');
const payBailButton = document.getElementById('pay-bail');
const openTradeButton = document.getElementById('open-trade');
const tradeModal = document.getElementById('trade-modal');
const closeTradeButton = document.getElementById('close-trade');
const tradeForm = document.getElementById('trade-form');
const tradePlayerSelect = document.getElementById('trade-player');
const tradePropertySelect = document.getElementById('trade-property');
const tradeOfferInput = document.getElementById('trade-offer');
const propertyModal = document.getElementById('property-modal');
const closePropertyButton = document.getElementById('close-property');
const propertyTitle = document.getElementById('property-title');
const propertySubtitle = document.getElementById('property-subtitle');
const propertyLogo = document.getElementById('property-logo');
const propertyPrice = document.getElementById('property-price');
const propertyMortgage = document.getElementById('property-mortgage');
const propertyRedeem = document.getElementById('property-redeem');
const propertyHouse = document.getElementById('property-house');
const propertyHouses = document.getElementById('property-houses');
const propertyRent = document.getElementById('property-rent');
const buyPropertyButton = document.getElementById('buy-property');
const buildPropertyButton = document.getElementById('build-property');
const mortgagePropertyButton = document.getElementById('mortgage-property');
const redeemPropertyButton = document.getElementById('redeem-property');
const sellPropertyButton = document.getElementById('sell-property');
const quickTheme = document.getElementById('quick-theme');
const quickMode = document.getElementById('quick-mode');
const quickElo = document.getElementById('quick-elo');
const quickSearchButton = document.getElementById('quick-search-button');
const quickSearchStop = document.getElementById('quick-search-stop');
const quickSearchStatus = document.getElementById('quick-search-status');
const inventoryGrid = document.getElementById('inventory-grid');
const achievementsGrid = document.getElementById('achievements-grid');
const friendsList = document.getElementById('friends-list');
const rulesList = document.getElementById('rules-list');
const leaderboardList = document.getElementById('leaderboard-list');
const matchHistory = document.getElementById('match-history');
const globalMatches = document.getElementById('global-matches');
const globalDuration = document.getElementById('global-duration');
const globalEconomy = document.getElementById('global-economy');
const globalActive = document.getElementById('global-active');
const globalLevel = document.getElementById('global-level');
const clanStatus = document.getElementById('clan-status');
const clanList = document.getElementById('clan-list');
const caseModal = document.getElementById('case-modal');
const caseTitle = document.getElementById('case-title');
const caseAnimation = document.getElementById('case-animation');
const caseReward = document.getElementById('case-reward');
const closeCaseButton = document.getElementById('close-case');
const openCaseButtons = document.querySelectorAll('.open-case');

let notificationTimeout;
let gameState = null;
let activeProperty = null;
let quickSearchInterval = null;

const BOARD_THEME_CLASSES = ['theme-classic'];

const STORAGE_KEYS = {
  users: 'monopolyUsers',
  rooms: 'monopolyRooms',
  currentUser: 'monopolyCurrentUser',
  friends: 'monopolyFriends',
  inventory: 'monopolyInventory',
  achievements: 'monopolyAchievements',
  stats: 'monopolyStats',
  matches: 'monopolyMatches',
  clans: 'monopolyClans',
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const state = {
  users: loadFromStorage(STORAGE_KEYS.users, []),
  rooms: loadFromStorage(STORAGE_KEYS.rooms, []),
  currentUserId: loadFromStorage(STORAGE_KEYS.currentUser, null),
  friends: loadFromStorage(STORAGE_KEYS.friends, {}),
  inventory: loadFromStorage(STORAGE_KEYS.inventory, []),
  achievements: loadFromStorage(STORAGE_KEYS.achievements, []),
  stats: loadFromStorage(STORAGE_KEYS.stats, {
    totalMatches: 0,
    totalDuration: 0,
    economy: 0,
  }),
  matches: loadFromStorage(STORAGE_KEYS.matches, []),
  clans: loadFromStorage(STORAGE_KEYS.clans, []),
};

const PLAYER_COLORS = ['#5bd38d', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#f97316'];
const START_BONUS = 200;
const INITIAL_CASH = 1500;
const JAIL_BAIL = 50;
const MAX_HOUSES = 4;

const QUICK_CHAT = [
  'Удачи всем!',
  'Я готов к бою.',
  'Сделаю ход быстро.',
  'Интересная партия.',
  'Нужна торговля?',
];

const EMOJI_REACTIONS = ['🔥', '⚡', '🎯', '💥', '🧿', '💎'];

const RULES = [
  'Игроки по очереди бросают два кубика и перемещаются по полю. При дубле игрок получает дополнительный ход.',
  'Если игрок попадает на свободную собственность, он может купить её за цену на карточке.',
  'Попадание на чужую собственность требует оплаты аренды. Аренда увеличивается при постройке филиалов.',
  'Полный набор цвета даёт пассивный доход и удваивает аренду без филиалов.',
  'Филиалы строятся только при полном наборе цвета и равномерно по группе.',
  'Тюрьма: игрок отправляется в тюрьму по соответствующей клетке или карте шанса. Выход — дубль или оплата залога.',
  'Шанс запускает события: деньги, потери, перемещения, тюрьма, бонус за бренды, налог на имущество.',
  'Торговля доступна в любой момент: игроки могут обменивать собственность и валюту.',
  'Если игрок не может оплатить долг, он банкротится, а собственность возвращается банку.',
  'Матч завершается автоматически, когда остаётся один игрок с капиталом.',
];

const GROUPS = {
  green: { basePrice: 120, rent: [10, 30, 90, 160, 250], houseCost: 100 },
  blue: { basePrice: 160, rent: [12, 40, 100, 180, 300], houseCost: 120 },
  orange: { basePrice: 200, rent: [16, 50, 150, 220, 340], houseCost: 140 },
  purple: { basePrice: 220, rent: [18, 60, 170, 250, 380], houseCost: 150 },
  teal: { basePrice: 240, rent: [20, 70, 190, 280, 420], houseCost: 160 },
  pink: { basePrice: 260, rent: [22, 80, 210, 300, 450], houseCost: 170 },
  yellow: { basePrice: 280, rent: [24, 90, 240, 320, 500], houseCost: 180 },
  red: { basePrice: 320, rent: [28, 100, 300, 400, 600], houseCost: 200 },
};

const BRAND_LOGOS = {
  invicta: { src: 'invicta-logo.png', alt: 'INVECTA' },
  zara: { src: 'zara-logo.png', alt: 'ZARA' },
  hm: { src: 'logo-hm.png', alt: 'H&M' },
  primark: { src: 'primark-logo.png', alt: 'PRIMARK' },
  remington: { src: 'remington-logo.png', alt: 'REMINGTON' },
  philips: { src: 'philips-logo.png', alt: 'PHILIPS' },
  dyson: { src: 'dyson-logo.png', alt: 'DYSON' },
  marshall: { src: 'Marshall_logo.png', alt: 'MARSHALL' },
  jbl: { src: 'jbl-logo.png', alt: 'JBL' },
  sony: { src: 'sony-logo.png', alt: 'SONY' },
};

const BOARD_SLOTS = [
  { type: 'start', label: 'Старт' },
  { type: 'property', group: 'green', brand: 'marshall', name: 'Marshall' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'green', brand: 'invicta', name: 'Invicta' },
  { type: 'tax', label: 'Налог на доход' },
  { type: 'transport', label: 'Вокзал Северный' },
  { type: 'property', group: 'blue', brand: 'zara', name: 'Zara' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'blue', brand: 'hm', name: 'H&M' },
  { type: 'property', group: 'blue', brand: 'primark', name: 'Primark' },
  { type: 'jail', label: 'Тюрьма' },
  { type: 'property', group: 'orange', brand: 'remington', name: 'Remington' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'orange', brand: 'philips', name: 'Philips' },
  { type: 'property', group: 'orange', brand: 'dyson', name: 'Dyson' },
  { type: 'utility', label: 'Электростанция' },
  { type: 'property', group: 'purple', brand: 'marshall', name: 'Marshall Plaza' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'purple', brand: 'jbl', name: 'JBL' },
  { type: 'property', group: 'purple', brand: 'sony', name: 'Sony' },
  { type: 'gojail', label: 'В тюрьму' },
  { type: 'property', group: 'teal', name: 'Парк Закатный' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'teal', name: 'Бульвар Центральный' },
  { type: 'property', group: 'teal', name: 'Старый рынок' },
  { type: 'tax', label: 'Налог на имущество' },
  { type: 'property', group: 'pink', name: 'Галерея' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'pink', name: 'Музыкальный холл' },
  { type: 'property', group: 'pink', name: 'Сити Плаза' },
  { type: 'free', label: 'Стоянка' },
  { type: 'property', group: 'yellow', name: 'Набережная' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'yellow', name: 'Арена' },
  { type: 'property', group: 'yellow', name: 'Театр' },
  { type: 'utility', label: 'Водоканал' },
  { type: 'chance', label: 'Шанс' },
  { type: 'property', group: 'red', name: 'Обсерватория' },
  { type: 'transport', label: 'Вокзал Южный' },
  { type: 'property', group: 'red', name: 'Променад' },
];

const CHANCE_CARDS = [
  { label: 'Бонус за бренды', type: 'brandBonus', amount: 35 },
  { label: 'Счастливый бонус', type: 'money', amount: 200 },
  { label: 'Налог на имущество', type: 'propertyTax', amount: 40 },
  { label: 'Штраф', type: 'money', amount: -150 },
  { label: 'Вернуться на старт', type: 'moveTo', index: 0 },
  { label: 'Идти в тюрьму', type: 'goJail' },
  { label: 'Рывок вперёд', type: 'move', steps: 4 },
  { label: 'Штраф за парковку', type: 'money', amount: -80 },
];

const CASE_REWARDS = [
  { name: 'Фишка: Классик', rarity: 'Редкий' },
  { name: 'Скин поля: Ночной город', rarity: 'Эпический' },
  { name: 'Эффект броска: Неон', rarity: 'Легендарный' },
  { name: 'Уникальные кубики: Графит', rarity: 'Редкий' },
  { name: 'Эффект победы: Золотой блеск', rarity: 'Эпический' },
  { name: 'Фишка: Лаки', rarity: 'Обычный' },
];

const ACHIEVEMENTS = [
  { id: 'starter', title: 'Первый бросок', text: 'Сыграть первый матч.', reward: '50 опыта' },
  { id: 'collector', title: 'Коллекционер', text: 'Собрать полный цвет.', reward: '120 опыта' },
  { id: 'boss', title: 'Босс рынка', text: 'Победить в матче.', reward: '200 опыта' },
  { id: 'lucky', title: 'Фортуна', text: 'Получить 3 положительные карты шанса подряд.', reward: '80 опыта' },
];

const DEFAULT_INVENTORY = [
  { name: 'Фишка: Страж Света', rarity: 'Эпический' },
  { name: 'Кубики: Скоростные', rarity: 'Редкий' },
  { name: 'Эффект: Золотой вихрь', rarity: 'Легендарный' },
  { name: 'Баннер: Классик', rarity: 'Обычный' },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const activateTab = (tabId) => {
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
  });
};

const showNotification = (message) => {
  if (!notification) {
    return;
  }
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  notification.textContent = message;
  notification.classList.add('visible');
  notificationTimeout = setTimeout(() => {
    notification.classList.remove('visible');
  }, 2600);
};

const getCurrentUser = () => state.users.find((user) => user.id === state.currentUserId) || null;

const setCurrentUser = (user) => {
  state.currentUserId = user ? user.id : null;
  saveToStorage(STORAGE_KEYS.currentUser, state.currentUserId);
};

const syncStorage = () => {
  saveToStorage(STORAGE_KEYS.users, state.users);
  saveToStorage(STORAGE_KEYS.rooms, state.rooms);
  saveToStorage(STORAGE_KEYS.friends, state.friends);
  saveToStorage(STORAGE_KEYS.inventory, state.inventory);
  saveToStorage(STORAGE_KEYS.achievements, state.achievements);
  saveToStorage(STORAGE_KEYS.stats, state.stats);
  saveToStorage(STORAGE_KEYS.matches, state.matches);
  saveToStorage(STORAGE_KEYS.clans, state.clans);
};

const openAuthOverlay = () => {
  if (!authOverlay) {
    return;
  }
  authOverlay.classList.add('active');
  authOverlay.setAttribute('aria-hidden', 'false');
};

const closeAuthOverlay = () => {
  if (!authOverlay) {
    return;
  }
  authOverlay.classList.remove('active');
  authOverlay.setAttribute('aria-hidden', 'true');
};

const openRoomModal = () => {
  if (!roomModal) {
    return;
  }
  roomModal.classList.add('active');
  roomModal.setAttribute('aria-hidden', 'false');
};

const closeRoomModal = () => {
  if (!roomModal) {
    return;
  }
  roomModal.classList.remove('active');
  roomModal.setAttribute('aria-hidden', 'true');
};

const openModal = (modal) => {
  if (!modal) {
    return;
  }
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
};

const closeModal = (modal) => {
  if (!modal) {
    return;
  }
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
};

const updateOnlineCount = () => {
  if (onlineCount) {
    onlineCount.textContent = String(state.users.length);
  }
  if (globalActive) {
    globalActive.textContent = String(state.users.length);
  }
};

const ensureDefaultInventory = () => {
  if (state.inventory.length === 0) {
    state.inventory = [...DEFAULT_INVENTORY];
  }
};

const ensureAchievements = () => {
  if (state.achievements.length === 0) {
    state.achievements = ACHIEVEMENTS.map((item) => ({ ...item, unlocked: false }));
  }
};

const updateProfile = () => {
  const user = getCurrentUser();
  if (!user) {
    if (profileName) {
      profileName.textContent = 'Гость';
    }
    if (profileRank) {
      profileRank.textContent = 'Новичок';
    }
    if (profileClan) {
      profileClan.textContent = 'Без клана';
    }
    if (profileLevel) {
      profileLevel.textContent = '1';
    }
    if (profileElo) {
      profileElo.textContent = '1000';
    }
    return;
  }
  if (profileName) {
    profileName.textContent = user.name;
  }
  if (profileRank) {
    profileRank.textContent = user.rank;
  }
  if (profileClan) {
    profileClan.textContent = user.clan || 'Без клана';
  }
  if (profileLevel) {
    profileLevel.textContent = String(user.level || 1);
  }
  if (profileElo) {
    profileElo.textContent = String(user.rating || 1000);
  }
  if (profileWins) {
    profileWins.textContent = String(user.wins || 0);
  }
  if (profileLosses) {
    profileLosses.textContent = String(user.losses || 0);
  }
  if (profileIncome) {
    profileIncome.textContent = String(user.avgIncome || 0);
  }
  if (profileStreak) {
    profileStreak.textContent = String(user.winStreak || 0);
  }
  if (globalLevel) {
    globalLevel.textContent = `Уровень ${user.level || 1}`;
  }
};

const renderInventory = () => {
  if (!inventoryGrid) {
    return;
  }
  inventoryGrid.innerHTML = '';
  state.inventory.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'inventory-item';
    const title = document.createElement('span');
    title.className = 'item-title';
    title.textContent = item.name;
    const rarity = document.createElement('span');
    rarity.className = 'rarity';
    rarity.textContent = item.rarity;
    card.append(title, rarity);
    inventoryGrid.appendChild(card);
  });
};

const renderAchievements = () => {
  if (!achievementsGrid) {
    return;
  }
  achievementsGrid.innerHTML = '';
  state.achievements.forEach((achievement) => {
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('h3');
    title.textContent = achievement.title;
    const text = document.createElement('p');
    text.textContent = achievement.text;
    const reward = document.createElement('span');
    reward.textContent = achievement.reward;
    reward.className = 'rarity';
    if (achievement.unlocked) {
      card.classList.add('active');
    }
    card.append(title, text, reward);
    achievementsGrid.appendChild(card);
  });
};

const renderFriends = () => {
  if (!friendsList) {
    return;
  }
  friendsList.innerHTML = '';
  const currentUser = getCurrentUser();
  const friendIds = currentUser ? state.friends[currentUser.id] || [] : [];
  if (friendIds.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'Друзей пока нет. Добавьте игроков в поиске.';
    friendsList.appendChild(item);
    return;
  }
  friendIds.forEach((friendId) => {
    const friend = state.users.find((user) => user.id === friendId);
    const item = document.createElement('li');
    const info = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = friend ? friend.name : 'Игрок';
    const meta = document.createElement('span');
    meta.textContent = friend ? `ELO ${friend.rating || 1000}` : 'Не в сети';
    info.append(name, meta);
    const button = document.createElement('button');
    button.className = 'ghost';
    button.textContent = 'Пригласить';
    button.addEventListener('click', () => showNotification('Приглашение отправлено.'));
    item.append(info, button);
    friendsList.appendChild(item);
  });
};

const renderRules = () => {
  if (!rulesList) {
    return;
  }
  rulesList.innerHTML = '';
  RULES.forEach((rule) => {
    const li = document.createElement('li');
    li.textContent = rule;
    rulesList.appendChild(li);
  });
};

const renderClans = () => {
  if (!clanStatus || !clanList) {
    return;
  }
  const currentUser = getCurrentUser();
  if (currentUser?.clan) {
    clanStatus.textContent = `Вы в клане ${currentUser.clan}.`;
  } else {
    clanStatus.textContent = 'Вы пока без клана.';
  }
  clanList.innerHTML = '';
  const sample = state.clans.length
    ? state.clans
    : [
        { name: 'Silver Streets', members: 12, rating: 3200 },
        { name: 'Golden Blocks', members: 8, rating: 2850 },
        { name: 'Neutral Core', members: 15, rating: 2600 },
      ];
  sample.forEach((clan) => {
    const item = document.createElement('li');
    item.textContent = `${clan.name} · ${clan.members} участников · рейтинг ${clan.rating}`;
    clanList.appendChild(item);
  });
};

const updateGlobalStats = () => {
  if (globalMatches) {
    globalMatches.textContent = String(state.stats.totalMatches || 0);
  }
  if (globalDuration) {
    const avg = state.stats.totalMatches ? Math.round(state.stats.totalDuration / state.stats.totalMatches) : 0;
    globalDuration.textContent = `${avg} мин`;
  }
  if (globalEconomy) {
    globalEconomy.textContent = String(state.stats.economy || 0);
  }
};

const renderMatchHistory = () => {
  if (!matchHistory) {
    return;
  }
  matchHistory.innerHTML = '';
  const recent = state.matches.slice(0, 8);
  if (recent.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'История пока пуста. Сыграйте первый матч.';
    matchHistory.appendChild(item);
    return;
  }
  recent.forEach((match) => {
    const item = document.createElement('li');
    item.textContent = `${match.date} · Победитель: ${match.winner} · ${match.mode} · ${match.theme}`;
    matchHistory.appendChild(item);
  });
};

const renderLeaderboard = () => {
  if (!leaderboardList) {
    return;
  }
  leaderboardList.innerHTML = '';
  const ranked = [...state.users].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
  ranked.forEach((user) => {
    const row = document.createElement('div');
    row.className = 'leaderboard-row';
    row.innerHTML = `
      <strong>${user.name}</strong>
      <span>${user.rating || 1000}</span>
      <span>${user.level || 1}</span>
      <span>${user.wins || 0}</span>
    `;
    leaderboardList.appendChild(row);
  });
};

const setBoardTheme = () => {
  if (!gameOverlay) {
    return;
  }
  gameOverlay.classList.remove(...BOARD_THEME_CLASSES);
  gameOverlay.classList.add('theme-classic');
  renderBoard();
};

const updateBoardSize = () => {
  if (!boardWrapper || !boardElement) {
    return;
  }
  const { width, height } = boardWrapper.getBoundingClientRect();
  const size = Math.max(260, Math.min(width, height));
  boardElement.style.setProperty('--board-size', `${Math.floor(size)}px`);
};

const getTileCoordinates = (index) => {
  if (index === 0) {
    return { row: 12, col: 12, rowSpan: 2, colSpan: 2 };
  }
  if (index > 0 && index < 10) {
    return { row: 12, col: 12 - index, rowSpan: 2, colSpan: 1 };
  }
  if (index === 10) {
    return { row: 12, col: 1, rowSpan: 2, colSpan: 2 };
  }
  if (index > 10 && index < 20) {
    return { row: 12 - (index - 10), col: 1, rowSpan: 1, colSpan: 2 };
  }
  if (index === 20) {
    return { row: 1, col: 1, rowSpan: 2, colSpan: 2 };
  }
  if (index > 20 && index < 30) {
    return { row: 1, col: index - 18, rowSpan: 2, colSpan: 1 };
  }
  if (index === 30) {
    return { row: 1, col: 12, rowSpan: 2, colSpan: 2 };
  }
  return { row: index - 28, col: 12, rowSpan: 1, colSpan: 2 };
};

const buildBoardData = () => {
  const groupCounters = {};
  return BOARD_SLOTS.map((slot, index) => {
    if (slot.type === 'property') {
      const group = slot.group;
      const count = groupCounters[group] || 0;
      groupCounters[group] = count + 1;
      const config = GROUPS[group];
      const price = config.basePrice + count * 20;
      const name = slot.name;
      return {
        ...slot,
        index,
        name,
        price,
        rentLevels: config.rent.map((rent) => rent + count * 2),
        houseCost: config.houseCost,
        ownerId: null,
        houses: 0,
        mortgaged: false,
      };
    }
    return { ...slot, index };
  });
};

const clearBoardTiles = () => {
  if (!boardElement) {
    return;
  }
  const tiles = boardElement.querySelectorAll('.tile');
  tiles.forEach((tile) => tile.remove());
};

const renderBoard = () => {
  if (!boardElement) {
    return;
  }
  if (!gameState) {
    gameState = gameState || { board: buildBoardData() };
  }
  const previous = gameState.board || [];
  const refreshed = buildBoardData();
  refreshed.forEach((tile, index) => {
    const oldTile = previous[index];
    if (oldTile && tile.type === 'property') {
      tile.ownerId = oldTile.ownerId;
      tile.houses = oldTile.houses;
      tile.mortgaged = oldTile.mortgaged;
    }
  });
  gameState.board = refreshed;
  clearBoardTiles();
  gameState.board.forEach((tile) => {
    const tileEl = document.createElement('div');
    tileEl.className = `tile type-${tile.type}`;
    tileEl.dataset.index = String(tile.index);
    const { row, col, rowSpan, colSpan } = getTileCoordinates(tile.index);
    tileEl.style.gridRow = rowSpan ? `${row} / span ${rowSpan}` : row;
    tileEl.style.gridColumn = colSpan ? `${col} / span ${colSpan}` : col;

    if (tile.type === 'property') {
      tileEl.classList.add('property', `edge-${getEdgePosition(tile.index)}`);
      const colorStrip = document.createElement('span');
      colorStrip.className = `color-strip color-${tile.group}`;
      const content = document.createElement('div');
      content.className = 'tile-content';
      const label = document.createElement('span');
      label.className = 'tile-label';
      label.textContent = tile.name;
      const logo = document.createElement('img');
      const logoData = tile.brand ? BRAND_LOGOS[tile.brand] : null;
      logo.className = 'tile-logo';
      if (logoData) {
        logo.src = logoData.src;
        logo.alt = logoData.alt;
      } else {
        logo.src = 'center-field.png';
        logo.alt = tile.name;
      }
      const price = document.createElement('span');
      price.className = 'tile-price';
      price.textContent = `💰 ${tile.price}`;
      const houses = document.createElement('div');
      houses.className = 'tile-houses';
      houses.dataset.houses = '0';
      const tokens = document.createElement('div');
      tokens.className = 'tile-tokens';
      content.append(label, logo, price, houses, tokens);
      tileEl.append(colorStrip, content);
      tileEl.addEventListener('click', () => openPropertyModal(tile.index));
    } else if (['start', 'jail', 'gojail', 'free'].includes(tile.type)) {
      tileEl.classList.add('corner');
    }

    boardElement.appendChild(tileEl);
  });
};

const getEdgePosition = (index) => {
  if (index <= 10) {
    return 'bottom';
  }
  if (index <= 20) {
    return 'left';
  }
  if (index <= 30) {
    return 'top';
  }
  return 'right';
};

const getOrderedTiles = () => Array.from(document.querySelectorAll('.board .tile')).sort(
  (a, b) => Number(a.dataset.index || 0) - Number(b.dataset.index || 0),
);

const clearActiveTiles = () => {
  getOrderedTiles().forEach((tile) => tile.classList.remove('active-turn'));
};

const addMatchEvent = (message) => {
  if (!matchEvents) {
    return;
  }
  const item = document.createElement('li');
  item.textContent = message;
  matchEvents.prepend(item);
  const maxItems = 8;
  while (matchEvents.children.length > maxItems) {
    matchEvents.removeChild(matchEvents.lastElementChild);
  }
};

const setMatchEvents = (events = []) => {
  if (!matchEvents) {
    return;
  }
  matchEvents.innerHTML = '';
  events.forEach((event) => addMatchEvent(event));
};

const renderPlayersList = () => {
  if (!playersList || !gameState) {
    return;
  }
  playersList.innerHTML = '';
  gameState.players.forEach((player, index) => {
    const item = document.createElement('li');
    if (index === gameState.currentTurn) {
      item.classList.add('active');
    }
    if (player.bankrupt) {
      item.classList.add('bankrupt');
    }
    const name = document.createElement('span');
    name.className = 'player-name';
    const dot = document.createElement('span');
    dot.className = 'player-dot';
    dot.style.background = player.color;
    const label = document.createElement('span');
    label.textContent = player.name;
    name.appendChild(dot);
    name.appendChild(label);
    const cash = document.createElement('span');
    cash.className = 'player-cash';
    cash.textContent = `💰 ${player.cash}`;
    item.appendChild(name);
    item.appendChild(cash);
    playersList.appendChild(item);
  });
  if (gameState.maxPlayers && gameState.players.length < gameState.maxPlayers) {
    for (let i = gameState.players.length; i < gameState.maxPlayers; i += 1) {
      const item = document.createElement('li');
      item.textContent = 'Свободный слот';
      playersList.appendChild(item);
    }
  }
};

const updateGameMeta = () => {
  if (!gameState || !gameMeta) {
    return;
  }
  const currentPlayer = gameState.players[gameState.currentTurn];
  const roundLabel = `Раунд ${gameState.round}`;
  gameMeta.textContent = `${roundLabel} · Ход игрока: ${currentPlayer.name}`;
  if (diceStatus) {
    diceStatus.textContent = gameState.isBusy
      ? 'Выполняется ход...'
      : currentPlayer.isHuman
        ? currentPlayer.inJail
          ? 'Вы в тюрьме — нужен дубль или залог'
          : 'Ваш ход — бросайте кубики'
        : `Ход игрока ${currentPlayer.name}`;
  }
  if (payBailButton) {
    payBailButton.disabled = !(currentPlayer.isHuman && currentPlayer.inJail && currentPlayer.cash >= JAIL_BAIL);
  }
};

const placeToken = (player, position) => {
  const tiles = getOrderedTiles();
  const tile = tiles[position];
  if (!tile || !player.token) {
    return;
  }
  const container = tile.querySelector('.tile-tokens');
  if (!container) {
    return;
  }
  container.appendChild(player.token);
};

const highlightActiveTile = () => {
  if (!gameState) {
    return;
  }
  clearActiveTiles();
  const tiles = getOrderedTiles();
  const activePlayer = gameState.players[gameState.currentTurn];
  const tile = tiles[activePlayer.position];
  if (tile) {
    tile.classList.add('active-turn');
  }
};

const updateTiles = () => {
  if (!gameState) {
    return;
  }
  const tiles = getOrderedTiles();
  tiles.forEach((tile) => {
    const index = Number(tile.dataset.index);
    const data = gameState.board[index];
    const tokens = tile.querySelector('.tile-tokens');
    if (tokens) {
      tokens.innerHTML = '';
    }
    if (data && data.type === 'property') {
      const houses = tile.querySelector('.tile-houses');
      if (houses) {
        houses.innerHTML = '';
        for (let i = 0; i < data.houses; i += 1) {
          const house = document.createElement('span');
          house.className = 'house';
          houses.appendChild(house);
        }
      }
      tile.classList.toggle('mortgaged', data.mortgaged);
    }
  });
  gameState.players.forEach((player) => {
    placeToken(player, player.position);
  });
  highlightActiveTile();
};

const buildPlayers = (room) => {
  const currentUser = getCurrentUser();
  const basePlayers = [];
  const userMap = new Map(state.users.map((user) => [user.id, user]));
  if (room?.players?.length) {
    room.players.forEach((playerId, index) => {
      const user = userMap.get(playerId);
      basePlayers.push({
        id: playerId,
        name: user ? user.name : `Игрок ${index + 1}`,
        color: PLAYER_COLORS[index % PLAYER_COLORS.length],
        cash: INITIAL_CASH,
        position: 0,
        isHuman: Boolean(currentUser && user && user.id === currentUser.id),
        inJail: false,
        jailTurns: 0,
        doubles: 0,
        bankrupt: false,
      });
    });
  }
  if (basePlayers.length === 0) {
    const guestName = currentUser ? currentUser.name : 'Гость';
    basePlayers.push({
      id: currentUser ? currentUser.id : 'guest',
      name: guestName,
      color: PLAYER_COLORS[0],
      cash: INITIAL_CASH,
      position: 0,
      isHuman: true,
      inJail: false,
      jailTurns: 0,
      doubles: 0,
      bankrupt: false,
    });
  }
  const targetPlayers = Math.max(room?.maxPlayers || 4, 2);
  while (basePlayers.length < Math.min(targetPlayers, 4)) {
    const index = basePlayers.length;
    basePlayers.push({
      id: `bot-${index}`,
      name: `Бот ${index}`,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      cash: INITIAL_CASH,
      position: 0,
      isHuman: false,
      inJail: false,
      jailTurns: 0,
      doubles: 0,
      bankrupt: false,
    });
  }
  basePlayers.forEach((player) => {
    const token = document.createElement('div');
    token.className = 'player-token';
    token.style.background = player.color;
    player.token = token;
  });
  return basePlayers;
};

const initializeGame = (room) => {
  const theme = 'classic';
  gameState = {
    players: buildPlayers(room),
    currentTurn: 0,
    round: 1,
    isBusy: false,
    maxPlayers: room?.maxPlayers || 4,
    roomId: room?.id || null,
    theme,
    board: buildBoardData(),
    startedAt: Date.now(),
  };
  renderBoard();
  updateTiles();
  renderPlayersList();
  updateGameMeta();
  const currentPlayer = gameState.players[gameState.currentTurn];
  if (rollDiceButton) {
    rollDiceButton.disabled = !currentPlayer.isHuman;
  }
  if (!currentPlayer.isHuman) {
    setTimeout(() => handleAutoTurn(), 1200);
  }
};

const getGroupProperties = (group) => gameState.board.filter((tile) => tile.type === 'property' && tile.group === group);

const hasMonopoly = (playerId, group) => {
  const properties = getGroupProperties(group);
  return properties.length > 0 && properties.every((tile) => tile.ownerId === playerId && !tile.mortgaged);
};

const getRent = (tile) => {
  if (!tile || tile.type !== 'property') {
    return 0;
  }
  if (tile.houses > 0) {
    return tile.rentLevels[tile.houses];
  }
  if (tile.ownerId && hasMonopoly(tile.ownerId, tile.group)) {
    return tile.rentLevels[0] * 2;
  }
  return tile.rentLevels[0];
};

const grantMonopolyIncome = (player) => {
  const groups = Object.keys(GROUPS);
  let bonus = 0;
  groups.forEach((group) => {
    if (hasMonopoly(player.id, group)) {
      bonus += 40;
    }
  });
  if (bonus > 0) {
    player.cash += bonus;
    addMatchEvent(`${player.name} получил пассивный доход ${bonus} за полный цвет.`);
  }
};

const moveToJail = (player) => {
  player.position = 10;
  player.inJail = true;
  player.jailTurns = 0;
  player.doubles = 0;
  addMatchEvent(`${player.name} отправлен в тюрьму.`);
};

const checkBankrupt = (player) => {
  if (player.cash > 0 || player.bankrupt) {
    return false;
  }
  player.bankrupt = true;
  player.cash = 0;
  gameState.board.forEach((tile) => {
    if (tile.type === 'property' && tile.ownerId === player.id) {
      tile.ownerId = null;
      tile.houses = 0;
      tile.mortgaged = false;
    }
  });
  addMatchEvent(`${player.name} банкрот и выбывает из игры.`);
  return true;
};

const applyChanceCard = (player) => {
  const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
  if (card.type === 'money') {
    player.cash += card.amount;
    addMatchEvent(`${player.name}: ${card.label} (${card.amount > 0 ? '+' : ''}${card.amount}).`);
  }
  if (card.type === 'moveTo') {
    player.position = card.index;
    addMatchEvent(`${player.name} переместился на старт.`);
  }
  if (card.type === 'move') {
    player.position = (player.position + card.steps) % gameState.board.length;
    addMatchEvent(`${player.name} продвинулся на ${card.steps} клеток.`);
  }
  if (card.type === 'goJail') {
    moveToJail(player);
  }
  if (card.type === 'brandBonus') {
    const owned = gameState.board.filter((tile) => tile.type === 'property' && tile.ownerId === player.id).length;
    const bonus = owned * card.amount;
    player.cash += bonus;
    addMatchEvent(`${player.name} получил бонус за бренды: ${bonus}.`);
  }
  if (card.type === 'propertyTax') {
    const houses = gameState.board.filter((tile) => tile.type === 'property' && tile.ownerId === player.id).reduce((sum, tile) => sum + tile.houses, 0);
    const tax = houses * card.amount;
    player.cash = Math.max(0, player.cash - tax);
    addMatchEvent(`${player.name} оплатил налог на имущество ${tax}.`);
  }
};

const payRent = (player, tile) => {
  if (!tile.ownerId || tile.ownerId === player.id || tile.mortgaged) {
    return;
  }
  const rent = getRent(tile);
  player.cash -= rent;
  const owner = gameState.players.find((item) => item.id === tile.ownerId);
  if (owner) {
    owner.cash += rent;
  }
  addMatchEvent(`${player.name} заплатил аренду ${rent}.`);
};

const applyTileEffect = (player, tile) => {
  if (!tile || player.bankrupt) {
    return;
  }
  if (tile.type === 'tax') {
    player.cash -= 150;
    addMatchEvent(`${player.name} оплатил налог 150.`);
  }
  if (tile.type === 'chance') {
    applyChanceCard(player);
  }
  if (tile.type === 'utility') {
    player.cash += 100;
    addMatchEvent(`${player.name} получил 100 за объект поддержки.`);
  }
  if (tile.type === 'transport') {
    player.cash += 120;
    addMatchEvent(`${player.name} заработал 120 на транспортной точке.`);
  }
  if (tile.type === 'property') {
    if (!tile.ownerId) {
      if (player.isHuman) {
        gameState.awaitingAction = true;
        openPropertyModal(tile.index);
      } else if (player.cash >= tile.price) {
        tile.ownerId = player.id;
        player.cash -= tile.price;
        addMatchEvent(`${player.name} купил ${tile.name} за ${tile.price}.`);
      }
    } else {
      payRent(player, tile);
    }
  }
  if (tile.type === 'gojail') {
    moveToJail(player);
  }
  checkBankrupt(player);
  renderPlayersList();
  updateTiles();
};

const movePlayer = async (player, steps) => {
  const totalTiles = gameState.board.length;
  player.token?.classList.add('moving');
  for (let i = 0; i < steps; i += 1) {
    await delay(300);
    player.position = (player.position + 1) % totalTiles;
    if (player.position === 0) {
      player.cash += START_BONUS;
      addMatchEvent(`${player.name} прошёл старт и получил ${START_BONUS}.`);
    }
    updateTiles();
  }
  player.token?.classList.remove('moving');
  const tile = gameState.board[player.position];
  applyTileEffect(player, tile);
  updateTiles();
};

const getNextActiveTurn = () => {
  if (!gameState) {
    return 0;
  }
  const activePlayers = gameState.players.filter((player) => !player.bankrupt);
  if (activePlayers.length <= 1) {
    return null;
  }
  let nextIndex = gameState.currentTurn;
  let safety = 0;
  do {
    nextIndex = (nextIndex + 1) % gameState.players.length;
    safety += 1;
  } while (gameState.players[nextIndex].bankrupt && safety < gameState.players.length);
  return nextIndex;
};

const updateUserStats = (winner) => {
  const humanPlayers = gameState.players.filter((player) => !player.id.startsWith('bot-'));
  humanPlayers.forEach((player) => {
    const user = state.users.find((entry) => entry.id === player.id);
    if (!user) {
      return;
    }
    const isWinner = winner && winner.id === player.id;
    user.wins = (user.wins || 0) + (isWinner ? 1 : 0);
    user.losses = (user.losses || 0) + (isWinner ? 0 : 1);
    user.winStreak = isWinner ? (user.winStreak || 0) + 1 : 0;
    user.rating = Math.max(800, (user.rating || 1000) + (isWinner ? 35 : -15));
    user.level = Math.max(1, (user.level || 1) + (isWinner ? 1 : 0));
    user.avgIncome = Math.round(((user.avgIncome || 0) + player.cash) / 2);
    if (isWinner) {
      const achievement = state.achievements.find((item) => item.id === 'boss');
      if (achievement) {
        achievement.unlocked = true;
      }
    }
  });
};

const finalizeGameIfNeeded = () => {
  if (!gameState) {
    return false;
  }
  const activePlayers = gameState.players.filter((player) => !player.bankrupt);
  if (activePlayers.length <= 1) {
    const winner = activePlayers[0];
    addMatchEvent(winner ? `${winner.name} победил в матче!` : 'Матч завершён.');
    if (diceStatus) {
      diceStatus.textContent = 'Матч завершён';
    }
    if (rollDiceButton) {
      rollDiceButton.disabled = true;
    }
    const duration = Math.max(1, Math.round((Date.now() - gameState.startedAt) / 60000));
    state.stats.totalMatches += 1;
    state.stats.totalDuration += duration;
    state.stats.economy += gameState.players.reduce((sum, player) => sum + player.cash, 0);
    state.matches.unshift({
      date: new Date().toLocaleString('ru-RU'),
      winner: winner ? winner.name : 'Нет',
      mode: gameState.roomId ? 'Комната' : 'Быстрый',
      theme: 'Классическая',
    });
    updateUserStats(winner);
    syncStorage();
    updateProfile();
    updateGlobalStats();
    renderMatchHistory();
    renderLeaderboard();
    if (gameState.roomId) {
      closeRoomById(gameState.roomId);
      gameState.roomId = null;
    }
    return true;
  }
  return false;
};

const endTurn = () => {
  if (!gameState) {
    return;
  }
  const nextIndex = getNextActiveTurn();
  if (nextIndex === null) {
    finalizeGameIfNeeded();
    return;
  }
  if (nextIndex === 0) {
    gameState.round += 1;
  }
  gameState.currentTurn = nextIndex;
  renderPlayersList();
  updateGameMeta();
  highlightActiveTile();
  const activePlayer = gameState.players[gameState.currentTurn];
  if (rollDiceButton) {
    rollDiceButton.disabled = !activePlayer.isHuman;
  }
  grantMonopolyIncome(activePlayer);
  if (!activePlayer.isHuman) {
    setTimeout(() => handleAutoTurn(), 1100);
  }
};

const handleJailTurn = async (player, roll) => {
  if (!player.inJail) {
    return roll;
  }
  const [die1, die2] = roll;
  if (die1 === die2) {
    player.inJail = false;
    player.jailTurns = 0;
    addMatchEvent(`${player.name} выбрался из тюрьмы по дублю!`);
    return roll;
  }
  player.jailTurns += 1;
  if (player.jailTurns >= 3 && player.cash >= JAIL_BAIL) {
    player.cash -= JAIL_BAIL;
    player.inJail = false;
    player.jailTurns = 0;
    addMatchEvent(`${player.name} оплатил залог ${JAIL_BAIL}.`);
    return roll;
  }
  addMatchEvent(`${player.name} остаётся в тюрьме.`);
  return null;
};

const performRoll = async (player) => {
  if (!diceValues.length || !gameState || gameState.isBusy) {
    return;
  }
  gameState.isBusy = true;
  if (rollDiceButton) {
    rollDiceButton.disabled = true;
  }
  if (diceStatus) {
    diceStatus.textContent = 'Бросок кубиков...';
  }
  diceValues.forEach((die) => die.classList.add('rolling'));
  await delay(600);
  const values = Array.from(diceValues).map(() => Math.ceil(Math.random() * 6));
  diceValues.forEach((die, index) => {
    die.textContent = values[index];
    die.classList.remove('rolling');
  });
  const total = values.reduce((sum, value) => sum + value, 0);
  addMatchEvent(`${player.name} бросил кубики: ${values.join(' и ')}.`);
  const jailRoll = await handleJailTurn(player, values);
  if (!jailRoll) {
    gameState.isBusy = false;
    endTurn();
    return;
  }
  await movePlayer(player, total);
  if (values[0] === values[1]) {
    player.doubles += 1;
    if (player.doubles >= 3) {
      moveToJail(player);
      player.doubles = 0;
      gameState.isBusy = false;
      endTurn();
      return;
    }
    addMatchEvent(`${player.name} выбросил дубль и получает дополнительный ход.`);
  } else {
    player.doubles = 0;
  }
  gameState.isBusy = false;
  if (gameState.awaitingAction) {
    updateGameMeta();
    return;
  }
  if (!finalizeGameIfNeeded()) {
    if (values[0] === values[1]) {
      updateGameMeta();
      if (!player.isHuman) {
        setTimeout(() => handleAutoTurn(), 900);
      } else if (rollDiceButton) {
        rollDiceButton.disabled = false;
      }
    } else {
      endTurn();
    }
  }
};

const handleAutoTurn = () => {
  if (!gameState) {
    return;
  }
  const player = gameState.players[gameState.currentTurn];
  if (player.isHuman || player.bankrupt) {
    return;
  }
  const owned = gameState.board.filter((tile) => tile.type === 'property' && tile.ownerId === player.id);
  const canBuild = owned.find((tile) => hasMonopoly(player.id, tile.group) && tile.houses < MAX_HOUSES && player.cash > tile.houseCost + 200);
  if (canBuild) {
    canBuild.houses += 1;
    player.cash -= canBuild.houseCost;
    addMatchEvent(`${player.name} построил филиал на ${canBuild.name}.`);
  }
  performRoll(player);
};

const openGameOverlay = (context = {}) => {
  if (!gameOverlay) {
    return;
  }
  gameOverlay.classList.add('active');
  gameOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('game-active');
  setBoardTheme();
  if (context.title && gameTitle) {
    gameTitle.textContent = context.title;
  }
  if (context.mode && gameMeta) {
    gameMeta.textContent = context.mode;
  }
  if (context.events) {
    setMatchEvents(context.events);
  }
  if (context.event) {
    addMatchEvent(context.event);
  }
  if (context.room) {
    initializeGame(context.room);
  } else if (!gameState) {
    initializeGame();
  }
  if (!context.events && !context.event) {
    addMatchEvent('Матч готов. Бросайте кубики.');
  }
  showNotification(context.notice || 'Матч открыт. Подготовка к игре.');
  requestAnimationFrame(updateBoardSize);
};

const closeGameOverlay = () => {
  if (!gameOverlay) {
    return;
  }
  if (gameState?.roomId) {
    closeRoomById(gameState.roomId);
  }
  gameOverlay.classList.remove('active');
  gameOverlay.setAttribute('aria-hidden', 'true');
  gameOverlay.classList.remove(...BOARD_THEME_CLASSES);
  document.body.classList.remove('game-active');
  gameState = null;
  showNotification('Возвращаемся в лобби.');
};

const renderRooms = () => {
  if (!roomList) {
    return;
  }
  roomList.innerHTML = '';
  if (roomEmpty) {
    roomEmpty.style.display = state.rooms.length === 0 ? 'block' : 'none';
  }
  state.rooms.forEach((room) => {
    const item = document.createElement('li');
    const info = document.createElement('div');
    const title = document.createElement('strong');
    const meta = document.createElement('span');
    title.textContent = room.name;
    const betLabel = room.bet > 0 ? `ставка ${room.bet}` : 'без ставки';
    meta.textContent = `${room.players.length}/${room.maxPlayers} игроков · режим ${room.mode} · тема классическая · ${betLabel} · ${room.privacy}`;
    info.appendChild(title);
    info.appendChild(meta);
    const joinButton = document.createElement('button');
    joinButton.className = 'ghost join-room';
    joinButton.textContent = 'Войти';
    joinButton.addEventListener('click', () => joinRoom(room.id));
    item.appendChild(info);
    item.appendChild(joinButton);
    roomList.appendChild(item);
  });
};

const joinRoom = (roomId) => {
  const user = getCurrentUser();
  if (!user) {
    openAuthOverlay();
    return;
  }
  const room = state.rooms.find((entry) => entry.id === roomId);
  if (!room) {
    showNotification('Комната не найдена.');
    return;
  }
  if (!room.players.includes(user.id)) {
    if (room.players.length >= room.maxPlayers) {
      showNotification('Комната заполнена. Выберите другую.');
      return;
    }
    room.players.push(user.id);
    syncStorage();
    renderRooms();
  }
  const playersLabel = `${room.players.length}/${room.maxPlayers} игроков`;
  openGameOverlay({
    title: `Комната: ${room.name}`,
    mode: `Режим: ${room.mode} · ${playersLabel}`,
    room,
    events: [`${user.name} присоединился к комнате.`],
    notice: `Подключение к комнате «${room.name}».`,
  });
};

const handleQuickJoin = () => {
  const user = getCurrentUser();
  if (!user) {
    openAuthOverlay();
    return;
  }
  const availableRoom = state.rooms.find((room) => room.players.length < room.maxPlayers);
  if (!availableRoom) {
    showNotification('Нет свободных комнат. Создайте новую.');
    return;
  }
  joinRoom(availableRoom.id);
};

const renderSearchResults = (query) => {
  if (!searchResults || !searchEmpty) {
    return;
  }
  const normalized = query.trim().toLowerCase();
  searchResults.innerHTML = '';
  if (!normalized) {
    searchEmpty.classList.remove('visible');
    return;
  }
  const currentUser = getCurrentUser();
  const matches = state.users.filter((user) => {
    if (currentUser && user.id === currentUser.id) {
      return false;
    }
    return user.name.toLowerCase().includes(normalized) || user.email.toLowerCase().includes(normalized);
  });
  if (matches.length === 0) {
    searchEmpty.classList.add('visible');
    return;
  }
  searchEmpty.classList.remove('visible');
  matches.forEach((user) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    const name = document.createElement('span');
    name.textContent = user.name;
    const button = document.createElement('button');
    button.className = 'ghost add-friend';
    const currentUserId = currentUser?.id;
    const friendList = currentUserId ? state.friends[currentUserId] || [] : [];
    button.textContent = friendList.includes(user.id) ? 'Добавлено' : 'Добавить';
    button.addEventListener('click', () => {
      if (!currentUserId) {
        openAuthOverlay();
        return;
      }
      const list = state.friends[currentUserId] || [];
      if (list.includes(user.id)) {
        state.friends[currentUserId] = list.filter((id) => id !== user.id);
        button.textContent = 'Добавить';
        showNotification('Игрок удален из друзей.');
      } else {
        state.friends[currentUserId] = [...list, user.id];
        button.textContent = 'Добавлено';
        showNotification('Игрок добавлен в друзья.');
      }
      syncStorage();
      renderFriends();
    });
    card.appendChild(name);
    card.appendChild(button);
    searchResults.appendChild(card);
  });
  showNotification(`Результатов найдено: ${matches.length}`);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) {
    openAuthOverlay();
    return;
  }
  const name = roomNameInput.value.trim();
  if (!name) {
    showNotification('Введите название комнаты.');
    return;
  }
  const maxPlayers = Number(roomPlayersInput.value);
  const bet = Number(roomBetInput.value || 0);
  const theme = 'classic';
  const room = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    hostId: user.id,
    players: [user.id],
    maxPlayers,
    mode: roomModeInput.value,
    theme,
    bet,
    privacy: roomPrivacyInput.value,
    createdAt: new Date().toISOString(),
  };
  state.rooms.unshift(room);
  syncStorage();
  renderRooms();
  closeRoomModal();
  roomForm.reset();
  openGameOverlay({
    title: `Комната: ${room.name}`,
    mode: `Режим: ${room.mode} · 1/${room.maxPlayers} игроков`,
    room,
    events: [`${user.name} создал комнату.`],
    notice: 'Комната создана и ожидает игроков.',
  });
};

const handleLogin = (event) => {
  event.preventDefault();
  const identity = loginIdentity.value.trim().toLowerCase();
  const password = loginPassword.value;
  const user = state.users.find(
    (entry) =>
      (entry.name.toLowerCase() === identity || entry.email.toLowerCase() === identity) &&
      entry.password === password,
  );
  if (!user) {
    showNotification('Неверный логин или пароль');
    return;
  }
  setCurrentUser(user);
  closeAuthOverlay();
  updateProfile();
  renderFriends();
  showNotification(`С возвращением, ${user.name}!`);
};

const handleRegister = (event) => {
  event.preventDefault();
  const name = registerName.value.trim();
  const email = registerEmail.value.trim().toLowerCase();
  const password = registerPassword.value;
  if (!name || !email || !password) {
    showNotification('Заполните все поля.');
    return;
  }
  const nameTaken = state.users.some((user) => user.name.toLowerCase() === name.toLowerCase());
  if (nameTaken) {
    showNotification('Логин уже занят');
    return;
  }
  const emailTaken = state.users.some((user) => user.email === email);
  if (emailTaken) {
    showNotification('Email уже занят.');
    return;
  }
  const newUser = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    email,
    password,
    rank: 'Новичок',
    clan: 'Без клана',
    rating: 1000,
    wins: 0,
    losses: 0,
    level: 1,
    avgIncome: 0,
    winStreak: 0,
  };
  state.users.push(newUser);
  setCurrentUser(newUser);
  syncStorage();
  updateOnlineCount();
  updateProfile();
  closeAuthOverlay();
  registerForm.reset();
  showNotification(`Аккаунт создан. Добро пожаловать, ${newUser.name}!`);
};

const closeQuickPhrasesMenu = () => {
  if (!quickPhrasesMenu) {
    return;
  }
  quickPhrasesMenu.classList.remove('open');
  quickPhrasesMenu.setAttribute('aria-hidden', 'true');
};

const renderQuickPhrases = () => {
  if (!quickPhrasesMenu) {
    return;
  }
  quickPhrasesMenu.innerHTML = '';
  QUICK_CHAT.forEach((line) => {
    const button = document.createElement('button');
    button.className = 'ghost';
    button.textContent = line;
    button.addEventListener('click', () => {
      if (chatInput) {
        chatInput.value = line;
        chatInput.focus();
      }
      closeQuickPhrasesMenu();
    });
    quickPhrasesMenu.appendChild(button);
  });
};

const renderEmoji = () => {
  if (!emojiRow) {
    return;
  }
  emojiRow.innerHTML = '';
  EMOJI_REACTIONS.forEach((emoji) => {
    const button = document.createElement('button');
    button.className = 'ghost';
    button.textContent = emoji;
    button.addEventListener('click', () => {
      addMatchEvent(`Реакция: ${emoji}`);
    });
    emojiRow.appendChild(button);
  });
};

const sendChatMessage = (messageOverride) => {
  const message = messageOverride || chatInput?.value.trim();
  if (!message) {
    showNotification('Введите сообщение перед отправкой.');
    return;
  }
  if (!chatMessages) {
    return;
  }
  const user = getCurrentUser();
  const entry = document.createElement('p');
  entry.innerHTML = `<strong>${user ? user.name : 'Игрок'}:</strong> ${message}`;
  chatMessages.appendChild(entry);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (chatInput) {
    chatInput.value = '';
  }
  showNotification('Сообщение отправлено.');
};

const openPropertyModal = (index) => {
  if (!propertyModal || !gameState) {
    return;
  }
  const tile = gameState.board[index];
  if (!tile || tile.type !== 'property') {
    return;
  }
  activeProperty = tile;
  const logoData = tile.brand ? BRAND_LOGOS[tile.brand] : null;
  propertyTitle.textContent = tile.name;
  propertySubtitle.textContent = tile.group.toUpperCase();
  propertyLogo.src = logoData ? logoData.src : 'center-field.png';
  propertyLogo.alt = logoData ? logoData.alt : tile.name;
  propertyPrice.textContent = `💰 ${tile.price}`;
  propertyMortgage.textContent = `💰 ${Math.round(tile.price * 0.5)}`;
  propertyRedeem.textContent = `💰 ${Math.round(tile.price * 0.6)}`;
  propertyHouse.textContent = `💰 ${tile.houseCost}`;
  propertyHouses.textContent = `${tile.houses}/${MAX_HOUSES}`;
  propertyRent.textContent = `💰 ${getRent(tile)}`;

  const currentPlayer = gameState.players[gameState.currentTurn];
  const isOwner = tile.ownerId === currentPlayer.id;
  buyPropertyButton.disabled = tile.ownerId || currentPlayer.cash < tile.price || !currentPlayer.isHuman;
  buildPropertyButton.disabled = !isOwner || !hasMonopoly(currentPlayer.id, tile.group) || tile.houses >= MAX_HOUSES || currentPlayer.cash < tile.houseCost;
  mortgagePropertyButton.disabled = !isOwner || tile.mortgaged;
  redeemPropertyButton.disabled = !isOwner || !tile.mortgaged || currentPlayer.cash < Math.round(tile.price * 0.6);
  sellPropertyButton.disabled = !isOwner;

  openModal(propertyModal);
};

const closePropertyModal = () => {
  activeProperty = null;
  closeModal(propertyModal);
  if (gameState?.awaitingAction) {
    gameState.awaitingAction = false;
    endTurn();
  }
};

const handleBuyProperty = () => {
  if (!activeProperty || !gameState) {
    return;
  }
  const player = gameState.players[gameState.currentTurn];
  if (player.cash < activeProperty.price || activeProperty.ownerId) {
    return;
  }
  activeProperty.ownerId = player.id;
  player.cash -= activeProperty.price;
  addMatchEvent(`${player.name} купил ${activeProperty.name} за ${activeProperty.price}.`);
  updateTiles();
  renderPlayersList();
  closePropertyModal();
};

const handleBuildProperty = () => {
  if (!activeProperty || !gameState) {
    return;
  }
  const player = gameState.players[gameState.currentTurn];
  if (!hasMonopoly(player.id, activeProperty.group) || activeProperty.houses >= MAX_HOUSES || player.cash < activeProperty.houseCost) {
    return;
  }
  activeProperty.houses += 1;
  player.cash -= activeProperty.houseCost;
  addMatchEvent(`${player.name} построил филиал на ${activeProperty.name}.`);
  updateTiles();
  renderPlayersList();
  closePropertyModal();
};

const handleMortgageProperty = () => {
  if (!activeProperty || !gameState) {
    return;
  }
  const player = gameState.players[gameState.currentTurn];
  if (activeProperty.ownerId !== player.id || activeProperty.mortgaged) {
    return;
  }
  activeProperty.mortgaged = true;
  player.cash += Math.round(activeProperty.price * 0.5);
  addMatchEvent(`${player.name} заложил ${activeProperty.name}.`);
  updateTiles();
  renderPlayersList();
  closePropertyModal();
};

const handleRedeemProperty = () => {
  if (!activeProperty || !gameState) {
    return;
  }
  const player = gameState.players[gameState.currentTurn];
  const cost = Math.round(activeProperty.price * 0.6);
  if (activeProperty.ownerId !== player.id || !activeProperty.mortgaged || player.cash < cost) {
    return;
  }
  activeProperty.mortgaged = false;
  player.cash -= cost;
  addMatchEvent(`${player.name} выкупил ${activeProperty.name}.`);
  updateTiles();
  renderPlayersList();
  closePropertyModal();
};

const handleSellProperty = () => {
  if (!activeProperty || !gameState) {
    return;
  }
  const player = gameState.players[gameState.currentTurn];
  if (activeProperty.ownerId !== player.id) {
    return;
  }
  const value = Math.round(activeProperty.price * 0.8);
  activeProperty.ownerId = null;
  activeProperty.houses = 0;
  activeProperty.mortgaged = false;
  player.cash += value;
  addMatchEvent(`${player.name} продал ${activeProperty.name} за ${value}.`);
  updateTiles();
  renderPlayersList();
  closePropertyModal();
};

const handleAddBot = () => {
  if (!gameState) {
    return;
  }
  if (gameState.players.length >= gameState.maxPlayers) {
    showNotification('Свободных слотов нет.');
    return;
  }
  const index = gameState.players.length;
  const bot = {
    id: `bot-${index}`,
    name: `Бот ${index}`,
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    cash: INITIAL_CASH,
    position: 0,
    isHuman: false,
    inJail: false,
    jailTurns: 0,
    doubles: 0,
    bankrupt: false,
  };
  const token = document.createElement('div');
  token.className = 'player-token';
  token.style.background = bot.color;
  bot.token = token;
  gameState.players.push(bot);
  addMatchEvent('В комнату добавлен бот.');
  renderPlayersList();
  updateTiles();
};

const handlePayBail = () => {
  if (!gameState) {
    return;
  }
  const player = gameState.players[gameState.currentTurn];
  if (!player.inJail || player.cash < JAIL_BAIL) {
    return;
  }
  player.cash -= JAIL_BAIL;
  player.inJail = false;
  player.jailTurns = 0;
  addMatchEvent(`${player.name} оплатил залог и вышел из тюрьмы.`);
  updateGameMeta();
  renderPlayersList();
};

const openTradeModal = () => {
  if (!tradeModal || !gameState) {
    return;
  }
  tradePlayerSelect.innerHTML = '';
  const currentPlayer = gameState.players[gameState.currentTurn];
  gameState.players
    .filter((player) => player.id !== currentPlayer.id && !player.bankrupt)
    .forEach((player) => {
      const option = document.createElement('option');
      option.value = player.id;
      option.textContent = player.name;
      tradePlayerSelect.appendChild(option);
    });
  updateTradeProperties();
  openModal(tradeModal);
};

const updateTradeProperties = () => {
  if (!tradePropertySelect || !gameState) {
    return;
  }
  tradePropertySelect.innerHTML = '';
  const targetId = tradePlayerSelect.value;
  const properties = gameState.board.filter((tile) => tile.type === 'property' && tile.ownerId === targetId);
  properties.forEach((tile) => {
    const option = document.createElement('option');
    option.value = String(tile.index);
    option.textContent = tile.name;
    tradePropertySelect.appendChild(option);
  });
};

const handleTradeSubmit = (event) => {
  event.preventDefault();
  if (!gameState) {
    return;
  }
  const targetId = tradePlayerSelect.value;
  const propertyIndex = Number(tradePropertySelect.value);
  const offer = Number(tradeOfferInput.value || 0);
  const currentPlayer = gameState.players[gameState.currentTurn];
  const targetPlayer = gameState.players.find((player) => player.id === targetId);
  const tile = gameState.board[propertyIndex];
  if (!targetPlayer || !tile || tile.ownerId !== targetId) {
    showNotification('Сделка невозможна.');
    return;
  }
  if (currentPlayer.cash < offer) {
    showNotification('Недостаточно средств для предложения.');
    return;
  }
  const required = Math.round(tile.price * (targetPlayer.isHuman ? 1 : 1.2));
  if (offer < required) {
    showNotification('Предложение отклонено.');
    return;
  }
  currentPlayer.cash -= offer;
  targetPlayer.cash += offer;
  tile.ownerId = currentPlayer.id;
  addMatchEvent(`${currentPlayer.name} купил ${tile.name} у ${targetPlayer.name} за ${offer}.`);
  updateTiles();
  renderPlayersList();
  closeModal(tradeModal);
};

const handleQuickSearchStart = () => {
  if (quickSearchInterval) {
    clearInterval(quickSearchInterval);
  }
  quickSearchStatus.textContent = 'Поиск соперников...';
  let seconds = 0;
  quickSearchInterval = setInterval(() => {
    seconds += 1;
    quickSearchStatus.textContent = `Поиск соперников... ${seconds}с`;
    if (seconds > 3) {
      clearInterval(quickSearchInterval);
      const room = {
        id: `${Date.now()}-quick`,
        name: 'Быстрый матч',
        hostId: 'system',
        players: [],
        maxPlayers: 4,
        mode: quickMode.value,
        theme: quickTheme.value,
        bet: 0,
        privacy: 'Открытая',
      };
      openGameOverlay({
        title: 'Классический матч',
        mode: `Режим: ${room.mode} · Автоподбор`,
        room,
        events: ['Матч найден. Игроки подключаются...'],
        notice: 'Подбор завершён. Готовимся к игре.',
      });
      quickSearchStatus.textContent = 'Матч найден!';
    }
  }, 900);
};

const handleQuickSearchStop = () => {
  if (quickSearchInterval) {
    clearInterval(quickSearchInterval);
    quickSearchInterval = null;
  }
  quickSearchStatus.textContent = 'Поиск остановлен.';
};

const handleCaseOpen = (event) => {
  const button = event.currentTarget;
  const caseName = button.dataset.case;
  if (!caseModal || !caseName) {
    return;
  }
  caseTitle.textContent = caseName;
  caseAnimation.textContent = 'Открытие...';
  caseReward.textContent = 'Подождите, награда определяется.';
  openModal(caseModal);
  setTimeout(() => {
    const reward = CASE_REWARDS[Math.floor(Math.random() * CASE_REWARDS.length)];
    caseAnimation.textContent = reward.rarity.toUpperCase();
    caseReward.textContent = reward.name;
    state.inventory.unshift({ name: reward.name, rarity: reward.rarity });
    syncStorage();
    renderInventory();
    showNotification(`Получено: ${reward.name}`);
  }, 800);
};

const closeRoomById = (roomId) => {
  if (!roomId) {
    return;
  }
  const index = state.rooms.findIndex((room) => room.id === roomId);
  if (index === -1) {
    return;
  }
  state.rooms.splice(index, 1);
  syncStorage();
  renderRooms();
};

const handleSurrender = () => {
  if (!gameState || gameState.isBusy) {
    return;
  }
  const playerIndex = gameState.players.findIndex((player) => player.isHuman && !player.bankrupt);
  if (playerIndex === -1) {
    return;
  }
  const player = gameState.players[playerIndex];
  player.cash = 0;
  player.bankrupt = true;
  addMatchEvent(`${player.name} сдался и покинул матч.`);
  renderPlayersList();
  updateTiles();
  if (finalizeGameIfNeeded()) {
    return;
  }
  if (playerIndex === gameState.currentTurn) {
    endTurn();
  } else {
    updateGameMeta();
  }
};

if (tabs.length) {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });
}

if (openGame) {
  openGame.addEventListener('click', openRoomModal);
}

if (createRoom) {
  createRoom.addEventListener('click', openRoomModal);
}

if (quickJoin) {
  quickJoin.addEventListener('click', handleQuickJoin);
}

if (exitGame) {
  exitGame.addEventListener('click', closeGameOverlay);
}

if (surrenderButton) {
  surrenderButton.addEventListener('click', handleSurrender);
}

if (openHelp) {
  openHelp.addEventListener('click', () => {
    activateTab('rules');
    showNotification('Открыт раздел с правилами.');
  });
}

if (switchAccount) {
  switchAccount.addEventListener('click', () => {
    setCurrentUser(null);
    openAuthOverlay();
    showNotification('Выберите аккаунт для продолжения.');
  });
}

if (searchButton) {
  searchButton.addEventListener('click', () => {
    renderSearchResults(searchInput?.value || '');
  });
}

if (searchInput) {
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      renderSearchResults(searchInput.value);
    }
  });
}

if (editProfile) {
  editProfile.addEventListener('click', () => {
    activateTab('settings');
    showNotification('Открыты настройки профиля.');
  });
}

settingsInputs.forEach((input) => {
  input.addEventListener('change', () => {
    const label = input.dataset.setting || 'Настройка';
    showNotification(`Сохранено: ${label}.`);
  });
});

buyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.classList.contains('purchased')) {
      return;
    }
    button.classList.add('purchased');
    button.textContent = 'Куплено';
    const item = button.dataset.item || 'Предмет';
    showNotification(`Покупка подтверждена: ${item}.`);
  });
});

if (rollDiceButton) {
  rollDiceButton.addEventListener('click', () => {
    if (!gameState) {
      initializeGame();
    }
    const currentPlayer = gameState.players[gameState.currentTurn];
    if (!currentPlayer.isHuman) {
      return;
    }
    performRoll(currentPlayer);
  });
}

if (sendChat) {
  sendChat.addEventListener('click', () => sendChatMessage());
}

if (chatInput) {
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      sendChatMessage();
    }
  });
}

if (quickPhrasesToggle) {
  quickPhrasesToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!quickPhrasesMenu) {
      return;
    }
    const isOpen = quickPhrasesMenu.classList.contains('open');
    if (isOpen) {
      closeQuickPhrasesMenu();
    } else {
      quickPhrasesMenu.classList.add('open');
      quickPhrasesMenu.setAttribute('aria-hidden', 'false');
    }
  });
}

document.addEventListener('click', (event) => {
  if (!quickPhrasesMenu || !quickPhrasesToggle) {
    return;
  }
  if (quickPhrasesMenu.contains(event.target) || quickPhrasesToggle.contains(event.target)) {
    return;
  }
  closeQuickPhrasesMenu();
});

if (closeRoomModalButton) {
  closeRoomModalButton.addEventListener('click', closeRoomModal);
}

if (roomForm) {
  roomForm.addEventListener('submit', handleRoomSubmit);
}

if (quickSearchButton) {
  quickSearchButton.addEventListener('click', handleQuickSearchStart);
}

if (quickSearchStop) {
  quickSearchStop.addEventListener('click', handleQuickSearchStop);
}

if (addBotButton) {
  addBotButton.addEventListener('click', handleAddBot);
}

if (payBailButton) {
  payBailButton.addEventListener('click', handlePayBail);
}

if (openTradeButton) {
  openTradeButton.addEventListener('click', openTradeModal);
}

if (closeTradeButton) {
  closeTradeButton.addEventListener('click', () => closeModal(tradeModal));
}

if (tradePlayerSelect) {
  tradePlayerSelect.addEventListener('change', updateTradeProperties);
}

if (tradeForm) {
  tradeForm.addEventListener('submit', handleTradeSubmit);
}

if (closePropertyButton) {
  closePropertyButton.addEventListener('click', closePropertyModal);
}

if (buyPropertyButton) {
  buyPropertyButton.addEventListener('click', handleBuyProperty);
}

if (buildPropertyButton) {
  buildPropertyButton.addEventListener('click', handleBuildProperty);
}

if (mortgagePropertyButton) {
  mortgagePropertyButton.addEventListener('click', handleMortgageProperty);
}

if (redeemPropertyButton) {
  redeemPropertyButton.addEventListener('click', handleRedeemProperty);
}

if (sellPropertyButton) {
  sellPropertyButton.addEventListener('click', handleSellProperty);
}

if (closeCaseButton) {
  closeCaseButton.addEventListener('click', () => closeModal(caseModal));
}

openCaseButtons.forEach((button) => {
  button.addEventListener('click', handleCaseOpen);
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    authTabs.forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.authTab;
    if (loginForm && registerForm) {
      loginForm.classList.toggle('active', target === 'login');
      registerForm.classList.toggle('active', target === 'register');
    }
  });
});

if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
  registerForm.addEventListener('submit', handleRegister);
}

window.addEventListener('resize', updateBoardSize);

ensureDefaultInventory();
ensureAchievements();
renderInventory();
renderAchievements();
renderFriends();
renderRules();
renderClans();
renderLeaderboard();
renderMatchHistory();
updateGlobalStats();
renderQuickPhrases();
renderEmoji();
updateOnlineCount();
updateProfile();
renderRooms();
if (!getCurrentUser()) {
  openAuthOverlay();
}