export const env = Deno.env.get('FRESH_ENVIRONMENT')!;

export const MONGO_URL = Deno.env.get("MONGO_URL")!;

export const DB_NAME = "ws-ts";

export const APP_URL = {
    'dev': 'localhost:8000',
    'prod': 'none'
}[env]!