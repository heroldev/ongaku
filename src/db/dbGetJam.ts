import dbGetMulti from "./dbGetMulti"

/**
 * Gets a user's pet count from the pet_count table (when a user calls the /pet command)
 * @param user the ID of the user, retrieved from interaction.member.user.id
 * @returns the total count of pets
 * @author heroldev (Andrew Herold)
 */
export const dbGetJam = (user: string) => {

  return dbGetMulti("SELECT * from jam_count WHERE user_id=?", [user])

}

export default dbGetJam