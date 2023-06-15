import { CommandCondition } from "./index.js";

export const InVoiceChannel: CommandCondition = {
    key: "in_voice_channel",
    check: req => !!req.member?.voice.channelId,
};
