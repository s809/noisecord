import { CommandCondition, InVoiceChannel } from ".";

export const InVoiceWithBot: CommandCondition = {
    name: "In Voice With a Bot",
    check: msg => msg.member!.voice.channelId === msg.guild!.members.me!.voice.channelId,
    failureMessage: "You must be in a voice channel with a bot to use this command.",
    hideInDescription: true,
    requires: InVoiceChannel
};
