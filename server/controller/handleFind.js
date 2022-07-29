const returnedData = (msg, data) => ({ message: msg, data: data });

const handleFind = (msg, res, model, findMethod, query, dataChild) => {
  try {
    const searchQuery = query ? query : {};

    model[findMethod](searchQuery, (queryErr, foundData) => {
      const noDataMsg = "No data found!";
      let message;
      if (foundData) {
        switch (typeof foundData) {
          case "object":
            message = foundData.length === 0 ? noDataMsg : msg;
          default:
            message = !foundData ? noDataMsg : msg;
        }
      } else {
        message = noDataMsg;
      }

      if (!queryErr) {
        if (foundData && dataChild) {
          //foundData[0] is the data wanted instead of [data wanted]
          res.send(returnedData(message, foundData[dataChild]));
        } else {
          res.send(returnedData(message, foundData));
        }
      } else {
        res.send(queryErr);
      }
    });
  } catch (err) {
    res.send(err);
    console.log(err);
  }
};

module.exports = handleFind;
