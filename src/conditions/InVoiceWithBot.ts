import { InVoiceChannel } from "./InVoiceChannel.js";
import { CommandCondition } from "./index.js";

export const InVoiceWithBot: CommandCondition = {
    key: "In Voice With a Bot",
    check: req => req.member!.voice.channelId === req.guild!.members.me!.voice.channelId,
    hideInDescription: true,
    requires: InVoiceChannel
};
