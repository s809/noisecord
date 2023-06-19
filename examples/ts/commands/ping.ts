import { defineCommand } from "@s809/noisecord";

export default defineCommand({
    key: "ping",
    handler: async req => {
        await req.replyOrEdit("Pong!");
    }
});
