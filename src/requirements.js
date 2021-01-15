const { DISCORD_TOKEN, CHANNEL_ID, PASSWORD } = process.env
if (!DISCORD_TOKEN) {
  console.error('Please provide a DISCORD_TOKEN env')
  process.exit(1)
}
if (!CHANNEL_ID) {
  console.error('Please provide an CHANNEL_ID env')
  process.exit(1)
}
if (!PASSWORD) {
  console.error('Please provide an PASSWORD env')
  process.exit(1)
}
module.exports={}