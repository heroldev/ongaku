import { Hello } from "./commands/Hello";
import { Help } from "./commands/Help";
import { Jam } from "./commands/Jam";
import { JamCount } from "./commands/JamCount";
import { Clear } from "./commands/music/Clear";
import { Leave } from "./commands/music/Leave";
import { Pause } from "./commands/music/Pause";
import { Play } from "./commands/music/Play";
import { Skip } from "./commands/music/Skip";
import { SongQueue } from "./commands/music/SongQueue";
import { Stop } from "./commands/music/Stop";
import { Unpause } from "./commands/music/Unpause";
import { Status } from "./commands/Status";
import { Switch } from "./commands/Switch";
import { Join } from "./commands/voice/Join";
import { Command } from "./types/Command";

export const Commands: Command[] = [Help, Play, Pause, Unpause, SongQueue, Skip, Stop, Clear, Status, Leave, Switch, Jam, JamCount];