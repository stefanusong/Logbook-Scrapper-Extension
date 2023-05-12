const format = (logbooks) => {
  let text = `
Tolong rangkum activity log saya sebulan ini,
Tolong kategorikan per minggu dalam bulan ini dalam bentuk paragraf per minggu dan abaikan yang off.
`;

  logbooks.map(
    (x) =>
      (text += `
Date: ${x["date"]}
Activity: ${x["activity"]}
Description: ${x["description"]}
`)
  );
  return text;
};

module.exports = {
  format,
};
