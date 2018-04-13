/* load modules */
const config = require('config'),
  fs = require('fs'),
  channelDetail = require('./lib/channel-detail.js')
  //videoList = require('./lib/video-list.js')

/* load channel-list from csv*/
var channel_raw = fs.readFileSync('./result2.csv', 'utf8').split(/\r?\n/)
var channel_list = []
for(var channel of channel_raw){
  channel_list.push(channel.substring(31))
  if(channel_list.length >= 10) // option(have to erase on product)
    break
}

/* fetch jobs on main */
const main = async (channel) => {
  try {
    let result_channel = await channelDetail(channel)
    if(!result_channel) throw new Error('invalid channel')
    else console.log('Channel Detail ' + channel + ' done')
    //await videoList(channel)
    //console.log('Video List ' + channel + ' done')
  } catch (error){
    console.log(error)
  }
}

/* run queue & save data */
var tasks = {}
for(var channel of channel_list){
  console.log(channel)
  tasks["channelInfo" + channel] = main(channel)
}
