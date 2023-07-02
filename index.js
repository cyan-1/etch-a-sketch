const { Client, Intents, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { token } = require("./config.json");
const Canvas = require("canvas");
const { readFile } = require("fs/promises");

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.once('ready', () => {
   console.log(`${bot.user.username} is now online`);
});
let brushX = 50;
let brushY = 50;
let user
bot.on('interactionCreate', async interaction => {

   if (interaction.isCommand()) {

      let { commandName } = interaction;
      switch (commandName) {
         case "ping":
            interaction.reply("pong or something i work i guess i dont know");
            break;
         case "draw":
            createCanvas(interaction);
            user = interaction.user.id;
            break;
      }

   } else if (interaction.isButton()) {
      let button = interaction;
      // console.log(button);
      if (interaction.user.id == user) {
         switch (button.customId) {
            case "Left":
               //interaction.reply(`${interaction.user.username} pressed left button`);
               if (brushX <= 0) {
                  brushX = 0;
               } else brushX = brushX - 20;
               updateCanvas(interaction)
            break;
            case "Right":
               //interaction.reply(`${interaction.user.username} pressed right button`);
               if (brushX >= 1870) {
                  brushX = 1870;
               } else brushX = brushX + 20;
               updateCanvas(interaction)
            break;
            case "Up":

               //interaction.reply(`${interaction.user.username} pressed up button`);
               if (brushY <= 0) {
                  brushY = 0;
               } else brushY = brushY - 20;
               updateCanvas(interaction)
            break;
            case "Down":

               //interaction.reply(`${interaction.user.username} pressed down button`);
               if (brushY >= 1080) {
                  brushY = 1080;
               } else brushY = brushY + 20;
               updateCanvas(interaction)
            break;
         }
      } else {
         return
      };
   }
});

const playerCanvas = Canvas.createCanvas(20, 20);
const playerContext = playerCanvas.getContext('2d');

// Draw the player rectangle on the player canvas
playerContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
playerContext.fillRect(0, 0, 20, 20);

function createCanvas(interaction) {
   const canvas = Canvas.createCanvas(1920, 1080);
   const context = canvas.getContext('2d');

   // Draw the background
   context.fillStyle = '#7f7f7f';
   context.fillRect(0, 0, 1920, 1080);

   // Draw the player canvas onto the main canvas
   context.drawImage(playerCanvas, brushX, brushY);

   const image = new MessageAttachment(canvas.toBuffer('image/png'), 'image.png');

   const movementButtons = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('Left').setLabel('Left').setStyle('PRIMARY'),
      new MessageButton().setCustomId('Right').setLabel('Right').setStyle('PRIMARY'),
      new MessageButton().setCustomId('Up').setLabel('Up').setStyle('PRIMARY'),
      new MessageButton().setCustomId('Down').setLabel('Down').setStyle('PRIMARY')
   );

   interaction.reply({ files: [image], components: [movementButtons] });
}

// Define the buffer canvas and context
const bufferCanvas = Canvas.createCanvas(1920, 1080);
const bufferContext = bufferCanvas.getContext('2d');

function updateCanvas(interaction) {

   if (interaction.user.id == user) {

      // Draw the player rectangle on the buffer canvas at the new position
      bufferContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
      bufferContext.fillRect(brushX, brushY, 20, 20);

      const canvas = Canvas.createCanvas(1920, 1080);
      const context = canvas.getContext('2d');

      context.fillStyle = '#7f7f7f';
      context.fillRect(0, 0, 1920, 1080);

      context.drawImage(bufferCanvas, 0, 0);

      // Draw the current player rectangle on the main canvas
      context.fillStyle = '#000000';
      context.fillRect(brushX, brushY, 20, 20);

      const image = new MessageAttachment(canvas.toBuffer('image/png'), 'image.png');

      interaction.update({ files: [image] });
   }
}

bot.login(token);