const promise = require('bluebird')
import dbConnect from './dbConnect'
const sqlite3 = require('sqlite3')
require('dotenv').config()

export const dbGetSingle = (query: string, params?: any[]) => {

  const database = dbConnect(process.env.DB_FILE_PATH || "")

  const promise =  new Promise((resolve, reject) => {
      database.get(query, params || [], function (err: any, result: any) {
        if (err) {
          console.log('Error running sql ' + query)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })

  database.close()

  return promise;

}

export default dbGetSingle