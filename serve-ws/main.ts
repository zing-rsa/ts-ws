import { serve } from "https://deno.land/std/http/mod.ts"
import "https://deno.land/std/dotenv/load.ts";
import { handleWS } from "./api.ts";

serve(handleWS, {port: 5000 });

