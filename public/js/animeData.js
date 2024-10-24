const animeCards = document.querySelectorAll(".anime-card");
const addToCollection = document.querySelectorAll(".add-to-collection");
const dialog = document.querySelector("dialog");
const dialogCloseBtn = document.getElementById("close-dialog");
const dialogOkBtn = document.getElementById("dialog-ok");
const collectionNameElem = dialog.querySelector("#collection-name");
const collectionDescElem = dialog.querySelector("#collection-desc");
const collection = {
  collectionName: "",
  collectionDescription: "",
  canPost: false,
};
const loadingElem = document.createElement("h1");
const animeContainer = document.querySelector(".anime-container");

const waitForDialogClose = () => {
  return new Promise((resolve) => {
    collection.canPost = true;
    dialog.addEventListener("close", resolve, { once: true });
  });
};

dialogCloseBtn.addEventListener("click", () => {
  collection.canPost = false;
  dialog.close();
});

dialogOkBtn.addEventListener("click", () => {
  collection.collectionName = collectionNameElem.value;
  collection.collectionDescription = collectionDescElem.value;
  dialog.close();

  animeContainer.classList.add("non-clickable");
  loadingElem.textContent = "Wait, adding to collection";
  loadingElem.classList.add("window-centered");
  document.body.prepend(loadingElem);
});

animeCards.forEach((card) => {
  card.addEventListener("click", () => {
    const synopsis = card.querySelector(".anime-synopsis");
    const isActive = synopsis.classList.contains("active");

    document
      .querySelectorAll(".anime-synopsis")
      .forEach((syn) => syn.classList.remove("active"));

    if (!isActive) {
      synopsis.classList.add("active");
    }
  });

  card.addEventListener("mouseleave", () => {
    const synopsis = card.querySelector(".anime-synopsis");
    synopsis.classList.remove("active");
  });
});

addToCollection.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    dialog.showModal();

    await waitForDialogClose();

    if (collection.collectionName.trim().length >= 3 && collection.canPost) {
      postData(e, collection)
        .then(async (res) => {
          const response = await res.json();
          console.log(response);
          loadingElem.textContent = "Added successfully";
          setTimeout(() => {
            animeContainer.classList.remove("non-clickable");
            loadingElem.remove();
          }, 1500);
        })
        .catch((error) => {
          console.error(error.message);
          loadingElem.textContent = "Unable add to collection";
          setTimeout(() => {
            animeContainer.classList.remove("non-clickable");
            loadingElem.remove();
          }, 1500);
        });
    } else {
      loadingElem.textContent = "Unable add to collection";
      setTimeout(() => {
        animeContainer.classList.remove("non-clickable");
        loadingElem.remove();
      }, 1500);
    }
  });
});

async function postData(e, collection) {
  const url = new URL(window.location);
  const postURL = `${url.protocol}//${url.hostname}:${url.port}/collection/add`;
  const animeInfo = {
    ...JSON.parse(e.target.dataset.animeinfo),
    ...collection,
  };

  try {
    const res = await fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(animeInfo),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! Status: ${res.status} - ${errorText}`);
    }
    return res;
  } catch (error) {
    console.error("Error:", error);
  }
}
