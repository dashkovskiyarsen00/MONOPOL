const DOTA_DATA = {
  heroes: [
    {
      id: "phantom-assassin",
      name: "Phantom Assassin",
      role: "Carry",
      attackType: "Melee",
      color: "linear-gradient(135deg, #f54ea2, #ff7676)",
      description:
        "Скрытный убийца, который выжидает момент и уничтожает ключевую цель критами.",
      abilities: [
        {
          icon: "🗡️",
          name: "Stifling Dagger",
          description: "Дальность атаки, замедление и урон от крита."
        },
        {
          icon: "🌫️",
          name: "Phantom Strike",
          description: "Быстрый прыжок к цели и резкий прирост скорости атак."
        },
        {
          icon: "🛡️",
          name: "Blur",
          description: "Пассивное уклонение и маскировка вне обзора."
        },
        {
          icon: "💥",
          name: "Coup de Grace",
          description: "Смертельные критические удары с огромным множителем."
        }
      ],
      strengths: ["Быстрые соло-киллы", "Сильный лейт", "Сложно поймать"],
      weaknesses: ["Зависима от предметов", "Боится контроля", "Рискованная линия"]
    },
    {
      id: "storm-spirit",
      name: "Storm Spirit",
      role: "Mid",
      attackType: "Ranged",
      color: "linear-gradient(135deg, #37a1ff, #6bffe8)",
      description:
        "Мобильный мидер с мощным магическим бурстом и контролем территории.",
      abilities: [
        {
          icon: "⚡",
          name: "Static Remnant",
          description: "Создает взрывной шар, наказание за попытку сблизиться."
        },
        {
          icon: "🌀",
          name: "Electric Vortex",
          description: "Притягивает врага и обездвиживает его."
        },
        {
          icon: "🔋",
          name: "Overload",
          description: "Усиленные автоатаки после использования способностей."
        },
        {
          icon: "🌩️",
          name: "Ball Lightning",
          description: "Сверхскоростное перемещение с уроном по пути."
        }
      ],
      strengths: ["Сильный burst", "Гибкий ганк", "Доминирует карту"],
      weaknesses: ["Слаб в начале", "Зависит от маны", "Страдает от silence"]
    },
    {
      id: "crystal-maiden",
      name: "Crystal Maiden",
      role: "Support",
      attackType: "Ranged",
      color: "linear-gradient(135deg, #7ce7ff, #a1b8ff)",
      description:
        "Контроль и ауры маны для всей команды. Идеальна для перехвата агрессии.",
      abilities: [
        {
          icon: "❄️",
          name: "Crystal Nova",
          description: "Мгновенное АоЕ-замедление и урон."
        },
        {
          icon: "🧊",
          name: "Frostbite",
          description: "Корень и урон по времени."
        },
        {
          icon: "🔮",
          name: "Arcane Aura",
          description: "Поддержка маны для всей команды."
        },
        {
          icon: "🌨️",
          name: "Freezing Field",
          description: "Смертельный АоЕ-ультимейт с взрывами льда."
        }
      ],
      strengths: ["Мощный контроль", "Поддержка маны", "Сильные ульты"],
      weaknesses: ["Хрупкая", "Низкая скорость", "Зависима от позиции"]
    },
    {
      id: "mars",
      name: "Mars",
      role: "Offlane",
      attackType: "Melee",
      color: "linear-gradient(135deg, #ffb14a, #ff5f6d)",
      description:
        "Танк-инициатор с аренной зоной, в которой враги становятся беспомощны.",
      abilities: [
        {
          icon: "🛡️",
          name: "Spear of Mars",
          description: "Пронзает врага и пришпиливает к препятствию."
        },
        {
          icon: "🏛️",
          name: "God's Rebuke",
          description: "Мощный удар с отталкиванием и критом."
        },
        {
          icon: "🛡️",
          name: "Bulwark",
          description: "Блокирует урон спереди, защищая команду."
        },
        {
          icon: "⚔️",
          name: "Arena of Blood",
          description: "Закрывает арену и не выпускает противников."
        }
      ],
      strengths: ["Инициация", "Сильный контроль", "Командная защита"],
      weaknesses: ["Зависит от ульты", "Слаб против мобильных", "Нужна поддержка"]
    },
    {
      id: "juggernaut",
      name: "Juggernaut",
      role: "Carry",
      attackType: "Melee",
      color: "linear-gradient(135deg, #ff6f91, #fbb034)",
      description:
        "Классический керри с безопасным лайном и мощным ультимейтом для дуэлей.",
      abilities: [
        {
          icon: "🌪️",
          name: "Blade Fury",
          description: "Неуязвимость к магии и урон по области."
        },
        {
          icon: "🩸",
          name: "Healing Ward",
          description: "Лечит союзников и обеспечивает давление."
        },
        {
          icon: "⚔️",
          name: "Blade Dance",
          description: "Пассивный крит-урон."
        },
        {
          icon: "✨",
          name: "Omnislash",
          description: "Серия ударов по цели и ближайшим врагам."
        }
      ],
      strengths: ["Стабильный лейн", "Гибкие сборки", "Хорош против магов"],
      weaknesses: ["Контроль отключает", "Зависим от ульта", "Средний лейт"]
    },
    {
      id: "shadow-fiend",
      name: "Shadow Fiend",
      role: "Mid",
      attackType: "Ranged",
      color: "linear-gradient(135deg, #6c5ce7, #2d3436)",
      description:
        "Легендарный мидер, доминирующий линию и уничтожающий врагов за секунды.",
      abilities: [
        {
          icon: "🕳️",
          name: "Shadowraze",
          description: "Три зоны магического взрыва для комбо."
        },
        {
          icon: "🦇",
          name: "Necromastery",
          description: "Копит души и усиливает урон."
        },
        {
          icon: "🌑",
          name: "Presence of the Dark Lord",
          description: "Снижает броню противников вокруг."
        },
        {
          icon: "💀",
          name: "Requiem of Souls",
          description: "Волны страха и урона вокруг героя."
        }
      ],
      strengths: ["Сильный лейн", "Высокий урон", "Снежный ком"],
      weaknesses: ["Без эскейпа", "Зависит от позиции", "Уязвим к гангам"]
    },
    {
      id: "hoodwink",
      name: "Hoodwink",
      role: "Support",
      attackType: "Ranged",
      color: "linear-gradient(135deg, #8fd14f, #ffd166)",
      description:
        "Подвижный саппорт с контролем и мощным снайп-выстрелом.",
      abilities: [
        {
          icon: "🌰",
          name: "Acorn Shot",
          description: "Рикошетный выстрел с замедлением."
        },
        {
          icon: "🕸️",
          name: "Bushwhack",
          description: "Привязывает врагов к дереву и станит."
        },
        {
          icon: "🪵",
          name: "Scurry",
          description: "Скорость, уклонение и проход через деревья."
        },
        {
          icon: "🎯",
          name: "Sharpshooter",
          description: "Заряд мощного выстрела, пробивающего броню."
        }
      ],
      strengths: ["Мобильность", "Контроль", "Сильный харасс"],
      weaknesses: ["Ломкая", "Нужны деревья", "Требует точности"]
    },
    {
      id: "timbersaw",
      name: "Timbersaw",
      role: "Offlane",
      attackType: "Melee",
      color: "linear-gradient(135deg, #ff9f1c, #ff4040)",
      description:
        "Анти-сила танк, который режет врагов и наказывает плотных героев.",
      abilities: [
        {
          icon: "🪚",
          name: "Whirling Death",
          description: "АоЕ-урон и снижение силы."
        },
        {
          icon: "🪓",
          name: "Timber Chain",
          description: "Мобильный рывок через деревья."
        },
        {
          icon: "⚙️",
          name: "Reactive Armor",
          description: "Стакает броню и регенерацию."
        },
        {
          icon: "🧨",
          name: "Chakram",
          description: "Пила с постоянным уроном и замедлением."
        }
      ],
      strengths: ["Сложно убить", "Контроль позиции", "Силен против ближних"],
      weaknesses: ["Слаб против магии", "Зависит от деревьев", "Нужно пространство"]
    },
    {
      id: "lina",
      name: "Lina",
      role: "Mid",
      attackType: "Ranged",
      color: "linear-gradient(135deg, #ff512f, #f09819)",
      description:
        "Взрывной маг с огромным магическим бурстом и сильной пуш линией.",
      abilities: [
        {
          icon: "🔥",
          name: "Dragon Slave",
          description: "Линейный огненный урон."
        },
        {
          icon: "💥",
          name: "Light Strike Array",
          description: "Стан по области с задержкой."
        },
        {
          icon: "⚡",
          name: "Fiery Soul",
          description: "Скорость атак и бега за каждое заклинание."
        },
        {
          icon: "☄️",
          name: "Laguna Blade",
          description: "Мощный магический ульт по одной цели."
        }
      ],
      strengths: ["Мощный burst", "Сильный лейн", "Скорость"],
      weaknesses: ["Хрупкая", "Нужен тайминг", "Боится инициации"]
    },
    {
      id: "drow-ranger",
      name: "Drow Ranger",
      role: "Carry",
      attackType: "Ranged",
      color: "linear-gradient(135deg, #4b79a1, #283e51)",
      description:
        "Стрелок, который усиливает команду и превращает тимфайты в шквал стрел.",
      abilities: [
        {
          icon: "🏹",
          name: "Frost Arrows",
          description: "Замедляет и контролирует дистанцию."
        },
        {
          icon: "🔇",
          name: "Gust",
          description: "Отбрасывание и сайленс противников."
        },
        {
          icon: "🎯",
          name: "Multishot",
          description: "Залп стрел, ослабляющий героев."
        },
        {
          icon: "🧊",
          name: "Marksmanship",
          description: "Бонусная ловкость и пробивная атака."
        }
      ],
      strengths: ["Сильный лейт", "Аура ловкости", "Контроль дистанции"],
      weaknesses: ["Уязвима к прыжкам", "Нужна защита", "Слабый мидгейм"]
    },
    {
      id: "earthshaker",
      name: "Earthshaker",
      role: "Support",
      attackType: "Melee",
      color: "linear-gradient(135deg, #a17c59, #4a2c2a)",
      description:
        "Классический инициатор с мощным контролем и разрушительным ультом.",
      abilities: [
        {
          icon: "🌋",
          name: "Fissure",
          description: "Создает барьер и оглушает противников."
        },
        {
          icon: "🪨",
          name: "Enchant Totem",
          description: "Усиление следующей атаки и прыжок."
        },
        {
          icon: "🌍",
          name: "Aftershock",
          description: "Дополнительный стан при касте."
        },
        {
          icon: "💢",
          name: "Echo Slam",
          description: "Взрыв по области, сильнее при скоплении врагов."
        }
      ],
      strengths: ["Инициатор", "Мощный тимфайт", "Контроль"]
    },
    {
      id: "bristleback",
      name: "Bristleback",
      role: "Offlane",
      attackType: "Melee",
      color: "linear-gradient(135deg, #c850c0, #4158d0)",
      description:
        "Стойкий фронтлайн, поглощающий урон и отвечающий шквалом шипов.",
      abilities: [
        {
          icon: "🧨",
          name: "Viscous Nasal Goo",
          description: "Замедляет и снижает броню."
        },
        {
          icon: "🌵",
          name: "Quill Spray",
          description: "Шквал шипов, усиливающийся по цели."
        },
        {
          icon: "🧱",
          name: "Bristleback",
          description: "Пассивная защита спины."
        },
        {
          icon: "🐗",
          name: "Warpath",
          description: "Увеличение урона и скорости при касте."
        }
      ],
      strengths: ["Танк", "Надежный фронт", "Сильный лейн"],
      weaknesses: ["Боится break", "Контроль маны", "Нужен темп"]
    }
  ],
  items: [
    {
      id: "magic-wand",
      name: "Magic Wand",
      cost: 450,
      category: "Early game",
      icon: "✨",
      short: "Быстрый хил и мана в затяжных драках.",
      description: "Накопление зарядов и моментальный реген в ключевые моменты."
    },
    {
      id: "phase-boots",
      name: "Phase Boots",
      cost: 1500,
      category: "Early game",
      icon: "👟",
      short: "Скорость и урон, чтобы доминировать линию.",
      description: "Активируемая фаза для прохода сквозь юниты и буст урона."
    },
    {
      id: "dragon-lance",
      name: "Dragon Lance",
      cost: 1900,
      category: "Mid game",
      icon: "🗡️",
      short: "Дальность и статы для агрессивного керри.",
      description: "Увеличивает радиус атаки и даёт выживаемость."
    },
    {
      id: "blink-dagger",
      name: "Blink Dagger",
      cost: 2250,
      category: "Mid game",
      icon: "🌀",
      short: "Ключ к инициации и спасению.",
      description: "Мгновенный рывок на дистанцию без урона."
    },
    {
      id: "black-king-bar",
      name: "Black King Bar",
      cost: 4050,
      category: "Late game",
      icon: "👑",
      short: "Бессмертие от контроля и магии.",
      description: "Дает иммунитет к большинству заклинаний на время."
    },
    {
      id: "scythe-of-vyse",
      name: "Scythe of Vyse",
      cost: 5675,
      category: "Late game",
      icon: "🐍",
      short: "Надежный контроль для решающих тимфайтов.",
      description: "Превращает цель в беззащитную на несколько секунд."
    }
  ],
  counterpicks: {
    "Phantom Assassin": {
      strong: ["Shadow Fiend", "Drow Ranger", "Lina"],
      weak: ["Timbersaw", "Bristleback", "Earthshaker"]
    },
    "Storm Spirit": {
      strong: ["Juggernaut", "Drow Ranger", "Hoodwink"],
      weak: ["Shadow Fiend", "Bristleback", "Earthshaker"]
    },
    "Crystal Maiden": {
      strong: ["Mars", "Bristleback", "Juggernaut"],
      weak: ["Storm Spirit", "Phantom Assassin", "Hoodwink"]
    },
    "Mars": {
      strong: ["Drow Ranger", "Shadow Fiend", "Lina"],
      weak: ["Timbersaw", "Juggernaut", "Storm Spirit"]
    },
    "Juggernaut": {
      strong: ["Crystal Maiden", "Hoodwink", "Lina"],
      weak: ["Bristleback", "Mars", "Earthshaker"]
    },
    "Shadow Fiend": {
      strong: ["Storm Spirit", "Hoodwink", "Crystal Maiden"],
      weak: ["Phantom Assassin", "Mars", "Earthshaker"]
    },
    "Hoodwink": {
      strong: ["Crystal Maiden", "Drow Ranger", "Lina"],
      weak: ["Storm Spirit", "Mars", "Timbersaw"]
    },
    "Timbersaw": {
      strong: ["Bristleback", "Mars", "Juggernaut"],
      weak: ["Drow Ranger", "Storm Spirit", "Shadow Fiend"]
    },
    "Lina": {
      strong: ["Timbersaw", "Bristleback", "Mars"],
      weak: ["Phantom Assassin", "Storm Spirit", "Juggernaut"]
    },
    "Drow Ranger": {
      strong: ["Timbersaw", "Bristleback", "Mars"],
      weak: ["Storm Spirit", "Phantom Assassin", "Earthshaker"]
    },
    "Earthshaker": {
      strong: ["Drow Ranger", "Phantom Assassin", "Shadow Fiend"],
      weak: ["Hoodwink", "Lina", "Storm Spirit"]
    },
    "Bristleback": {
      strong: ["Juggernaut", "Lina", "Shadow Fiend"],
      weak: ["Timbersaw", "Drow Ranger", "Crystal Maiden"]
    }
  },
  topHeroes: [
    {
      title: "Top Carry",
      rankings: [
        { name: "Phantom Assassin", rating: "S" },
        { name: "Drow Ranger", rating: "A+" },
        { name: "Juggernaut", rating: "A" }
      ]
    },
    {
      title: "Top Mid",
      rankings: [
        { name: "Storm Spirit", rating: "S" },
        { name: "Shadow Fiend", rating: "A+" },
        { name: "Lina", rating: "A" }
      ]
    },
    {
      title: "Top Support",
      rankings: [
        { name: "Crystal Maiden", rating: "S" },
        { name: "Hoodwink", rating: "A+" },
        { name: "Earthshaker", rating: "A" }
      ]
    }
  ],
  builds: [
    {
      name: "Пуш-тайминг",
      description: "Фокус на ранний контроль линий и быстрый заход на Рошана.",
      heroes: ["Juggernaut", "Drow Ranger", "Crystal Maiden"],
      items: ["Phase Boots", "Dragon Lance", "Black King Bar"]
    },
    {
      name: "Тимфайт-комбо",
      description: "Ставка на массовый контроль и взрывной урон.",
      heroes: ["Mars", "Earthshaker", "Lina"],
      items: ["Blink Dagger", "Black King Bar", "Scythe of Vyse"]
    },
    {
      name: "Соло-киллы",
      description: "Мобильные убийцы, которые ищут 1х1 и разрывают карту.",
      heroes: ["Phantom Assassin", "Storm Spirit", "Hoodwink"],
      items: ["Phase Boots", "Blink Dagger", "Black King Bar"]
    }
  ]
};

window.DOTA_DATA = DOTA_DATA;
