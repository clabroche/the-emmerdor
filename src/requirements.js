// This file check on require if server is ready to be launch
const { DISCORD_TOKEN, CHANNEL_ID, PASSWORD, PRISON_TOKEN} = process.env
if (!DISCORD_TOKEN) { // Bot Token 
  console.error('Please provide a DISCORD_TOKEN env')
  process.exit(1)
}
if (!PRISON_TOKEN) { // Bot Token
  console.error('Please provide a PRISON_TOKEN env')
  process.exit(1)
}
if (!CHANNEL_ID) { // Text channel to log all info
  console.error('Please provide an CHANNEL_ID env')
  process.exit(1)
}
if (!PASSWORD) { // Password for front access
  console.error('Please provide an PASSWORD env')
  process.exit(1)
}
module.exports={}