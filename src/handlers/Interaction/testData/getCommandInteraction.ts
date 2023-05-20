import { BitField, MessageFlags, CommandInteraction } from "discord.js";
import sinon from "sinon";

export function getCommandInteraction(manualResolve: ("deferReply" | "reply" | "followUp" | "deleteReply")[] = []) {
    let deferred = false;
    let replied = false;
    let deleted = false;

    let resolveDeferReply: (value: unknown) => void;
    let resolveReply: (value: unknown) => void;
    let resolveFollowUp: (value: unknown) => void;
    let resolveDeleteReply: (value: unknown) => void;

    let replyMessage = {
        flags: new BitField(MessageFlags.Loading)
    };

    return {
        interaction: {
            get deferred() {
                return deferred;
            },
            get replied() {
                return replied;
            },
            deferReply: sinon.stub().callsFake(async () => {
                if (deferred) throw new Error("Already deferred");
                if (replied) throw new Error("Cannot defer after reply");

                if (manualResolve.includes("deferReply"))
                    await new Promise(resolve => resolveDeferReply = resolve);
                deferred = true;

                return replyMessage = {
                    flags: new BitField(MessageFlags.Loading)
                };
            }),
            reply: sinon.stub().callsFake(async ({ fetchReply }) => {
                if (!fetchReply) throw new Error("No fetchReply");

                if (deferred) throw new Error("Cannot reply after defer");
                if (replied) throw new Error("Already replied");

                if (manualResolve.includes("reply"))
                    await new Promise(resolve => resolveReply = resolve);
                replied = true;

                return replyMessage = {
                    flags: new BitField()
                };
            }),
            editReply: sinon.stub().callsFake(async () => {
                if (!replied) throw new Error("Not replied");
                return replyMessage;
            }),
            followUp: sinon.stub().callsFake(async () => {
                if (!deferred) throw new Error("Not deferred");
                if (replied) throw new Error("Already replied");
                if (!replyMessage.flags.has(MessageFlags.Loading)) throw new Error("Already followed up");

                if (manualResolve.includes("followUp"))
                    await new Promise(resolve => resolveFollowUp = resolve);

                return replyMessage = {
                    flags: new BitField()
                };
            }),
            deleteReply: sinon.stub().callsFake(async () => {
                if (!deferred && !replied) throw new Error("Not replied or deferred");
                if (deleted) throw new Error("Already deleted");

                if (manualResolve.includes("deleteReply"))
                    await new Promise(resolve => resolveDeleteReply = resolve);
                deleted = true;
            }),
            fetchReply: sinon.stub().callsFake(async () => {
                if (!deferred && !replied) throw new Error("Not replied or deferred");
                if (deleted) throw new Error("Deleted");

                return replyMessage;
            }),
        } as unknown as CommandInteraction,
        get resolveDeferReply() {
            return resolveDeferReply;
        },
        get resolveReply() {
            return resolveReply;
        },
        get resolveFollowUp() {
            return resolveFollowUp;
        },
        get resolveDeleteReply() {
            return resolveDeleteReply;
        }
    }
};