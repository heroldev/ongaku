const promise = require('bluebird')
import dbConnect from './dbConnect'
const sqlite3 = require('sqlite3')
require('dotenv').config()

export const dbRun = (query: string, params?: any[]) => {

  const database = dbConnect(process.env.DB_FILE_PATH || "")

  const promise =  new Promise((resolve, reject) => {
      database.run(query, params || [], function (this: any, err: any) {
        if (err) {
          console.log('Error running sql ' + query)
          console.log(err)
          reject(err)
        } else {
          resolve({ id: this.lastID })
        }
      })
    })

  database.close()

  return promise;

}

export default dbRun