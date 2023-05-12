const btnScrap = document.querySelector("#btn-scrap");
const btnPrompt = document.querySelector("#btn-prompt");
const monthsSelect = document.getElementById("months");
const termsSelect = document.getElementById("terms");
const unavailableMsg = document.getElementById("unavailable-msg");
const [currentTab] = await chrome.tabs.query({
  active: true,
  currentWindow: true,
});

const setUIBasedOnURL = async () => {
  await chrome.tabs.sendMessage(
    currentTab.id,
    { action: "GET_URL" },
    function (resp) {
      if (resp && resp.includes("chat.openai.com")) {
        btnScrap.remove();
        monthsSelect.remove();
        termsSelect.remove();
      } else if (
        resp &&
        resp.includes("activity-enrichment.apps.binus.ac.id")
      ) {
        btnPrompt.remove();
      } else {
        btnScrap.remove();
        btnPrompt.remove();
        monthsSelect.remove();
        termsSelect.remove();
        unavailableMsg.style.display = "block";
      }
    }
  );
};

const toggleScrapBtn = (isFetching) => {
  btnScrap.textContent = isFetching ? "Scrapping..." : "SCRAP 🚀";
  btnScrap.disabled = isFetching;
  btnScrap.style.backgroundColor = isFetching ? "#545567" : "dodgerblue";
  monthsSelect.disabled = isFetching;
  termsSelect.disabled = isFetching;
};

const togglePromptBtn = (isFetching) => {
  btnPrompt.textContent = isFetching ? "Prompting..." : "PROMPT 🪄";
  btnPrompt.disabled = isFetching;
  btnPrompt.style.backgroundColor = isFetching ? "#545567" : "dodgerblue";
};

const sendScrapEvent = async () => {
  await chrome.tabs.sendMessage(
    currentTab.id,
    {
      action: "SCRAP",
      payload: {
        month: +monthsSelect.value,
        term: +termsSelect.value,
      },
    },
    (resp) => {
      console.log(resp);
      toggleScrapBtn(false);
    }
  );
};

const sendPromptEvent = async () => {
  await chrome.tabs.sendMessage(currentTab.id, {
    action: "PROMPT",
  });
  togglePromptBtn(false);
};

const addListeners = () => {
  btnScrap.addEventListener("click", async () => {
    try {
      toggleScrapBtn(true);
      await sendScrapEvent();
    } catch (error) {
      toggleScrapBtn(false);
      console.error(`Error: ${error}`);
    }
  });

  btnPrompt.addEventListener("click", async () => {
    togglePromptBtn(true);

    try {
      await sendPromptEvent();
    } catch (error) {
      togglePromptBtn(false);
      console.error(error);
    }
  });
};

await setUIBasedOnURL();
addListeners();
