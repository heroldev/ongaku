import { Hello } from "./commands/Hello";
import { Help } from "./commands/Help";
import { Clear } from "./commands/music/Clear";
import { Pause } from "./commands/music/Pause";
import { Play } from "./commands/music/Play";
import { Skip } from "./commands/music/Skip";
import { SongQueue } from "./commands/music/SongQueue";
import { Stop } from "./commands/music/Stop";
import { Unpause } from "./commands/music/Unpause";
import { Pet } from "./commands/Pet";
import { PetCount } from "./commands/PetCount";
import { Status } from "./commands/Status";
import { Join } from "./commands/voice/Join";
import { Command } from "./types/Command";

export const Commands: Command[] = [Help, Play, Pause, Unpause, SongQueue, Pet, PetCount, Skip, Stop, Clear, Status];