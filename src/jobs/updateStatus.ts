import {client} from '../Bot'
import { getListeningStatus } from '../util/listeningStatus'
const cron = require('cron')

export const updateListeningStatus = cron.job('0 */1 * * *', () => {

  if (!client.user || !client.application) {
    console.log("Error with update status job")
  } else {
  
    let status = getListeningStatus()
  
    client.user.setPresence({
      status: 'online',
      activities: [status]
    })
  
    console.log("musebert status updated - "+ status.type + " " + status.name)
  }

})



