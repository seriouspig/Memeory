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
    let cardsLeft = cards.length;

    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (cardCounter === 0) {
          selectedCard = card;
          card.querySelector(".overlay-image").style.visibility = "hidden";
          cardCounter++;
        } else if (cardCounter === 1 && card !== selectedCard) {
          card.querySelector(".overlay-image").style.visibility = "hidden";
          cardCounter++;
          if (
            card.querySelector("img").src ===
            selectedCard.querySelector("img").src
          ) {
            console.log("CARDS MATCH");
            cardsLeft -= 2;
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
          movesUsed++;
          choose.innerHTML = "Moves Used: " + movesUsed;
          console.log(cardsLeft);
          // Check if all cards are removed and if so call gameOver()
          if (cardsLeft === 0) {
            cardsContainer.remove();
            gameOver(numberOfTiles, movesUsed, gameplayContainer);
          }
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

  function gameOver(numberOfTiles, movesUsed, gameplayContainer) {
    console.log("Game Over");
    const congratulations = document.createElement("div");
    congratulations.className = "congratulations";
    gameplayContainer.insertBefore(
      congratulations,
      gameplayContainer.firstChild
    );

    const animals = [
      [
        {
          animal: "a dolphin",
          url: "https://pbs.twimg.com/profile_images/603061085571190784/rOwJSIIi_400x400.jpg",
        },
        {
          animal: "an elephant",
          url: "https://i.ytimg.com/vi/SNggmeilXDQ/mqdefault.jpg",
        },
      ],
      [
        {
          animal: "a turtle",
          url: "https://media.tenor.com/D6WRzzdOHyoAAAAd/like-my-smile-turtle.gif",
        },
        {
          animal: "a squirrel",
          url: "https://media.istockphoto.com/id/104096920/photo/squirrel-holding-nuts-on-grassy-field.jpg?s=612x612&w=0&k=20&c=CkFiiKgCKmixgex4MhDjvcMYSHePrSf5MvD7LOgE2Ak=",
        },
      ],
      [
        {
          animal: "a sloth",
          url: "https://t3.ftcdn.net/jpg/02/87/25/08/360_F_287250814_wh4XAUalwgqlnLvCWEdTLf4C3qBPjeHW.jpg",
        },
        {
          animal: "a chimpanzee",
          url: "https://cdn.pixabay.com/photo/2018/09/25/21/32/monkey-3703230_1280.jpg",
        },
      ],
    ];

    // calculate result

    let result = movesUsed / numberOfTiles;
    console.log(result);

    let animalCategory;
    let textResult;

    if (result <= 1) {
      console.log("RESULT: GOOD");
      textResult = "pretty good";
      animalCategory = 0;
    } else if (result > 1 && result < 1.2) {
      console.log("RESULT: MEDIUM");
      textResult = "pretty average";
      animalCategory = 1;
    } else {
      console.log("RESULT: BAD");
      textResult = "pretty bad";
      animalCategory = 2;
    }

    console.log(animals[animalCategory]);

    const resultText = document.createElement("div");
    resultText.className = "result-text";
    resultText.innerHTML = `You uncovered ${numberOfTiles} cards in ${movesUsed} moves. That is ${textResult}. You have a memory of ${
      animals[animalCategory][
        Math.floor(Math.random() * animals[animalCategory].length)
      ].animal
    }`;
    console.log(resultText.innerHTML);

    const resultImg = document.createElement("img");
    resultImg.className = "result-img";
    resultImg.src =
      animals[animalCategory][
        Math.floor(Math.random() * animals[animalCategory].length)
      ].url;

    congratulations.appendChild(resultImg);
    congratulations.appendChild(resultText);
  }
});
