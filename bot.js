const { Client, Intents, Constants, MessageEmbed, MessageAttachment } = require('discord.js');
const dotenv = require('dotenv');
const fs = require("fs");
const logouri = 'https://lh3.googleusercontent.com/QXaAXCfdQthkf5ykh1t5-SVb8uKS9vjMKoQ-GRS714JX6LVoIhq5RufyP-IAv1rKBIoTHrnmUtn2W8Pc_1KlHOIIATXzO6_7C5kDng=s0';

dotenv.config();


const generateEmbed = (imageuri, uri, interaction, assetNumber) => {
    return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Flower #${assetNumber}`)
    .setURL(uri)
    .setAuthor('On Chain Collection', logouri, 'https://occ.xyz')
    .setDescription(`<@!${interaction.member.id}>`)
    .setThumbnail(logouri)
    // .addFields(...attributes.map(x => { return {name: x['trait_type'], value:x['value'], inline:true}}))
    .setImage(imageuri)
    .setTimestamp()
    .setFooter('OCC Flower Bot', logouri);
};


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.on('ready', () => {
    
    console.log('Ready!');
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    let commands;
    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands
    }
    
    commands?.create({
        name: 'flower',
        description: 'Show the flower Image',
        options: [
            {
                name: 'flowernumber',
                description: 'Flower Number',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.INTEGER
            }
        ]
    })
    
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }
    const { commandName, options } = interaction
    
    if (commandName === "flower") {
        let imageuri;
        const assetNumber = options.getInteger('flowernumber');
        if (assetNumber && assetNumber > 0 && assetNumber < 4097) {
            let imageobj = JSON.parse(fs.readFileSync('images.json', 'utf-8'));
            if (imageobj['' + assetNumber]['gif'] !== null) {
                imageuri = 'https://ipfs.io/ipfs/' + imageobj['' + assetNumber]['gif'];
            } else {
                imageuri = 'https://ipfs.io/ipfs/' + imageobj['' + assetNumber]['png'];
            }
            
            
            const flowerEmbed = generateEmbed(imageuri, imageuri, interaction, assetNumber);
            try {
                interaction.channel.send({
                    embeds: [flowerEmbed]
                }) && 
                interaction.reply({
                    content: `ok`,
                    hidden: true
                }) &&
                interaction.deleteReply();
            } catch(e) {
                interaction.reply({
                    content: `The Bot is Busy, Please try again in some time :)`,
                    ephemeral: false
                });
                console.error(e);
            }
            
        } else {
            interaction.reply({
                content: `You Passed ${options.getInteger('flowernumber')}, The flower numbers are from 1 to 4096`,
                ephemeral: false
            });
        }
    }
    
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);

