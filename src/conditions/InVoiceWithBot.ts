import { CommandCondition, InVoiceChannel } from "./index.js";

/** @public */
export const InVoiceWithBot: CommandCondition = {
    name: "In Voice With a Bot",
    check: req => req.member!.voice.channelId === req.guild!.members.me!.voice.channelId,
    failureMessage: "You must be in a voice channel with a bot to use this command.",
    hideInDescription: true,
    requires: InVoiceChannel
};
