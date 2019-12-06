const { NlpManager } = require('node-nlp');
const config = require('./nlp-config.json');

const languages = Object.keys(config);
const manager = new NlpManager({ languages });

languages.forEach((lang) => {
  const types = Object.keys(config[lang]);
  types.forEach((tp) => {
    const { messages, answers } = config[lang][tp];
    messages.forEach((msg) => {
      manager.addDocument(lang, msg, tp);
    });

    answers.forEach((ans) => {
      manager.addAnswer(lang, tp, ans);
    });
  });
});

module.exports = manager;

// Train and save the model.
(async () => {
  await manager.train();
  manager.save();
  const response = await manager.process('en', 'I should go now');
  console.log(response.answer);
})();