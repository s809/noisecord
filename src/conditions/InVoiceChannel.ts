import { CommandCondition } from "./index.js";

export const InVoiceChannel: CommandCondition = {
    key: "In Voice Channel",
    check: req => !!req.member?.voice.channelId,
    hideInDescription: true
};
