import { signal } from "@preact/signals-core"
import { Client } from "models/ws.ts";

export const clients = signal<Client[]>([]);