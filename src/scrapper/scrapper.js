const { format } = require("./helpers/formatter.js");
const LogbookService = require("./services/logbookService.js");

async function scrap(month, term) {
  try {
    const resp = await LogbookService.getLogbookHeader(month, term);
    if (!resp) {
      return {
        success: false,
        data: null,
        message: `Logbook not found for month ${month} and term ${term}`,
      };
    }

    const headerId = resp.headerId;
    if (headerId) {
      const logbooks = await LogbookService.getLogbooks(headerId);
      const finalText = format(logbooks);
      return {
        success: true,
        data: finalText,
        message: "Success",
      };
    } else {
      return {
        success: false,
        data: null,
        message: "Error: Logbook header not found.",
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: `Error: ${error}`,
    };
  }
}

module.exports = {
  scrap,
};
