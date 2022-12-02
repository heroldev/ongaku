import { Hello } from "./commands/Hello";
import { Help } from "./commands/Help";
import { Pause } from "./commands/music/Pause";
import { Play } from "./commands/music/Play";
import { Unpause } from "./commands/music/Unpause";
import { Pet } from "./commands/Pet";
import { PetCount } from "./commands/PetCount";
import { Status } from "./commands/Status";
import { Join } from "./commands/voice/Join";
import { Command } from "./types/Command";

export const Commands: Command[] = [Help, Status, Play, Pause, Unpause];