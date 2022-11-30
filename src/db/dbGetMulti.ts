const promise = require('bluebird')
import dbConnect from './dbConnect'
const sqlite3 = require('sqlite3')
require('dotenv').config()

export const dbGetMulti = (query: string, params?: any[]) => {

  const database = dbConnect(process.env.DB_FILE_PATH || "")

  const promise =  new Promise((resolve, reject) => {
      database.all(query, params || [], function (err: any, rows: any) {
        if (err) {
          console.log('Error running sql ' + query)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })

  database.close()

  return promise;

}

export default dbGetMulti