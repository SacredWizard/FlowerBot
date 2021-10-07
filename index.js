const r2 = require("r2");
const { Client, Intents, Constants, MessageEmbed, MessageAttachment } = require('discord.js');
const dotenv = require('dotenv');
const SvgGif = require('./SvgGif');
const fs = require("fs");
const width = 3000;
const height = 3000;
const logouri = 'https://lh3.googleusercontent.com/QXaAXCfdQthkf5ykh1t5-SVb8uKS9vjMKoQ-GRS714JX6LVoIhq5RufyP-IAv1rKBIoTHrnmUtn2W8Pc_1KlHOIIATXzO6_7C5kDng=s0';

dotenv.config();

const getData = async url => {
	try {
		return r2(url).json;
	} catch (error) {
		console.log(error);
	}
};

const gifconverter = async (svgImageString, fileName) => {
	
	const gif = new SvgGif({
		width,
		height,
		fileName
	});
	
	console.log(`Generating...`);
	
	await gif.addFrame(svgImageString, 42);
    await gif.addFrame(svgImageString, 84);
    await gif.addFrame(svgImageString, 126);
	

	gif.finish();
	console.log(`Done, generating ${fileName}`);
};

const generateEmbed = (gifFileName, uri, attributes) => {
	return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Flower Bot')
	.setURL(uri)
	.setAuthor('OCC', logouri, 'https://occ.xyz')
	.setDescription('On Chain Collection #1 flowers')
	.setThumbnail(logouri)
	// .addFields(...attributes.map(x => { return {name: x['trait_type'], value:x['value'], inline:true}}))
	.setImage(`attachment://${gifFileName}`)
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
		
		const assetNumber = options.getInteger('flowernumber')
		if (assetNumber && assetNumber > 0 && assetNumber < 4097) {
			const uri = `https://api.opensea.io/asset/0x5A876ffc6E75066f5ca870e20FCa4754C1EfE91F/${assetNumber}/validate/`;
			const gifFileName = `generatedassets/asset${assetNumber}.gif`;

			result = await getData(uri);
			base64String = result.token_uri.replace('data:application/json;base64,','');
			let buff = new Buffer.from(base64String, 'base64');
			svgImageData = JSON.parse(buff.toString());
			svgImage = new Buffer.from(svgImageData.image.replace('data:image/svg+xml;base64,',''), 'base64');

			try {
				if (fs.existsSync(gifFileName)) {
					const gifAttachment = new MessageAttachment(gifFileName);
					const flowerEmbed = generateEmbed(gifFileName, uri, svgImageData.attributes);
					interaction.channel.send({
						embeds: [flowerEmbed],
						files:[gifAttachment]
					});
				} else {
					(await gifconverter(svgImage.toString(), gifFileName)).then(() => {
						const gifAttachment = new MessageAttachment(gifFileName);
						const flowerEmbed = generateEmbed(gifFileName, uri, svgImageData.attributes);
						interaction.channel.send({
							embeds: [flowerEmbed],
							files:[gifAttachment]
						});
					});
				}
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
