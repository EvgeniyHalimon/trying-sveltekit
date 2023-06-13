import { writable } from "svelte/store";
import type { ITodoList } from "../types";

export const todos = writable<ITodoList[] | []>([])