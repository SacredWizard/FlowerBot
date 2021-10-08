# flowerbot
Discord bot to convert NFT Assets (SVG) to gifs.

# Setup
1. create a `.env` file and add 
  ```
  TOKEN=<discord bot token>
  GUILD_ID=<client id>
  ```
2. `npm install`
3. run the generation script first `node generategif.js`, for downloading and saving the assets to generatedassets folder (This is for faster bot response, when the bot is queried for an asset, it would directly use the generated gif and return it instead of generating a new one). This will take some time to execute (Script may fail sometimes)
4. execute the bot script `node index.js`

Looks something like this 🐶

<img width="339" alt="Screen Shot 2021-10-06 at 10 02 28 PM" src="https://user-images.githubusercontent.com/8125061/136313648-c43a415a-1b47-47b9-bf5b-a62ae167b757.png">

TODO:
1. Fix the animation in gifs
2. Remove hardcoded values
3. Even though the slash command is successful, the bot says `interaction failed` and returns the proper response ! lol, fix this
4. Adding fields to the embed is failing (wanted to add the asset traits in the response embed)


Reference for gif converter: [Austin Andrews](http://templarian.com/2020/02/13/svg-to-animated-gif/)
