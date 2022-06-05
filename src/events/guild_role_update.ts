import { EventHandler } from "../data/types";
import { GuildRoleUpdateData, LowercaseEventName } from "../data/gatewayTypes";
import Bot from "../structures/bot";
import { basename } from "path";

export default class GuildRoleUpdateHandler extends EventHandler {
    constructor(bot: Bot) {
        const filename = basename(__filename, '.js');
        super(filename as LowercaseEventName, bot);
    }

    cacheHandler = (eventData: GuildRoleUpdateData) => {
        this.bot.cache.roles.set(eventData.guild_id, eventData.role);
    }

    handler = (eventData: GuildRoleUpdateData) => {
        // TODO: check if settings are invalid? (may not be needed if agreement/mutes aren't used)
    }
}