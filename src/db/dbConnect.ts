const sqlite3 = require('sqlite3')

/**
 * Creates a connection to the database.
 * @param dbFilePath the file path of the SQLite database
 * @returns a connection object. Used in other DB commands.
 */
export const dbConnect = (dbFilePath: string) => {

  const database = new sqlite3.Database(dbFilePath, (err: any) => {
    if (err) {
      console.log('ongaku could not connect to database', err)
    } else {
      //console.log('meowbert connected to database')
    }
  })

  return database

}

export default dbConnect