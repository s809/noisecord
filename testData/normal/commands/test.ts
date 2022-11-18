import { CommandMessage } from "../../../CommandMessage";
import { CommandDefinition } from "../../../definitions";

async function test(msg: CommandMessage) {
    return "poof";
}

const command: CommandDefinition = {
    key: "test",
    usableAsAppCommand: true,
    handler: test
};
export default command;