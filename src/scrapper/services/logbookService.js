const Fetcher = require("./../helpers/fetcher.js");
const { HttpMethod } = require("./../utils/constant");
const FormData = require("form-data");

async function getLogbookHeader(month, strm) {
  const options = {
    method: HttpMethod.GET,
  };

  try {
    const { data } = await Fetcher.fetch("/LogBook/GetMonths", options);

    if (Array.isArray(data) && data.length > 0) {
      return data
        .filter((x) => x.monthInt == month && x.strm == strm.toString())
        .map((x) => {
          return { headerId: x.logBookHeaderID, month: x.month, strm: x.strm };
        })
        .find((x) => x);
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getLogbooks(headerId) {
  const param = new FormData();
  param.append("logBookHeaderID", headerId);

  const options = {
    method: HttpMethod.POST,
    body: param,
  };

  try {
    const { data } = await Fetcher.fetch("/LogBook/GetLogBook", options);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = {
  getLogbookHeader,
  getLogbooks,
};
