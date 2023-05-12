const { scrap } = require("./scrapper/scrapper");

class LogbookScrapper {
  constructor() {
    this.handleRequest();
  }

  handleRequest() {
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "SCRAP") {
          this.scrapLogbookToClipboard(request.payload).then(sendResponse);
          return true; // indicates the sendResponse is returned asynchronously
        }

        if (request.action == "PROMPT") {
          this.prompToChatGPT(request.payload);
        }

        if (request.action == "GET_URL") {
          sendResponse(window.location.href);
        }
      });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }

  async scrapLogbookToClipboard({ month, term }) {
    try {
      const resp = await scrap(month, term);
      if (resp.success) {
        // set text to chrome local storage
        chrome.storage.local.set({ data: resp.data }, function () {
          console.log("Data saved to local storage");
        });

        // also copy the text to clipboard
        navigator.clipboard.writeText(resp.data);
        alert("Copied to clipboard !");
      } else {
        alert(resp.message);
      }

      return resp;
    } catch (error) {
      alert(`Error: ${error}`);
      return { success: false, data: null, message: error };
    }
  }

  prompToChatGPT() {
    try {
      // Get text from chrome local storage
      chrome.storage.local.get("data", function (text) {
        // Set prompt message to textarea
        const textArea = document.querySelector("textarea");
        textArea.value = text.data;

        // Send prompt
        document.querySelector("textarea~button").disabled = false;
        document.querySelector("textarea~button").click();
      });
    } catch (error) {
      alert(error);
    }
  }
}

new LogbookScrapper();
