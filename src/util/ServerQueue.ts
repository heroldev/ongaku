import { Queue } from "@datastructures-js/queue";
import { Song } from "../types/Song";

export let ServerQueue = new Map<string, Queue<Song>>()