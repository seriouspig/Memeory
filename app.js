document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing...");
  let gameState = "menu";

  const container = document.querySelector(".container");

  const title = document.createElement("div");
  // Set attributes for the title)
  title.id = "title";
  title.className = "title";
  title.innerHTML = "Memeory";

  const choose = document.createElement("div");
  // Set attributes for the title)
  choose.id = "choose";
  choose.className = "choose";
  choose.innerHTML = "Choose your level:";

  // Append the div to the body of the document
  container.appendChild(title);
  container.appendChild(choose);

  //   ----------------------------------------------------------------------------------

  // create level selection buttons
  const levels = [
    {
      level: "easy",
      tiles: 9,
    },
    {
      level: "medium",
      tiles: 12,
    },
    {
      level: "hard",
      tiles: 15,
    },
  ];

  const startMenu = () => {
    const levelSelect = document.createElement("div");
    // Set attributes for the title)
    levelSelect.id = "level-select";
    levelSelect.className = "level-select";
    container.appendChild(levelSelect);

    choose.innerHTML = "Choose your level:";

    levels.forEach((level) => {
      let levelButton = document.createElement("div");
      levelButton.className = "level-button btn";
      levelButton.innerHTML = level.level;
      levelSelect.append(levelButton);
    });

    const levelButtons = [...levelSelect.querySelectorAll("*")];
    console.log(levelButtons);

    levelButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        gameState = "gameplay";
        levelSelect.remove();
        startGame(e.target.innerHTML, levels);
      });
    });
  };

  startMenu();

  // ---------------------------- GAMEPLAY -----------------------------

  const startGame = (levelName, levels) => {
    const gameplayContainer = document.createElement("div");
    // Set attributes for the title)
    gameplayContainer.id = "gameplay-container";
    gameplayContainer.className = "gameplay-container";
    container.appendChild(gameplayContainer);
    gameplayContainer.style.display = "flex";

    const cardsContainer = document.createElement("div");
    // Set attributes for the title)
    cardsContainer.id = "cards-container";
    cardsContainer.className = "cards-container";
    gameplayContainer.appendChild(cardsContainer);
    cardsContainer.style.display = "flex";

    choose.innerHTML = "Discover all the memes";

    // Find the level object that matches the provided levelName
    const level = levels.find((l) => l.level === levelName);
    let numberOfTiles;
    // Check if a matching level was found
    if (level) {
      numberOfTiles = level.tiles;
    } else {
      // Return a default value or handle the case where the level is not found
      return "Level not found";
    }

    for (let i = 0; i < numberOfTiles; i++) {
      let card = document.createElement("div");
      card.className = "card";
      card.id = "card-" + (i + 1);
      console.log(card.innerHTML);
      cardsContainer.appendChild(card);
      card.style.height = `${card.offsetWidth}px`;
    }

    const backToMenu = document.createElement("div");
    backToMenu.className = "back-to-menu btn";
    backToMenu.innerHTML = "back";
    backToMenu.style.display = "flex";
    gameplayContainer.appendChild(backToMenu);

    getMemes();

    backToMenu.addEventListener("click", () => {
      gameplayContainer.remove();
      backToMenu.remove();
      startMenu();
    });
  };

  //   ----------------------------- MEME API ------------------------------------

  const getMemes = () => {
    fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((data) => {
        const memes = data.data.memes;
        displayMeme(memes);
      })
      .catch((error) => {
        console.error("Error fetching meme:", error);
      });
  };

  function displayMeme(memes) {
    // Create an img element
    
    const cards = document.querySelectorAll(".card");

    // Set the src attribute to the meme URL
    

    // Clear the previous meme (if any) and append the new one
    [...cards].forEach((card) => {
        console.log(card)
        const imgElement = document.createElement("img");
        imgElement.src = memes[Math.floor(Math.random() * memes.length)].url;
        card.appendChild(imgElement);
    })
    
  }
});
