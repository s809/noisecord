import { CommandCondition } from ".";

export const InVoiceChannel: CommandCondition = {
    name: "In Voice Channel",
    check: msg => !!msg.member?.voice.channelId,
    failureMessage: "You must be in a voice channel to use this command.",
    hideInDescription: true
};
