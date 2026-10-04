document.getElementById("convertButton").addEventListener("click", async () => {
    console.log("MIDI2LUA-Gau v2.1 - NO NOTE FILTER");

    const fileInput = document.getElementById("midiFile");
    const outputText = document.getElementById("output");

    outputText.value = "converting...";

    if (!fileInput.files.length) {
        alert("Please upload a MIDI file.");
        return;
    }

    // =========================================================
    // OPTIONS
    // =========================================================

    const midi88Enabled =
        document.getElementById("midi88Checkbox").checked;

    const detectBpmEnabled =
        document.getElementById("detectBpmCheckbox").checked;

    const shortNotesEnabled =
        document.getElementById("shortNotesCheckbox").checked;

    const velocityEnabled =
        document.getElementById("velocityCheckbox").checked;

    const sustainEnabled =
        document.getElementById("sustainPedalCheckBox").checked;

    const midiSpoofEnabled =
        document.getElementById("midiSpoofCheckbox").checked;

    let bpmInput =
        parseFloat(document.getElementById("bpmInput").value);

    // =========================================================
    // NOTE MAP
    // =========================================================

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

    // =========================================================
    // HELPERS
    // =========================================================

    function roundToThree(num) {
        return Math.round(num * 1000) / 1000;
    }

    function safeNumber(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function getNoteNumber(note) {
        /*
         * Tone.js/Midi gives us note.midi.
         * Keeping the MIDI number is important because two different
         * MIDI pitches can map to the same keyboard key.
         */
        if (Number.isFinite(note.midi)) {
            return note.midi;
        }

        return null;
    }

    function getTrackIndex(track, index) {
        return Number.isFinite(track.index)
            ? track.index
            : index;
    }

    // Very small tolerance.
    // We do NOT use this to remove notes.
    // It is ONLY used to decide whether notes start at the same time.
    const SAME_TIME_TOLERANCE = 0.001;

    // =========================================================
    // READ MIDI
    // =========================================================

    const reader = new FileReader();

    reader.onload = async (event) => {
        try {
            const midiData = new Uint8Array(event.target.result);
            const midi = new Midi(midiData);

            // -------------------------------------------------
            // BPM
            // -------------------------------------------------

            const detectedBpm =
                safeNumber(
                    midi.header.tempos?.[0]?.bpm,
                    120
                );

            if (detectBpmEnabled) {
                bpmInput = Math.round(detectedBpm);
            }

            if (!Number.isFinite(bpmInput) || bpmInput <= 0) {
                bpmInput = Math.round(detectedBpm) || 120;
            }

            /*
             * IMPORTANT:
             *
             * We intentionally calculate time from seconds.
             *
             * MIDI note.time is in seconds after Midi.js/Tone.js
             * has processed the tempo map.
             *
             * Output rest/keypress values are expressed in beats,
             * therefore:
             *
             * seconds * BPM / 60 = beats
             */

            const secondsToBeats = bpmInput / 60;

            // -------------------------------------------------
            // OUTPUT HEADER
            // -------------------------------------------------

            let output = "";
            let songscript = "";

            output += `-- Generated by MIDI2LUA-Gau --\n`;

            output += midi88Enabled
                ? `-- MIDI88: ON --\n`
                : `-- MIDI88: OFF --\n`;

            output += shortNotesEnabled
                ? `-- Short Notes: ON --\n`
                : `-- Short Notes: OFF --\n`;

            output += velocityEnabled
                ? `-- Note Velocity: ON --\n`
                : `-- Note Velocity: OFF --\n`;

            output += sustainEnabled
                ? `-- Sustain Pedal: ON --\n`
                : `-- Sustain Pedal: OFF --\n`;

            output += midiSpoofEnabled
                ? `-- Midi Spoofer: ON (this script will only work in "Piano Rooms!") --\n`
                : `-- Midi Spoofer: OFF --\n`;

            output += `\nbpm = ${bpmInput}\n\n`;

            if (midiSpoofEnabled) {
                output +=
                    `loadstring(game:HttpGet("https://raw.githubusercontent.com/Linh-1205/autopiano/refs/heads/main/midi_spoof_loader.lua", true))()\n\n`;
            } else {
                output +=
                    `loadstring(game:HttpGet("https://raw.githubusercontent.com/Linh-1205/autopiano/refs/heads/main/loader_main.lua", true))()\n\n`;
            }

            // =================================================
            // COLLECT ALL MIDI NOTES
            // =================================================

            const notes = [];
            const pedalEvents = [];

            let originalNoteCount = 0;

            midi.tracks.forEach((track, trackIndex) => {
                const realTrackIndex =
                    getTrackIndex(track, trackIndex);

                // ---------------------------------------------
                // NOTES
                // ---------------------------------------------

                if (Array.isArray(track.notes)) {
                    track.notes.forEach((note, noteIndex) => {
                        originalNoteCount++;

                        const time = safeNumber(note.time, 0);
                        const duration = Math.max(
                            0,
                            safeNumber(note.duration, 0)
                        );

                        const velocity = Math.max(
                            0,
                            Math.min(
                                1,
                                safeNumber(note.velocity, 0.5)
                            )
                        );

                        const midiNumber =
                            getNoteNumber(note);

                        notes.push({
                            id: `${realTrackIndex}:${noteIndex}`,
                            track: realTrackIndex,
                            midi: midiNumber,
                            time,
                            duration,
                            velocity,
                            name: note.name,
                            type: "note"
                        });
                    });
                }

                // ---------------------------------------------
                // SUSTAIN PEDAL
                // ---------------------------------------------

                if (
                    sustainEnabled &&
                    track.controlChanges &&
                    track.controlChanges[64]
                ) {
                    track.controlChanges[64].forEach(
                        (cc, ccIndex) => {
                            pedalEvents.push({
                                id: `pedal:${realTrackIndex}:${ccIndex}`,
                                track: realTrackIndex,
                                time: safeNumber(cc.time, 0),
                                value: safeNumber(cc.value, 0),
                                type: "pedal"
                            });
                        }
                    );
                }
            });

            // =================================================
            // SORT NOTES
            // =================================================

            /*
             * IMPORTANT:
             *
             * Sort by:
             *   1. start time
             *   2. MIDI pitch
             *   3. track
             *
             * NEVER sort/deduplicate by keyboard key.
             *
             * Example:
             *
             * MIDI 60 -> "1"
             * MIDI 72 -> "1"
             *
             * These are TWO DIFFERENT MIDI NOTES.
             */

            notes.sort((a, b) => {
                if (a.time !== b.time) {
                    return a.time - b.time;
                }

                if (
                    Number.isFinite(a.midi) &&
                    Number.isFinite(b.midi) &&
                    a.midi !== b.midi
                ) {
                    return a.midi - b.midi;
                }

                if (a.track !== b.track) {
                    return a.track - b.track;
                }

                return a.id.localeCompare(b.id);
            });

            // =================================================
            // REMOVE ONLY TRUE DUPLICATES
            // =================================================

            /*
             * We DO NOT remove:
             *
             * 72 -> 72 -> 72
             *
             * because those can be legitimate repeated notes
             * or tied notes represented as separate MIDI notes.
             *
             * We only remove an exact duplicate when:
             *
             * same track
             * same MIDI pitch
             * same start time
             *
             * appears more than once.
             */

            const uniqueNotes = [];
            const duplicateKeys = new Set();

            for (const note of notes) {
                const timeKey =
                    Math.round(note.time * 1000000);

                const duplicateKey =
                    `${note.track}|${note.midi}|${timeKey}`;

                if (duplicateKeys.has(duplicateKey)) {
                    continue;
                }

                duplicateKeys.add(duplicateKey);
                uniqueNotes.push(note);
            }

            const removedDuplicateCount =
                notes.length - uniqueNotes.length;

            // =================================================
            // SORT PEDALS
            // =================================================

            pedalEvents.sort((a, b) => {
                if (a.time !== b.time) {
                    return a.time - b.time;
                }

                return a.track - b.track;
            });

            // =================================================
            // GROUP EVENTS BY START TIME
            // =================================================

            /*
             * Notes starting almost simultaneously are put
             * into the same event group.
             *
             * IMPORTANT:
             *
             * We group them.
             * We do NOT remove notes inside the group.
             */

            const eventGroups = [];

            function addToTimeGroup(group, event) {
                if (!group) {
                    return false;
                }

                return (
                    Math.abs(group.time - event.time) <=
                    SAME_TIME_TOLERANCE
                );
            }

            // Add notes
            for (const note of uniqueNotes) {
                let group =
                    eventGroups[eventGroups.length - 1];

                if (!addToTimeGroup(group, note)) {
                    group = {
                        time: note.time,
                        notes: [],
                        pedals: []
                    };

                    eventGroups.push(group);
                }

                group.notes.push(note);
            }

            // Add pedals
            for (const pedal of pedalEvents) {
                let targetGroup = null;

                /*
                 * Find the closest existing group.
                 * Since pedal events are usually sparse, a small
                 * linear search is enough here.
                 */

                for (let i = eventGroups.length - 1; i >= 0; i--) {
                    const candidate = eventGroups[i];

                    if (
                        candidate.time <
                        pedal.time - SAME_TIME_TOLERANCE
                    ) {
                        break;
                    }

                    if (
                        Math.abs(
                            candidate.time - pedal.time
                        ) <= SAME_TIME_TOLERANCE
                    ) {
                        targetGroup = candidate;
                        break;
                    }
                }

                if (!targetGroup) {
                    targetGroup = {
                        time: pedal.time,
                        notes: [],
                        pedals: []
                    };

                    eventGroups.push(targetGroup);

                    eventGroups.sort(
                        (a, b) => a.time - b.time
                    );
                }

                targetGroup.pedals.push(pedal);
            }

            // =================================================
            // FINAL EVENT SORT
            // =================================================

            eventGroups.sort(
                (a, b) => a.time - b.time
            );

            // =================================================
            // PROCESS EVENTS
            // =================================================

            let previousTime = 0;
            let lastVelocity = null;

            let outputNoteCount = 0;
            let outputPedalCount = 0;

            for (const group of eventGroups) {
                const currentTime = group.time;

                let timeDeltaSeconds =
                    currentTime - previousTime;

                if (timeDeltaSeconds < 0) {
                    timeDeltaSeconds = 0;
                }

                const timeDeltaBeats =
                    timeDeltaSeconds * secondsToBeats;

                // ---------------------------------------------
                // REST BEFORE THIS EVENT
                // ---------------------------------------------

                if (timeDeltaBeats > 0.00001) {
                    songscript +=
                        `rest(${roundToThree(timeDeltaBeats)}, bpm)\n`;
                }

                // ---------------------------------------------
                // PEDALS
                // ---------------------------------------------

                if (group.pedals.length > 0) {
                    for (const pedal of group.pedals) {
                        if (pedal.value > 0) {
                            songscript += `pedalDown()\n`;
                        } else {
                            songscript += `pedalUp()\n`;
                        }

                        outputPedalCount++;
                    }
                }

                // ---------------------------------------------
                // NOTES
                // ---------------------------------------------

                /*
                 * Sort notes inside a chord by MIDI pitch.
                 *
                 * AGAIN:
                 * We do NOT remove notes because their mapped
                 * keyboard key happens to be identical.
                 */

                group.notes.sort((a, b) => {
                    if (
                        Number.isFinite(a.midi) &&
                        Number.isFinite(b.midi)
                    ) {
                        if (a.midi !== b.midi) {
                            return a.midi - b.midi;
                        }
                    }

                    return a.track - b.track;
                });

                for (const note of group.notes) {
                    let currentKey =
                        noteMap[note.name];

                    /*
                     * Fallback:
                     *
                     * If the note isn't in the selected map,
                     * don't crash the entire conversion.
                     */
                    if (!currentKey) {
                        currentKey = note.name;
                    }

                    // -----------------------------------------
                    // VELOCITY
                    // -----------------------------------------

                    if (velocityEnabled) {
                        const vel =
                            roundToThree(
                                Math.max(
                                    0,
                                    Math.min(
                                        1,
                                        note.velocity
                                    )
                                )
                            );

                        if (
                            lastVelocity === null ||
                            Math.abs(lastVelocity - vel) > 0.0001
                        ) {
                            songscript +=
                                `adjustVelocity(${vel})\n`;

                            lastVelocity = vel;
                        }
                    }

                    // -----------------------------------------
                    // KEYPRESS DURATION
                    // -----------------------------------------

                    let keypressDuration = "x";

                    if (shortNotesEnabled) {
                        const durationBeats =
                            note.duration *
                            secondsToBeats;

                        keypressDuration =
                            roundToThree(
                                Math.max(
                                    0,
                                    durationBeats
                                )
                            );
                    }

                    // -----------------------------------------
                    // OUTPUT NOTE
                    // -----------------------------------------

                    /*
                     * NO lastKey check here.
                     *
                     * This is the most important change.
                     *
                     * Before:
                     *
                     *   C4 -> "t"
                     *   C4 -> "t"
                     *
                     * second note could disappear.
                     *
                     * Now:
                     *
                     *   C4 -> "t"
                     *   C4 -> "t"
                     *
                     * BOTH are emitted.
                     */

                    songscript +=
                        `keypress("${currentKey}", ${keypressDuration}, bpm)\n`;

                    outputNoteCount++;
                }

                previousTime = currentTime;
            }

            // =================================================
            // FINISH
            // =================================================

            songscript += `\nfinishedSong()`;

            outputText.value =
                output +
                songscript;

            // =================================================
            // DEBUG INFORMATION
            // =================================================

            console.log("----------------------------------------");
            console.log("MIDI2LUA-Gau conversion complete");
            console.log("----------------------------------------");

            console.log(
                "Tracks:",
                midi.tracks.length
            );

            console.log(
                "Original MIDI notes:",
                originalNoteCount
            );

            console.log(
                "Exact duplicate notes removed:",
                removedDuplicateCount
            );

            console.log(
                "Notes emitted:",
                outputNoteCount
            );

            console.log(
                "Pedal events emitted:",
                outputPedalCount
            );

            console.log(
                "Event groups:",
                eventGroups.length
            );

            console.log(
                "BPM:",
                bpmInput
            );

            console.log(
                "MIDI88:",
                midi88Enabled
            );

            console.log("----------------------------------------");

            if (
                outputNoteCount +
                removedDuplicateCount !==
                originalNoteCount
            ) {
                console.warn(
                    "WARNING: note count changed unexpectedly."
                );
            }

        } catch (error) {
            console.error(
                "MIDI conversion error:",
                error
            );

            outputText.value =
                "Conversion failed:\n\n" +
                error.message;

            alert(
                "MIDI conversion failed. Check the browser console."
            );
        }
    };

    reader.readAsArrayBuffer(
        fileInput.files[0]
    );
});

// =============================================================
// COPY BUTTON
// =============================================================

document.getElementById("copyButton").addEventListener("click", () => {
    const outputText =
        document.getElementById("output");

    outputText.select();
    document.execCommand("copy");
});
