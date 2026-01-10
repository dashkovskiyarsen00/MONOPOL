const { heroes, items, counterpicks, topHeroes, builds } = window.DOTA_DATA;

const heroesGrid = document.querySelector("#heroes-grid");
const itemsGrid = document.querySelector("#items-grid");
const topGrid = document.querySelector("#top-grid");
const buildsGrid = document.querySelector("#builds-grid");
const heroSelect = document.querySelector("#hero-select");

const heroModal = document.querySelector("#hero-modal");
const heroModalBody = document.querySelector("#hero-modal-body");
const itemModal = document.querySelector("#item-modal");
const itemModalBody = document.querySelector("#item-modal-body");

const filterChips = document.querySelectorAll(".filter-chip");
const heroMap = new Map(heroes.map((hero) => [hero.name, hero]));

const getHeroIcon = (name) => heroMap.get(name)?.icon || "⭐";
const getHeroLabel = (name) => `${getHeroIcon(name)} ${name}`;

const createHeroCard = (hero) => {
  const card = document.createElement("article");
  card.className = "hero-card";
  card.dataset.role = hero.role;
  card.innerHTML = `
    <div class="hero-portrait" style="background: ${hero.color}">
      <span class="hero-portrait-icon">${hero.icon}</span>
      <span class="hero-portrait-name">${hero.name}</span>
    </div>
    <h3>${hero.icon} ${hero.name}</h3>
    <div class="hero-tags">
      <span class="tag role">${hero.role}</span>
      <span class="tag">${hero.attackType}</span>
    </div>
  `;
  card.addEventListener("click", () => openHeroModal(hero));
  return card;
};

const createItemCard = (item) => {
  const card = document.createElement("article");
  card.className = "item-card";
  card.innerHTML = `
    <div class="item-header">
      <div class="item-icon">${item.icon}</div>
      <div>
        <h4>${item.name}</h4>
        <div class="item-meta">
          <span>${item.cost} gold</span>
        </div>
      </div>
    </div>
    <p>${item.short}</p>
    <div class="item-category">${item.category}</div>
  `;
  card.addEventListener("click", () => openItemModal(item));
  return card;
};

const renderHeroes = (roleFilter = "all") => {
  heroesGrid.innerHTML = "";
  heroes
    .filter((hero) => roleFilter === "all" || hero.role === roleFilter)
    .forEach((hero) => heroesGrid.appendChild(createHeroCard(hero)));
};

const renderItems = () => {
  itemsGrid.innerHTML = "";
  items.forEach((item) => itemsGrid.appendChild(createItemCard(item)));
};

const renderTopHeroes = () => {
  topGrid.innerHTML = "";
  topHeroes.forEach((group) => {
    const card = document.createElement("article");
    card.className = "top-card";
    card.innerHTML = `
      <h3>${group.title}</h3>
      <div class="rank-list">
        ${group.rankings
          .map(
            (entry, index) => `
            <div class="rank-item">
              <span>#${index + 1} ${getHeroLabel(entry.name)}</span>
              <strong>${entry.rating}</strong>
            </div>
          `
          )
          .join("")}
      </div>
    `;
    topGrid.appendChild(card);
  });
};

const renderBuilds = () => {
  buildsGrid.innerHTML = "";
  builds.forEach((build) => {
    const card = document.createElement("article");
    card.className = "build-card";
    const heroesLabel = build.heroes.map((name) => getHeroLabel(name)).join(", ");
    card.innerHTML = `
      <h3>${build.name}</h3>
      <p>${build.description}</p>
      <div>
        <strong>Герои:</strong> ${heroesLabel}
      </div>
      <div class="build-items">
        ${build.items.map((item) => `<span class="build-item">${item}</span>`).join("")}
      </div>
    `;
    buildsGrid.appendChild(card);
  });
};

const renderHeroSelect = () => {
  heroSelect.innerHTML = heroes
    .map((hero) => `<option value="${hero.name}">${hero.icon} ${hero.name}</option>`)
    .join("");
  heroSelect.value = heroes[0].name;
  updateCounterpicks(heroes[0].name);
};

const updateCounterpicks = (heroName) => {
  const data = counterpicks[heroName];
  const strongList = document.querySelector("#strong-list");
  const weakList = document.querySelector("#weak-list");
  const strongReason = document.querySelector("#strong-reason");
  const weakReason = document.querySelector("#weak-reason");

  const renderCounterList = (entries, list, reason, arrow) => {
    list.innerHTML = entries
      .map(
        (entry) => `
        <button class="counter-item" type="button" data-reason="${entry.reason}">
          <span class="counter-hero">${getHeroLabel(entry.name)}</span>
          <span class="counter-arrow">${arrow}</span>
        </button>
      `
      )
      .join("");

    const buttons = Array.from(list.querySelectorAll(".counter-item"));
    if (buttons.length > 0) {
      buttons[0].classList.add("active");
      reason.textContent = entries[0].reason;
    } else {
      reason.textContent = "Нет доступных данных по матчапу.";
    }

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        reason.textContent = entries[index].reason;
      });
    });
  };

  renderCounterList(data.strong, strongList, strongReason, "➜");
  renderCounterList(data.weak, weakList, weakReason, "⬅︎");
};

const openHeroModal = (hero) => {
  heroModalBody.innerHTML = `
    <div class="modal-hero">
      <div class="modal-hero-header">
        <div class="modal-portrait" style="background: ${hero.color}">${hero.icon}</div>
        <div>
          <h3>${hero.icon} ${hero.name}</h3>
          <p>${hero.description}</p>
          <div class="modal-tags">
            <span class="modal-tag">${hero.role}</span>
            <span class="modal-tag">${hero.attackType}</span>
          </div>
        </div>
      </div>
      <div class="modal-section">
        <h4>Способности</h4>
        <div class="abilities">
          ${hero.abilities
            .map(
              (ability) => `
              <div class="ability">
                <div class="ability-icon">${ability.icon}</div>
                <div>
                  <h4>${ability.name}</h4>
                  <p>${ability.description}</p>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      </div>
      <div class="modal-section">
        <h4>Сильные стороны</h4>
        <div class="list-grid">
          ${hero.strengths.map((text) => `<span>${text}</span>`).join("")}
        </div>
      </div>
      <div class="modal-section">
        <h4>Слабости</h4>
        <div class="list-grid">
          ${hero.weaknesses?.map((text) => `<span>${text}</span>`).join("") || ""}
        </div>
      </div>
    </div>
  `;
  heroModal.classList.add("open");
};

const openItemModal = (item) => {
  itemModalBody.innerHTML = `
    <div class="modal-hero">
      <div class="modal-hero-header">
        <div class="modal-portrait" style="background: linear-gradient(135deg, #4bd4ff, #7c5cff)">
          ${item.icon}
        </div>
        <div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="modal-tags">
            <span class="modal-tag">${item.category}</span>
            <span class="modal-tag">${item.cost} gold</span>
          </div>
        </div>
      </div>
    </div>
  `;
  itemModal.classList.add("open");
};

const closeModal = (modal) => {
  modal.classList.remove("open");
};

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((btn) => btn.classList.remove("active"));
    chip.classList.add("active");
    renderHeroes(chip.dataset.filter);
  });
});

heroSelect.addEventListener("change", (event) => {
  updateCounterpicks(event.target.value);
});

[heroModal, itemModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.dataset.close;
    const modal = document.querySelector(`#${modalId}`);
    closeModal(modal);
  });
});

renderHeroes();
renderItems();
renderTopHeroes();
renderBuilds();
renderHeroSelect();
