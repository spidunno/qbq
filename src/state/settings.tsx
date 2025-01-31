import { storageDb } from "./storage";

// export const themeModeAtom = atomWithStorage<DefaultColorScheme | "system">("qubic-color-scheme", "system", undefined, {getOnInit: true});
export const themeModeAtom = storageDb("color-scheme");

export const freezeTimeLengthAtom = storageDb("freeze-time-length");