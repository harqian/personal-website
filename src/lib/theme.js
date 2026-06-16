import { writable } from "svelte/store";

// single source of truth for the day/night axis. ThemeControls (the eye) writes it;
// StarBackground reads it to swap the starfield for daytime clouds. defaults to "dark"
// (night); the real value is seeded on mount from the data-theme attribute app.html set pre-paint.
export const theme = writable("dark");
