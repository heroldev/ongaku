import { PetType } from "../types/PetType"
import dbRun from "./dbRun"

/**
 * Increments the pet_count table (when a user calls the /pet command)
 * @param user the ID of the user, retrieved from interaction.member.user.id
 * @param type the type of the pet using PetType, whether or not it is a bite, pet, or something else
 * @returns the total count of pets
 * @author heroldev (Andrew Herold)
 */
export const dbIncrementJam = (user: string) => {

  return dbRun("INSERT into jam_count (user_id) VALUES (?)", [user])

}

export default dbIncrementJam