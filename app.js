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
      tiles: 12,
    },
    {
      level: "medium",
      tiles: 16,
    },
    {
      level: "hard",
      tiles: 20,
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

    choose.innerHTML = "Moves Used: 0";

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
      cardsContainer.appendChild(card);
      card.style.height = `${card.offsetWidth}px`;
    }

    const backToMenu = document.createElement("div");
    backToMenu.className = "back-to-menu btn";
    backToMenu.innerHTML = "back";
    backToMenu.style.display = "flex";
    gameplayContainer.appendChild(backToMenu);

    getMemes();

    // -------------- gameplay loop ---------------

    const cards = [...cardsContainer.querySelectorAll("*")];

    let cardCounter = 0;
    let selectedCard = null;
    let movesUsed = 0;

    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (cardCounter === 0) {
          selectedCard = card;
          card.querySelector(".overlay-image").style.visibility = "hidden";
          cardCounter++;
        } else if (cardCounter === 1 && card !== selectedCard) {
          card.querySelector(".overlay-image").style.visibility = "hidden";
          cardCounter++
          if (
            card.querySelector("img").src ===
            selectedCard.querySelector("img").src
          ) {
            console.log("CARDS MATCH");
            setTimeout(() => {
              selectedCard.style.visibility = "hidden";
              card.style.visibility = "hidden";
              cardCounter = 0;
            }, 700);
          } else {
            console.log("CARDS DON'T MATCH");
            setTimeout(() => {
              card.querySelector(".overlay-image").style.visibility = "visible";
              selectedCard.querySelector(".overlay-image").style.visibility =
                "visible";
                cardCounter = 0;
            }, 700);
          }
          movesUsed ++;
          choose.innerHTML = "Moves Used: " + movesUsed;

        }
      });
    });

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
    let memeArray = [];
    for (let i = 0; i < cards.length / 2; i++) {
      let randomMeme = memes[Math.floor(Math.random() * memes.length)].url;
      memeArray.push(randomMeme);
      memeArray.push(randomMeme);
    }

    memeArray = shuffleArray(memeArray);

    // Clear the previous meme (if any) and append the new one
    [...cards].forEach((card, index) => {
      const imgElement = document.createElement("img");
      const imgOverlay = document.createElement("img");

      imgOverlay.src =
        "https://www.clarelewisillustration.co.uk/wp-content/uploads/Repeating-Pattern-Illustrator-3.jpg";
      imgOverlay.className = "overlay-image";
      card.appendChild(imgElement);
      card.appendChild(imgOverlay);
      setTimeout(() => {
        imgElement.src = memeArray[index];
      }, 500);
    });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements at i and j
    }
    return array;
  }
});
