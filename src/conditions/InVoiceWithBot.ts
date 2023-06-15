import { InVoiceChannel } from "./InVoiceChannel.js";
import { CommandCondition } from "./index.js";

export const InVoiceWithBot: CommandCondition = {
    key: "in_voice_with_bot",
    check: req => req.member!.voice.channelId === req.guild!.members.me!.voice.channelId,
    requires: InVoiceChannel
};
