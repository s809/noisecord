import { CommandCondition } from "./index.js";

/** @public */
export const InVoiceChannel: CommandCondition = {
    name: "In Voice Channel",
    check: req => !!req.member?.voice.channelId,
    failureMessage: "You must be in a voice channel to use this command.",
    hideInDescription: true
};
