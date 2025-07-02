const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bot = require('./bot');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

let botToken = '';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/start', async (req, res) => {
  if (bot.isReady()) return res.send('البوت يعمل بالفعل!');
  botToken = req.body.token;
  try {
    await bot.startBot(botToken);
    res.send('تم تشغيل البوت بنجاح!');
  } catch (err) {
    res.send('خطأ في تشغيل البوت: ' + err.message);
  }
});

app.post('/stop', async (req, res) => {
  await bot.stopBot();
  res.send('تم إيقاف البوت!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});