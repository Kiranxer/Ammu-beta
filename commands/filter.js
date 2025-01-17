const { addFilter, getFilter } = require('../helpers/database/filter');

module.exports = {
  command: 'filter',
  info: 'Adds filter to the chat.',
  private: true,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter the filter match and response!*\n*Example:*\n*- ' + (process.env?.PREFIX || '/') + 'filter \"hey\" \"hello\"' });
    let [match, response] = text.match(/"([^"]*)"/g);
    if (!match || !response) return await msg.reply({ text: '*Invalid format, enter the filter match and response!*\n*Example:*\n*- ' + (process.env?.PREFIX || '/') + 'filter \"hey\" \"hello\"' });
    await addFilter(msg.chat, match.replace(/"/g, ''), response.replace(/"/g, ''));
    return await msg.reply({ text: '*Successfully set filter!*\n```' + match + ' - ' + response + '```' });
  },
  event: async (sock, msg, text) => {
    let filters = await getFilter(msg.chat);
    filters.forEach(async (filter) => {
      let regex = new RegExp(filter.match, 'i');
      if (regex.test(msg.text) &&
        filter.chat == msg.chat &&
        !msg.fromBot) await msg.reply({ text: filter.response });
    });
  }
};
