document.getElementById("convertButton").addEventListener("click", async () => {
    console.log("Button click detected in Script 1");

    const fileInput = document.getElementById("midiFile");
    const outputText = document.getElementById("output");

    outputText.value = "converting...";

    if (!fileInput.files.length) {
        alert("Please upload a MIDI file.");
        return;
    }

    /*
     * ============================================================
     * MIDI → MIDI2LUA-Gau ENGINE
     *
     * Main improvements:
     * - Properly groups simultaneous notes into chords
     * - Removes true duplicate notes
     * - Keeps different notes in the same chord
     * - Uses note START times for timing
     * - Prevents unnecessary rest(0, bpm)
     * - Handles sustain separately from note timing
     * - Adds light timing normalization
     * - Keeps original MIDI note lengths when requested
     * - Supports MIDI 61 / MIDI 88 mappings
     * ============================================================
     */

    const getCheckbox = (id) => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };

    const midi88Enabled = getCheckbox("midi88Checkbox");
    const detectBpmEnabled = getCheckbox("detectBpmCheckbox");
    const shortNotesEnabled = getCheckbox("shortNotesCheckbox");
    const velocityEnabled = getCheckbox("velocityCheckbox");
    const sustainEnabled = getCheckbox("sustainPedalCheckBox");
    const midiSpoofEnabled = getCheckbox("midiSpoofCheckbox");

    let bpmInput = parseFloat(
        document.getElementById("bpmInput")?.value || "120"
    );

    /*
     * ============================================================
     * NOTE MAP
     * ============================================================
     */

    let noteMap = {};

    if (!midi88Enabled) {
        noteMap = {
            "A0": "1",
            "A#0": "2",
            "Bb0": "2",
            "B0": "3",

            "C1": "1",
            "C#1": "!",
            "Db1": "!",
            "D1": "2",
            "D#1": "@",
            "Eb1": "@",
            "E1": "3",
            "F1": "4",
            "F#1": "$",
            "Gb1": "$",
            "G1": "5",
            "G#1": "%",
            "Ab1": "%",
            "A1": "6",
            "A#1": "^",
            "Bb1": "^",
            "B1": "7",

            "C2": "1",
            "C#2": "!",
            "Db2": "!",
            "D2": "2",
            "D#2": "@",
            "Eb2": "@",
            "E2": "3",
            "F2": "4",
            "F#2": "$",
            "Gb2": "$",
            "G2": "5",
            "G#2": "%",
            "Ab2": "%",
            "A2": "6",
            "A#2": "^",
            "Bb2": "^",
            "B2": "7",

            "C3": "8",
            "C#3": "*",
            "Db3": "*",
            "D3": "9",
            "D#3": "(",
            "Eb3": "(",
            "E3": "0",
            "F3": "q",
            "F#3": "Q",
            "Gb3": "Q",
            "G3": "w",
            "G#3": "W",
            "Ab3": "W",
            "A3": "e",
            "A#3": "E",
            "Bb3": "E",
            "B3": "r",

            "C4": "t",
            "C#4": "T",
            "Db4": "T",
            "D4": "y",
            "D#4": "Y",
            "Eb4": "Y",
            "E4": "u",
            "F4": "i",
            "F#4": "I",
            "Gb4": "I",
            "G4": "o",
            "G#4": "O",
            "Ab4": "O",
            "A4": "p",
            "A#4": "P",
            "Bb4": "P",
            "B4": "a",

            "C5": "s",
            "C#5": "S",
            "Db5": "S",
            "D5": "d",
            "D#5": "D",
            "Eb5": "D",
            "E5": "f",
            "F5": "g",
            "F#5": "G",
            "Gb5": "G",
            "G5": "h",
            "G#5": "H",
            "Ab5": "H",
            "A5": "j",
            "A#5": "J",
            "Bb5": "J",
            "B5": "k",

            "C6": "l",
            "C#6": "L",
            "Db6": "L",
            "D6": "z",
            "D#6": "Z",
            "Eb6": "Z",
            "E6": "x",
            "F6": "c",
            "F#6": "C",
            "Gb6": "C",
            "G6": "v",
            "G#6": "V",
            "Ab6": "V",
            "A6": "b",
            "A#6": "B",
            "Bb6": "B",
            "B6": "n",

            "C7": "m",
            "C#7": "L",
            "Db7": "L",
            "D7": "z",
            "D#7": "Z",
            "Eb7": "Z",
            "E7": "x",
            "F7": "c",
            "F#7": "C",
            "Gb7": "C",
            "G7": "v",
            "G#7": "V",
            "Ab7": "V",
            "A7": "b",
            "A#7": "B",
            "Bb7": "B",
            "B7": "n",

            "C8": "j"
        };
    } else {
        noteMap = {
            "A0": "Ctrl+1",
            "A#0": "Ctrl+2",
            "Bb0": "Ctrl+2",
            "B0": "Ctrl+3",

            "C1": "Ctrl+4",
            "C#1": "Ctrl+5",
            "Db1": "Ctrl+5",
            "D1": "Ctrl+6",
            "D#1": "Ctrl+7",
            "Eb1": "Ctrl+7",
            "E1": "Ctrl+8",
            "F1": "Ctrl+9",
            "F#1": "Ctrl+0",
            "Gb1": "Ctrl+0",
            "G1": "Ctrl+q",
            "G#1": "Ctrl+w",
            "Ab1": "Ctrl+w",
            "A1": "Ctrl+e",
            "A#1": "Ctrl+r",
            "Bb1": "Ctrl+r",
            "B1": "Ctrl+t",

            "C2": "1",
            "C#2": "!",
            "Db2": "!",
            "D2": "2",
            "D#2": "@",
            "Eb2": "@",
            "E2": "3",
            "F2": "4",
            "F#2": "$",
            "Gb2": "$",
            "G2": "5",
            "G#2": "%",
            "Ab2": "%",
            "A2": "6",
            "A#2": "^",
            "Bb2": "^",
            "B2": "7",

            "C3": "8",
            "C#3": "*",
            "Db3": "*",
            "D3": "9",
            "D#3": "(",
            "Eb3": "(",
            "E3": "0",
            "F3": "q",
            "F#3": "Q",
            "Gb3": "Q",
            "G3": "w",
            "G#3": "W",
            "Ab3": "W",
            "A3": "e",
            "A#3": "E",
            "Bb3": "E",
            "B3": "r",

            "C4": "t",
            "C#4": "T",
            "Db4": "T",
            "D4": "y",
            "D#4": "Y",
            "Eb4": "Y",
            "E4": "u",
            "F4": "i",
            "F#4": "I",
            "Gb4": "I",
            "G4": "o",
            "G#4": "O",
            "Ab4": "O",
            "A4": "p",
            "A#4": "P",
            "Bb4": "P",
            "B4": "a",

            "C5": "s",
            "C#5": "S",
            "Db5": "S",
            "D5": "d",
            "D#5": "D",
            "Eb5": "D",
            "E5": "f",
            "F5": "g",
            "F#5": "G",
            "Gb5": "G",
            "G5": "h",
            "G#5": "H",
            "Ab5": "H",
            "A5": "j",
            "A#5": "J",
            "Bb5": "J",
            "B5": "k",

            "C6": "l",
            "C#6": "L",
            "Db6": "L",
            "D6": "z",
            "D#6": "Z",
            "Eb6": "Z",
            "E6": "x",
            "F6": "c",
            "F#6": "C",
            "Gb6": "C",
            "G6": "v",
            "G#6": "V",
            "Ab6": "V",
            "A6": "b",
            "A#6": "B",
            "Bb6": "B",
            "B6": "n",

            "C7": "m",
            "C#7": "M",
            "Db7": "M",
            "D7": "Ctrl+u",
            "D#7": "Ctrl+i",
            "Eb7": "Ctrl+i",
            "E7": "Ctrl+o",
            "F7": "Ctrl+p",
            "F#7": "Ctrl+a",
            "Gb7": "Ctrl+a",
            "G7": "Ctrl+s",
            "G#7": "Ctrl+d",
            "Ab7": "Ctrl+d",
            "A7": "Ctrl+f",
            "A#7": "Ctrl+g",
            "Bb7": "Ctrl+g",
            "B7": "Ctrl+h",

            "C8": "Ctrl+j"
        };
    }

    /*
     * ============================================================
     * HELPERS
     * ============================================================
     */

    function roundToThree(num) {
        return Math.round(num * 1000) / 1000;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /*
     * Two MIDI events that are only a tiny fraction apart are
     * usually intended to happen at the same musical position.
     *
     * 5ms is deliberately small so we don't destroy real notes.
     */
    const SAME_TIME_TOLERANCE = 0.005;

    /*
     * Very tiny notes generated by some MIDI converters can be
     * accidental artifacts.
     *
     * We DO NOT delete them by default because doing so can remove
     * legitimate grace notes.
     */
    const MIN_NOTE_DURATION = 0.001;

    /*
     * Quantization is intentionally light.
     *
     * 1/192 of a quarter note is extremely fine.
     * This only removes microscopic floating-point/timing noise.
     */
    const QUANTIZE_DIVISION = 192;

    function quantizeBeat(beat) {
        return Math.round(beat * QUANTIZE_DIVISION) / QUANTIZE_DIVISION;
    }

    /*
     * Safely convert a MIDI note name to its mapped keyboard key.
     */
    function mapNote(noteName) {
        if (noteMap[noteName] !== undefined) {
            return noteMap[noteName];
        }

        console.warn("Unmapped MIDI note:", noteName);
        return null;
    }

    /*
     * ============================================================
     * READ FILE
     * ============================================================
     */

    const reader = new FileReader();

    reader.onload = async (event) => {
        try {
            const midiData = new Uint8Array(event.target.result);
            const midi = new Midi(midiData);

            /*
             * ====================================================
             * BPM
             * ====================================================
             */

            const detectedBpm =
                midi.header?.tempos?.[0]?.bpm || 120;

            if (detectBpmEnabled) {
                bpmInput = Math.round(detectedBpm);
            }

            bpmInput = Number(bpmInput);

            if (!Number.isFinite(bpmInput) || bpmInput <= 0) {
                bpmInput = 120;
            }

            /*
             * IMPORTANT:
             *
             * Tone.js Midi note.time is in SECONDS.
             *
             * The generated MIDI2LUA script uses beats with:
             *
             *     rest(amount, bpm)
             *
             * Therefore:
             *
             *     seconds × BPM / 60 = beats
             */
            const secondsToBeats = bpmInput / 60;

            /*
             * ====================================================
             * OUTPUT HEADER
             * ====================================================
             */

            let output = "";
            let songscript = "";

            output += `-- Generated by MIDI2LUA-Gau --\n`;

            if (midi88Enabled) {
                output += `-- MIDI88: ON --\n`;
            } else {
                output += `-- MIDI88: OFF --\n`;
            }

            if (shortNotesEnabled) {
                output += `-- Short Notes: ON --\n`;
            } else {
                output += `-- Short Notes: OFF --\n`;
            }

            if (velocityEnabled) {
                output += `-- Note Velocity: ON --\n`;
            } else {
                output += `-- Note Velocity: OFF --\n`;
            }

            if (sustainEnabled) {
                output += `-- Sustain Pedal: ON --\n`;
            } else {
                output += `-- Sustain Pedal: OFF --\n`;
            }

            if (midiSpoofEnabled) {
                output += `-- Midi Spoofer: ON (this script will only work in "Piano Rooms!") --\n`;
            } else {
                output += `-- Midi Spoofer: OFF --\n`;
            }

            output += `\nbpm = ${bpmInput}\n\n`;

            if (midiSpoofEnabled) {
                output +=
                    `loadstring(game:HttpGet("https://raw.githubusercontent.com/Linh-1205/autopiano/refs/heads/main/midi_spoof_loader.lua", true))()\n\n`;
            } else {
                output +=
                    `loadstring(game:HttpGet("https://raw.githubusercontent.com/Linh-1205/autopiano/refs/heads/main/loader_main.lua", true))()\n\n`;
            }

            /*
             * ====================================================
             * COLLECT RAW NOTES
             * ====================================================
             *
             * Unlike the old version, notes are first normalized
             * before being converted to keypress events.
             */

            const rawNotes = [];
            const rawPedals = [];

            midi.tracks.forEach((track, trackIndex) => {

                /*
                 * NOTES
                 */
                if (Array.isArray(track.notes)) {
                    track.notes.forEach((note, noteIndex) => {

                        if (!note || !note.name) {
                            return;
                        }

                        const startTime = Number(note.time);
                        const duration = Number(note.duration);
                        const velocity = Number(note.velocity);

                        if (!Number.isFinite(startTime)) {
                            return;
                        }

                        if (!Number.isFinite(duration)) {
                            return;
                        }

                        if (duration < MIN_NOTE_DURATION) {
                            return;
                        }

                        const mappedKey = mapNote(note.name);

                        if (mappedKey === null) {
                            return;
                        }

                        rawNotes.push({
                            time: startTime,
                            duration: Math.max(duration, MIN_NOTE_DURATION),
                            velocity: Number.isFinite(velocity)
                                ? clamp(velocity, 0, 1)
                                : 0.5,
                            name: note.name,
                            key: mappedKey,
                            track: trackIndex,
                            index: noteIndex
                        });
                    });
                }

                /*
                 * SUSTAIN PEDAL
                 */
                if (
                    sustainEnabled &&
                    track.controlChanges &&
                    track.controlChanges[64]
                ) {
                    track.controlChanges[64].forEach((cc) => {

                        const time = Number(cc.time);
                        const value = Number(cc.value);

                        if (!Number.isFinite(time)) {
                            return;
                        }

                        rawPedals.push({
                            time,
                            value: Number.isFinite(value) ? value : 0
                        });
                    });
                }
            });

            /*
             * ====================================================
             * SORT NOTES
             * ====================================================
             */

            rawNotes.sort((a, b) => {
                if (a.time !== b.time) {
                    return a.time - b.time;
                }

                /*
                 * Lower MIDI pitch first if available.
                 * This makes chord ordering deterministic.
                 */
                return a.name.localeCompare(b.name);
            });

            /*
             * ====================================================
             * REMOVE TRUE DUPLICATES
             * ====================================================
             *
             * A duplicate means:
             *
             * same keyboard key
             * same timestamp
             * within tiny timing tolerance
             *
             * We DO NOT remove different notes from the same chord.
             */

            const cleanedNotes = [];

            for (const note of rawNotes) {
                let duplicate = false;

                /*
                 * Search backwards only through nearby notes.
                 */
                for (let i = cleanedNotes.length - 1; i >= 0; i--) {

                    const previous = cleanedNotes[i];

                    if (
                        note.time - previous.time >
                        SAME_TIME_TOLERANCE
                    ) {
                        break;
                    }

                    if (
                        previous.key === note.key &&
                        Math.abs(previous.time - note.time) <=
                            SAME_TIME_TOLERANCE
                    ) {
                        duplicate = true;

                        /*
                         * Keep the longer duplicate.
                         * This avoids losing note duration.
                         */
                        if (note.duration > previous.duration) {
                            previous.duration = note.duration;
                        }

                        /*
                         * Keep the stronger velocity.
                         */
                        if (note.velocity > previous.velocity) {
                            previous.velocity = note.velocity;
                        }

                        break;
                    }
                }

                if (!duplicate) {
                    cleanedNotes.push(note);
                }
            }

            /*
             * ====================================================
             * GROUP NOTES BY MUSICAL START TIME
             * ====================================================
             *
             * Example:
             *
             * C4 1.000
             * E4 1.001
             * G4 1.002
             *
             * becomes one chord at approximately 1.000.
             */

            const groups = [];

            for (const note of cleanedNotes) {

                const lastGroup = groups[groups.length - 1];

                if (
                    lastGroup &&
                    Math.abs(note.time - lastGroup.time) <=
                        SAME_TIME_TOLERANCE
                ) {
                    lastGroup.notes.push(note);
                } else {
                    groups.push({
                        time: note.time,
                        notes: [note]
                    });
                }
            }

            /*
             * ====================================================
             * NORMALIZE GROUP TIMES
             * ====================================================
             */

            for (const group of groups) {

                if (!group.notes.length) {
                    continue;
                }

                /*
                 * Use the earliest actual note time as the group's
                 * canonical time.
                 */
                group.time = Math.min(
                    ...group.notes.map(n => n.time)
                );

                /*
                 * Sort chord from low → high.
                 */
                group.notes.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            }

            /*
             * ====================================================
             * PEDAL CLEANUP
             * ====================================================
             */

            const pedalEvents = [];

            if (sustainEnabled) {

                rawPedals.sort((a, b) => a.time - b.time);

                let previousPedalState = false;

                for (const pedal of rawPedals) {

                    const isDown = pedal.value >= 0.5;

                    /*
                     * Ignore repeated identical pedal states.
                     */
                    if (isDown === previousPedalState) {
                        continue;
                    }

                    previousPedalState = isDown;

                    pedalEvents.push({
                        time: pedal.time,
                        down: isDown
                    });
                }
            }

            /*
             * ====================================================
             * COMBINE NOTE GROUPS + PEDAL EVENTS
             * ====================================================
             */

            const allEvents = [];

            for (const group of groups) {
                allEvents.push({
                    time: group.time,
                    type: "notes",
                    notes: group.notes
                });
            }

            for (const pedal of pedalEvents) {
                allEvents.push({
                    time: pedal.time,
                    type: "pedal",
                    down: pedal.down
                });
            }

            allEvents.sort((a, b) => a.time - b.time);

            /*
             * ====================================================
             * PROCESS EVENTS
             * ====================================================
             */

            let previousTime = 0;
            let lastVelocity = null;

            /*
             * We don't use lastKey anymore.
             *
             * This is important:
             *
             * Old:
             *
             *     currentKey !== lastKey
             *
             * New:
             *
             *     every unique note inside a chord gets emitted.
             */

            for (const event of allEvents) {

                /*
                 * -----------------------------------------------
                 * TIMING
                 * -----------------------------------------------
                 */

                let deltaSeconds =
                    event.time - previousTime;

                /*
                 * Protect against floating-point noise.
                 */
                if (deltaSeconds < 0) {
                    deltaSeconds = 0;
                }

                /*
                 * Convert seconds → beats.
                 */
                let deltaBeats =
                    deltaSeconds * secondsToBeats;

                /*
                 * Remove microscopic timing errors.
                 */
                if (deltaBeats < 0.0005) {
                    deltaBeats = 0;
                }

                deltaBeats = quantizeBeat(deltaBeats);

                if (deltaBeats > 0) {
                    songscript +=
                        `rest(${roundToThree(deltaBeats)}, bpm)\n`;
                }

                /*
                 * -----------------------------------------------
                 * PEDAL
                 * -----------------------------------------------
                 */

                if (event.type === "pedal") {

                    if (event.down) {
                        songscript += `pedalDown()\n`;
                    } else {
                        songscript += `pedalUp()\n`;
                    }

                    previousTime = event.time;
                    continue;
                }

                /*
                 * -----------------------------------------------
                 * CHORD / NOTES
                 * -----------------------------------------------
                 */

                if (
                    event.type === "notes" &&
                    Array.isArray(event.notes)
                ) {

                    /*
                     * Sort again to guarantee deterministic order.
                     */
                    event.notes.sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    });

                    for (const note of event.notes) {

                        const currentKey = note.key;

                        if (!currentKey) {
                            continue;
                        }

                        /*
                         * VELOCITY
                         */

                        if (velocityEnabled) {

                            const vel =
                                roundToThree(
                                    clamp(
                                        note.velocity || 0.5,
                                        0,
                                        1
                                    )
                                );

                            /*
                             * Only change velocity when needed.
                             */
                            if (
                                lastVelocity === null ||
                                Math.abs(lastVelocity - vel) > 0.001
                            ) {
                                songscript +=
                                    `adjustVelocity(${vel})\n`;

                                lastVelocity = vel;
                            }
                        }

                        /*
                         * NOTE DURATION
                         */

                        let keypressDuration = "x";

                        if (shortNotesEnabled) {

                            const durationBeats =
                                note.duration *
                                secondsToBeats;

                            /*
                             * Don't let extremely tiny floating
                             * point values create broken keypresses.
                             */
                            keypressDuration =
                                Math.max(
                                    0.001,
                                    roundToThree(
                                        durationBeats
                                    )
                                );
                        }

                        /*
                         * Every unique note in the chord is emitted.
                         */
                        songscript +=
                            `keypress("${currentKey}", ${keypressDuration}, bpm)\n`;
                    }
                }

                previousTime = event.time;
            }

            /*
             * ====================================================
             * FINISH
             * ====================================================
             */

            songscript += `\nfinishedSong()`;

            outputText.value =
                output + songscript;

            console.log(
                "MIDI conversion complete:",
                {
                    rawNotes: rawNotes.length,
                    cleanedNotes: cleanedNotes.length,
                    noteGroups: groups.length,
                    pedalEvents: pedalEvents.length,
                    bpm: bpmInput
                }
            );

        } catch (error) {

            console.error("MIDI conversion error:", error);

            outputText.value =
                "Error while converting MIDI:\n\n" +
                error.message;

            alert(
                "Could not convert MIDI file.\n\n" +
                error.message
            );
        }
    };

    reader.readAsArrayBuffer(fileInput.files[0]);
});


/*
 * ================================================================
 * COPY BUTTON
 * ================================================================
 */

document.getElementById("copyButton").addEventListener("click", () => {
    const outputText =
        document.getElementById("output");

    outputText.select();

    document.execCommand("copy");
});
