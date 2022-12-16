import dbRun from './dbRun'
const sqlite3 = require('sqlite3')

/**
 * Creates the database if it doesn't already exist. Does not fill it with any data.
 * @author heroldev (Andrew Herold)
 * @param dbFilePath the file path of where you want the DB to be created
 */
export const dbCreate = (dbFilePath: string) => {

  const database = new sqlite3.Database(dbFilePath, (err: any) => {
    if (err) {
      console.log('ongaku failed to create the database', err)
    } else {
      console.log('ongaku connected to database, creating tables..')
      runInitQueries()
      console.log('database created! :)')
    }
  })

  const runInitQueries = () => {
    // create the pet tables
    database.run("CREATE TABLE IF NOT EXISTS `jam_count` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `user_id` varchar(50) NOT NULL);", [])
    console.log("jam tables created!")
  }

  database.close()

}

export default dbCreate