const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

// بوت ديسكورد
let client;
let isReady = false;

// تعريف أمر السلاش كوماند
const searchCommand = new SlashCommandBuilder()
  .setName('بحث')
  .setDescription('ابحث عن سكربتات روبلوكس')
  .addStringOption(option =>
    option.setName('كلمة')
      .setDescription('الكلمة المراد البحث عنها')
      .setRequired(true)
  );

async function registerCommands(token, clientId) {
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: [searchCommand.toJSON()] }
    );
  } catch (err) {
    console.error('Error registering slash commands:', err);
  }
}

function searchScripts(query) {
  // مثال بحث بسيط (تقدر تعدله تربطه بموقع أو API حقيقي)
  const scripts = [
    { name: "Script 1", desc: "سكربت تهكير فلوس", url: "https://example.com/script1" },
    { name: "Script 2", desc: "سكربت طيران", url: "https://example.com/script2" },
    { name: "Script 3", desc: "سكربت فتح كل شيء", url: "https://example.com/script3" },
  ];
  return scripts.filter(s =>
    s.name.includes(query) || s.desc.includes(query)
  );
}

async function startBot(token) {
  if (client) return;

  client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.once('ready', () => {
    isReady = true;
    console.log('Bot is ready!');
    registerCommands(token, client.user.id);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'بحث') {
      const word = interaction.options.getString('كلمة');
      const results = searchScripts(word);
      if (results.length === 0) {
        await interaction.reply('لم يتم العثور على أي سكربتات.');
      } else {
        let reply = results.map(s => `[${s.name}](${s.url}): ${s.desc}`).join('\n');
        await interaction.reply(reply);
      }
    }
  });

  await client.login(token);
}

async function stopBot() {
  if (client) {
    await client.destroy();
    client = null;
    isReady = false;
  }
}

module.exports = {
  startBot,
  stopBot,
  isReady: () => isReady
};