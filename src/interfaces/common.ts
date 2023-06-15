import { CacheType, ChannelType, CommandInteraction } from "discord.js";

/** @public */
export type AllowDMsCacheType<AllowDMs extends boolean> = InGuildCacheType<AllowDMs extends true ? false : true>;

/** @public */
export type InGuildCacheType<InGuild extends boolean = true> = InGuild extends true ? Exclude<CacheType, undefined> : CacheType;

/** @public */
export type InteractionInGuild<T extends CommandInteraction> = T extends CommandInteraction<InGuildCacheType> ? true : false;

/** @public */
export type AllowDMsInGuild<AllowDMs> = AllowDMs extends true ? boolean : true;

/** @public */
export const textChannels = [
    ChannelType.GuildAnnouncement,
    ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread,
    ChannelType.GuildText
] satisfies ChannelType[];
