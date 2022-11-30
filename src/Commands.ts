import { Hello } from "./commands/Hello";
import { Help } from "./commands/Help";
import { Pet } from "./commands/Pet";
import { PetCount } from "./commands/PetCount";
import { Status } from "./commands/Status";
import { Join } from "./commands/voice/Join";
import { Command } from "./types/Command";

export const Commands: Command[] = [Hello, Help, Status, Pet, PetCount, Join];