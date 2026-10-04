document.getElementById("convertButton").addEventListener("click", async () => {
    console.log("MIDI2LUA-Gau v3.0 - KEEP ALL NOTES");

    const fileInput = document.getElementById("midiFile");
    const outputText = document.getElementById("output");

    outputText.value = "converting...";

    if (!fileInput.files.length) {
        alert("Please upload a MIDI file.");
        return;
    }

    let bpmInput = document.getElementById("bpmInput").value;

    let noteMap = {};

    if (!document.getElementById("midi88Checkbox").checked) {
        noteMap = {
            "A0": "1", "A#0": "2", "Bb0": "2", "B0": "3",

            "C1": "1", "C#1": "!", "Db1": "!",
            "D1": "2", "D#1": "@", "Eb1": "@",
            "E1": "3", "F1": "4", "F#1": "$", "Gb1": "$",
            "G1": "5", "G#1": "%", "Ab1": "%",
            "A1": "6", "A#1": "^", "Bb1": "^", "B1": "7",

            "C2": "1", "C#2": "!", "Db2": "!",
            "D2": "2", "D#2": "@", "Eb2": "@",
            "E2": "3", "F2": "4", "F#2": "$", "Gb2": "$",
            "G2": "5", "G#2": "%", "Ab2": "%",
            "A2": "6", "A#2": "^", "Bb2": "^", "B2": "7",

            "C3": "8", "C#3": "*", "Db3": "*",
            "D3": "9", "D#3": "(", "Eb3": "(",
            "E3": "0", "F3": "q", "F#3": "Q", "Gb3": "Q",
            "G3": "w", "G#3": "W", "Ab3": "W",
            "A3": "e", "A#3": "E", "Bb3": "E", "B3": "r",

            "C4": "t", "C#4": "T", "Db4": "T",
            "D4": "y", "D#4": "Y", "Eb4": "Y",
            "E4": "u", "F4": "i", "F#4": "I", "Gb4": "I",
            "G4": "o", "G#4": "O", "Ab4": "O",
            "A4": "p", "A#4": "P", "Bb4": "P", "B4": "a",

            "C5": "s", "C#5": "S", "Db5": "S",
            "D5": "d", "D#5": "D", "Eb5": "D",
            "E5": "f", "F5": "g", "F#5": "G", "Gb5": "G",
            "G5": "h", "G#5": "H", "Ab5": "H",
            "A5": "j", "A#5": "J", "Bb5": "J", "B5": "k",

            "C6": "l", "C#6": "L", "Db6": "L",
            "D6": "z", "D#6": "Z", "Eb6": "Z",
            "E6": "x", "F6": "c", "F#6": "C", "Gb6": "C",
            "G6": "v", "G#6": "V", "Ab6": "V",
            "A6": "b", "A#6": "B", "Bb6": "B", "B6": "n",

            "C7": "m", "C#7": "L", "Db7": "L",
            "D7": "z", "D#7": "Z", "Eb7": "Z",
            "E7": "x", "F7": "c", "F#7": "C", "Gb7": "C",
            "G7": "v", "G#7": "V", "Ab7": "V",
            "A7": "b", "A#7": "B", "Bb7": "B", "B7": "n",

            "C8": "j"
        };
    } else {
        noteMap = {
            "A0": "Ctrl+1", "A#0": "Ctrl+2", "Bb0": "Ctrl+2",
            "B0": "Ctrl+3",

            "C1": "Ctrl+4", "C#1": "Ctrl+5", "Db1": "Ctrl+5",
            "D1": "Ctrl+6", "D#1": "Ctrl+7", "Eb1": "Ctrl+7",
            "E1": "Ctrl+8", "F1": "Ctrl+9",
            "F#1": "Ctrl+0", "Gb1": "Ctrl+0",
            "G1": "Ctrl+q", "G#1": "Ctrl+w", "Ab1": "Ctrl+w",
            "A1": "Ctrl+e", "A#1": "Ctrl+r", "Bb1": "Ctrl+r",
            "B1": "Ctrl+t",

            "C2": "1", "C#2": "!", "Db2": "!",
            "D2": "2", "D#2": "@", "Eb2": "@",
            "E2": "3", "F2": "4", "F#2": "$", "Gb2": "$",
            "G2": "5", "G#2": "%", "Ab2": "%",
            "A2": "6", "A#2": "^", "Bb2": "^", "B2": "7",

            "C3": "8", "C#3": "*", "Db3": "*",
            "D3": "9", "D#3": "(", "Eb3": "(",
            "E3": "0", "F3": "q", "F#3": "Q", "Gb3": "Q",
            "G3": "w", "G#3": "W", "Ab3": "W",
            "A3": "e", "A#3": "E", "Bb3": "E", "B3": "r",

            "C4": "t", "C#4": "T", "Db4": "T",
            "D4": "y", "D#4": "Y", "Eb4": "Y",
            "E4": "u", "F4": "i", "F#4": "I", "Gb4": "I",
            "G4": "o", "G#4": "O", "Ab4": "O",
            "A4": "p", "A#4": "P", "Bb4": "P", "B4": "a",

            "C5": "s", "C#5": "S", "Db5": "S",
            "D5": "d", "D#5": "D", "Eb5": "D",
            "E5": "f", "F5": "g", "F#5": "G", "Gb5": "G",
            "G5": "h", "G#5": "H", "Ab5": "H",
            "A5": "j", "A#5": "J", "Bb5": "J", "B5": "k",

            "C6": "l", "C#6": "L", "Db6": "L",
            "D6": "z", "D#6": "Z", "Eb6": "Z",
            "E6": "x", "F6": "c", "F#6": "C", "Gb6": "C",
            "G6": "v", "G#6": "V", "Ab6": "V",
            "A6": "b", "A#6": "B", "Bb6": "B", "B6": "n",

            "C7": "m", "C#7": "M", "Db7": "M",
            "D7": "Ctrl+u",
            "D#7": "Ctrl+i", "Eb7": "Ctrl+i",
            "E7": "Ctrl+o",
            "F7": "Ctrl+p",
            "F#7": "Ctrl+a", "Gb7": "Ctrl+a",
            "G7": "Ctrl+s",
            "G#7": "Ctrl+d", "Ab7": "Ctrl+d",
            "A7": "Ctrl+f",
            "A#7": "Ctrl+g", "Bb7": "Ctrl+g",
            "B7": "Ctrl+h",

            "C8": "Ctrl+j"
        };
    }

    function roundToThree(num) {
        return Math.round(num * 1000) / 1000;
    }

    let songscript = "";
    let output = "";

    const reader = new FileReader();

    reader.onload = async (event) => {
        try {
            const midiData = new Uint8Array(event.target.result);
            const midi = new Midi(midiData);

            console.log("MIDI loaded successfully.");
            console.log("Tracks:", midi.tracks.length);

            /*
             * ============================================================
             * BPM
             * ============================================================
             */

            const detectedBpm = midi.header.tempos[0]?.bpm;

            if (document.getElementById("detectBpmCheckbox").checked) {
                if (detectedBpm) {
                    bpmInput = Math.round(detectedBpm);
                } else {
                    bpmInput = 120;
                }
            }

            let bpm = parseFloat(bpmInput);

            if (!Number.isFinite(bpm) || bpm <= 0) {
                bpm = detectedBpm || 120;
                bpmInput = Math.round(bpm);
            }

            const multBy = bpm / 60;

            /*
             * ============================================================
             * HEADER
             * ============================================================
             */

            output += `-- Generated by MIDI2LUA-Gau --\n`;

            if (document.getElementById("midi88Checkbox").checked) {
                output += `-- MIDI88: ON --\n`;
            } else {
                output += `-- MIDI88: OFF --\n`;
            }

            if (document.getElementById("shortNotesCheckbox").checked) {
                output += `-- Short Notes: ON --\n`;
            } else {
                output += `-- Short Notes: OFF --\n`;
            }

            if (document.getElementById("velocityCheckbox").checked) {
                output += `-- Note Velocity: ON --\n`;
            } else {
                output += `-- Note Velocity: OFF --\n`;
            }

            if (document.getElementById("sustainPedalCheckBox").checked) {
                output += `-- Sustain Pedal: ON --\n`;
            } else {
                output += `-- Sustain Pedal: OFF --\n`;
            }

            if (document.getElementById("midiSpoofCheckbox").checked) {
                output += `-- Midi Spoofer: ON (this script will only work in "Piano Rooms!") --\n`;
            } else {
                output += `-- Midi Spoofer: OFF --\n`;
            }

            output += `\nbpm = ${bpmInput}\n\n`;

            if (document.getElementById("midiSpoofCheckbox").checked) {
                output += `loadstring(game:HttpGet("https://raw.githubusercontent.com/Linh-1205/autopiano/refs/heads/main/midi_spoof_loader.lua", true))()\n\n`;
            } else {
                output += `loadstring(game:HttpGet("https://raw.githubusercontent.com/Linh-1205/autopiano/refs/heads/main/loader_main.lua", true))()\n\n`;
            }

            /*
             * ============================================================
             * COLLECT EVENTS
             * ============================================================
             *
             * IMPORTANT:
             * We intentionally DO NOT use lastKey.
             *
             * If MIDI contains:
             *
             *   72 ON
             *   72 OFF
             *   72 ON
             *   72 OFF
             *   72 ON
             *
             * these are three separate attacks and must become:
             *
             *   keypress("^", ...)
             *   keypress("^", ...)
             *   keypress("^", ...)
             *
             * No duplicate-note filtering is performed.
             */

            let notesByTime = [];
            let pedalEvents = [];

            midi.tracks.forEach((track, trackIndex) => {

                track.notes.forEach((note, noteIndex) => {

                    notesByTime.push({
                        time: Number(note.time) || 0,
                        name: note.name,
                        midi: note.midi,
                        duration: Number(note.duration) || 0,
                        velocity: Number(note.velocity) || 0.5,
                        type: "note",

                        // Keep track/index only for stable ordering.
                        trackIndex: trackIndex,
                        noteIndex: noteIndex
                    });
                });

                if (
                    document.getElementById("sustainPedalCheckBox").checked &&
                    track.controlChanges &&
                    track.controlChanges[64]
                ) {
                    track.controlChanges[64].forEach((cc, ccIndex) => {

                        pedalEvents.push({
                            time: Number(cc.time) || 0,
                            value: Number(cc.value) || 0,
                            type: "pedal",

                            trackIndex: trackIndex,
                            noteIndex: ccIndex
                        });
                    });
                }
            });

            /*
             * ============================================================
             * SORT EVENTS
             * ============================================================
             *
             * Same-time notes are kept together.
             *
             * We do NOT remove duplicates.
             */

            let allEvents = [
                ...notesByTime,
                ...pedalEvents
            ];

            allEvents.sort((a, b) => {

                const timeDifference = a.time - b.time;

                if (Math.abs(timeDifference) > 0.000001) {
                    return timeDifference;
                }

                /*
                 * At exactly the same time:
                 *
                 * notes before pedal events
                 * then original track/index order.
                 */

                if (a.type !== b.type) {
                    return a.type === "note" ? -1 : 1;
                }

                if (a.trackIndex !== b.trackIndex) {
                    return a.trackIndex - b.trackIndex;
                }

                return a.noteIndex - b.noteIndex;
            });

            /*
             * ============================================================
             * CONVERSION
             * ============================================================
             */

            let lastEventTime = 0;
            let lastVel = null;

            let emittedNotes = 0;
            let emittedPedals = 0;

            allEvents.forEach((event) => {

                /*
                 * Time between this event and the previous event.
                 *
                 * Important:
                 * We use START TIME, not duration.
                 */

                let timeDelta = roundToThree(
                    (event.time - lastEventTime) * multBy
                );

                /*
                 * Avoid negative rests caused by tiny floating-point
                 * differences.
                 */

                if (timeDelta < 0) {
                    timeDelta = 0;
                }

                if (timeDelta > 0) {
                    songscript += `rest(${timeDelta}, bpm)\n`;
                }

                /*
                 * ========================================================
                 * PEDAL
                 * ========================================================
                 */

                if (event.type === "pedal") {

                    if (event.value > 0) {
                        songscript += `pedalDown()\n`;
                    } else {
                        songscript += `pedalUp()\n`;
                    }

                    emittedPedals++;
                }

                /*
                 * ========================================================
                 * NOTE
                 * ========================================================
                 */

                else if (event.type === "note") {

                    const currentKey =
                        noteMap[event.name] !== undefined
                            ? noteMap[event.name]
                            : event.name;

                    /*
                     * Velocity
                     */

                    let vel = roundToThree(
                        Number(event.velocity)
                    );

                    if (!Number.isFinite(vel) || vel <= 0) {
                        vel = 0.5;
                    }

                    if (
                        document.getElementById("velocityCheckbox").checked &&
                        lastVel !== vel
                    ) {
                        songscript += `adjustVelocity(${vel})\n`;
                        lastVel = vel;
                    }

                    /*
                     * Duration
                     *
                     * shortNotesCheckbox ON:
                     *     use actual MIDI note duration.
                     *
                     * OFF:
                     *     use x, preserving original behavior.
                     */

                    let keypressDuration = "x";

                    if (
                        document.getElementById("shortNotesCheckbox").checked
                    ) {
                        keypressDuration = roundToThree(
                            event.duration * multBy
                        );

                        /*
                         * Prevent a zero-length keypress caused by
                         * extremely tiny MIDI durations.
                         */

                        if (keypressDuration <= 0) {
                            keypressDuration = 0.001;
                        }
                    }

                    /*
                     * ====================================================
                     * IMPORTANT:
                     *
                     * NO:
                     *
                     *     if (currentKey !== lastKey)
                     *
                     * Because that was the thing deleting repeated notes.
                     *
                     * Every MIDI note becomes one keypress.
                     * ====================================================
                     */

                    songscript +=
                        `keypress("${currentKey}", ${keypressDuration}, bpm)\n`;

                    emittedNotes++;
                }

                /*
                 * Always move the event clock forward to THIS EVENT'S
                 * start time.
                 */

                lastEventTime = event.time;
            });

            /*
             * ============================================================
             * FINISH
             * ============================================================
             */

            songscript += `\nfinishedSong()`;

            outputText.value = output + songscript;

            /*
             * ============================================================
             * DEBUG INFO
             * ============================================================
             */

            console.log("--------------------------------");
            console.log("MIDI2LUA-Gau conversion complete");
            console.log("BPM:", bpm);
            console.log("Total MIDI note events:", notesByTime.length);
            console.log("Notes emitted:", emittedNotes);
            console.log("Pedal events emitted:", emittedPedals);
            console.log("Total events:", allEvents.length);
            console.log("--------------------------------");

        } catch (error) {

            console.error("MIDI conversion error:", error);

            outputText.value =
                "Error while converting MIDI:\n\n" +
                error.message;

            alert(
                "MIDI conversion failed. Check the browser console for details."
            );
        }
    };

    reader.onerror = () => {
        outputText.value = "Failed to read MIDI file.";
        alert("Failed to read MIDI file.");
    };

    reader.readAsArrayBuffer(fileInput.files[0]);
});


/*
 * ============================================================
 * COPY BUTTON
 * ============================================================
 */

document.getElementById("copyButton").addEventListener("click", () => {

    const outputText = document.getElementById("output");

    outputText.select();
    outputText.setSelectionRange(0, 999999);

    try {
        document.execCommand("copy");
    } catch (error) {
        console.error("Copy failed:", error);
    }
});
