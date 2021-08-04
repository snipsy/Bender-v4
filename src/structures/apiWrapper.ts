import * as CONSTANTS from '../data/constants.json';
import * as superagent from 'superagent';
//import Client from './client';
import * as types from './types';

const AUTH_HEADER: types.RequestHeaders = { authorization: `Bot ${process.env.TOKEN}` };

export default class APIWrapper {
    /*client: Client;

    constructor(client: Client) {
        this.client = client;
    }*/

    static reformatResponse(response_data: superagent.Response) {
        return response_data;
    }

    static addReasonHeader(headers: types.RequestHeaders, reason?: string): types.RequestHeaders {
        if (reason) {
            headers['X-Audit-Log-Reason'] = reason;
        }
        return headers;
    }

    static async makeRequest<ResponseType>(method: string, path: string, options: types.RequestOptions): types.RequestResponse<ResponseType> {
        path = CONSTANTS.API_BASE + path;
        const request = superagent(method.toLowerCase(), path);
        if (options.data)
            request.send(options.data);
        if (options.headers)
            request.set(options.headers);
        if (options.query)
            request.query(options.query);
        return request.retry(options.retries || 3).timeout({
            response: options.responseTimeout || 60000,
            deadline: options.deadlineTimeout || 120000
        }).then(APIWrapper.reformatResponse, (err: Error) => {
            console.error(err);
            // TODO: handle error properly
            return err;
        });
    }

    static guild = {
        async fetch(guild_id: types.Snowflake, with_counts = true) {
            return APIWrapper.makeRequest<types.Guild>('GET', `/guilds/${guild_id}`, { 
                query: { with_counts },
                headers: AUTH_HEADER
            });
        },
        async edit(guild_id: types.Snowflake, guild_data: types.GuildData, reason?: string) {
            return APIWrapper.makeRequest<types.Guild>('PATCH', `/guilds/${guild_id}`, { 
                data: guild_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async fetchPruneCount(guild_id: types.Snowflake, prune_count_data: types.PruneCountData) {
            return APIWrapper.makeRequest<types.PruneResult>('GET', `/guilds/${guild_id}/prune`, { 
                query: prune_count_data,
                headers: AUTH_HEADER
            });
        },
        async prune(guild_id: types.Snowflake, prune_data: types.PruneData, reason?: string) {
            return APIWrapper.makeRequest<types.PruneResult>('GET', `/guilds/${guild_id}/prune`, { 
                query: prune_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async fetchRegions(guild_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.VoiceRegion[]>('GET', `/guilds/${guild_id}/regions`, { 
                headers: AUTH_HEADER
            });
        }
    }

    static ban = {
        async fetch(guild_id: types.Snowflake, user_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Ban>('GET', `/guilds/${guild_id}/bans/${user_id}`, { 
                headers: AUTH_HEADER
            });
        },
        async list(guild_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Ban[]>('GET', `/guilds/${guild_id}/bans`, { 
                headers: AUTH_HEADER
            });
        },
        async create(guild_id: types.Snowflake, user_id: types.Snowflake, delete_message_days = 0, reason?: string) {
            return APIWrapper.makeRequest<null>('PUT', `/guilds/${guild_id}/bans/${user_id}`, { 
                data: { delete_message_days },
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async delete(guild_id: types.Snowflake, user_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/guilds/${guild_id}/bans/${user_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        }
    }

    static role = {
        async list(guild_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Role[]>('GET', `/guilds/${guild_id}/roles`, {
                headers: AUTH_HEADER
            });
        },
        async create(guild_id: types.Snowflake, role_data: types.RoleData, reason?: string) {
            return APIWrapper.makeRequest<types.Role>('POST', `/guilds/${guild_id}/roles`, {
                data: role_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async edit(guild_id: types.Snowflake, role_id: types.Snowflake, role_data: types.RoleData, reason?: string) {
            return APIWrapper.makeRequest<types.Role>('PATCH', `/guilds/${guild_id}/roles/${role_id}`, {
                data: role_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async delete(guild_id: types.Snowflake, role_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/guilds/${guild_id}/roles/${role_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async setPositions(guild_id: types.Snowflake, role_position_data: Array<types.RolePositionData>, reason?: string) {
            return APIWrapper.makeRequest<types.Role[]>('PATCH', `/guilds/${guild_id}/roles`, {
                data: role_position_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        }
    }

    static member = {
        async fetch(guild_id: types.Snowflake, user_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Member>('GET', `/guilds/${guild_id}/members/${user_id}`, {
                headers: AUTH_HEADER
            });
        },
        async list(guild_id: types.Snowflake, limit = 1000, after?: types.Snowflake | undefined) {
            return APIWrapper.makeRequest<types.Member[]>('GET', `/guilds/${guild_id}/members`, { 
                query: { after, limit },
                headers: AUTH_HEADER
            });
        },
        async addRole(guild_id: types.Snowflake, user_id: types.Snowflake, role_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<null>('PUT', `/guilds/${guild_id}/members/${user_id}/roles/${role_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async deleteRole(guild_id: types.Snowflake, user_id: types.Snowflake, role_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/guilds/${guild_id}/members/${user_id}/roles/${role_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async setRoles(guild_id: types.Snowflake, user_id: types.Snowflake, role_id_array: Array<types.Snowflake>, reason?: string) {
            return this.edit(guild_id, user_id, { roles: role_id_array }, reason);
        },
        async edit(guild_id: types.Snowflake, user_id: types.Snowflake, member_data: types.MemberData, reason?: string) {
            return APIWrapper.makeRequest<types.Member>('PATCH', `/guilds/${guild_id}/members/${user_id}`, { 
                data: member_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async setSelfNick(guild_id: types.Snowflake, nick: string | null, reason?: string) {
            return APIWrapper.makeRequest<string>('PATCH', `/guilds/${guild_id}/members/@me/nick`, { 
                data: { nick },
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async kick(guild_id: types.Snowflake, user_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/guilds/${guild_id}/members/${user_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        }
    }

    static emoji = {
        async list(guild_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Emoji[]>('GET', `/guilds/${guild_id}/emojis`, {
                headers: AUTH_HEADER
            });
        },
        async fetch(guild_id: types.Snowflake, emoji_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Emoji>('GET', `/guilds/${guild_id}/emojis/${emoji_id}`, {
                headers: AUTH_HEADER
            });
        },
        async create(guild_id: types.Snowflake, emoji_data: types.EmojiCreateData, reason?: string) {
            return APIWrapper.makeRequest<types.Emoji>('POST', `/guilds/${guild_id}/emojis`, {
                data: emoji_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async edit(guild_id: types.Snowflake, emoji_id: types.Snowflake, emoji_data: types.EmojiEditData, reason?: string) {
            return APIWrapper.makeRequest<types.Emoji>('PATCH', `/guilds/${guild_id}/emojis/${emoji_id}`, {
                data: emoji_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
    }

    static user = {
        async fetch(user_id: types.SnowflakeOrMe) {
            return APIWrapper.makeRequest<types.User>('GET', `/users/${user_id}`, {
                headers: AUTH_HEADER
            });
        },
        async fetchSelf() {
            return this.fetch("@me");
        },
        async send(user_id: types.Snowflake, message_data: types.MessageData) {
            // TODO: check channel cache for DM with this user
            // if not create it as below
            await APIWrapper.makeRequest<types.DMChannel>('POST', `/users/@me/channels`, {
                data: { recipient_id: user_id },
                headers: AUTH_HEADER
            });
            // TODO: handle the error or collect the channel ID above
            const channelID: types.Snowflake = '00000000000000000000';
            return APIWrapper.message.create(channelID, message_data);
        },
        async modifySelf(user_data: types.UserData) {
            return APIWrapper.makeRequest<types.User>('PATCH', `/users/@me`, { 
                data: user_data,
                headers: AUTH_HEADER
            });
        }
    }

    static channel = {
        async fetch(channel_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Channel>('GET', `/channels/${channel_id}`, { 
                headers: AUTH_HEADER
            });
        },
        async edit(channel_id: types.Snowflake, channel_data: types.ChannelData, reason?: string) {
            return APIWrapper.makeRequest<types.Channel>('PATCH', `/channels/${channel_id}`, {
                data: channel_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async delete(channel_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<types.Channel>('DELETE', `/channels/${channel_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async setOverwrite(channel_id: types.Snowflake, overwrite_id: types.Snowflake, overwrite_data: types.PermissionOverwrites, reason?: string) {
            return APIWrapper.makeRequest<types.GuildChannel>('PUT', `/channels/${channel_id}/permissions/${overwrite_id}`, {
                data: overwrite_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async deleteOverwrite(channel_id: types.Snowflake, overwrite_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<types.GuildChannel>('DELETE', `/channels/${channel_id}/permissions/${overwrite_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async setPositions(guild_id: types.Snowflake, channel_position_data: Array<types.ChannelPositionData>, reason?: string) {
            return APIWrapper.makeRequest<null>('PATCH', `/guilds/${guild_id}/channels`, {
                data: channel_position_data,
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        }
    }

    static voice = {
        async move(guild_id: types.Snowflake, user_id: types.Snowflake, new_channel_id: types.Snowflake) {
            return APIWrapper.member.edit(guild_id, user_id, { channel_id: new_channel_id });
        },
        async kick(guild_id: types.Snowflake, user_id: types.Snowflake) {
            return APIWrapper.member.edit(guild_id, user_id, { channel_id: null });
        },
        async fetchRegions() {
            return APIWrapper.makeRequest<types.VoiceRegion[]>('GET', `/voice/regions`, {
                headers: AUTH_HEADER
            });
        }
    }

    static message = {
        async fetchMany(channel_id: types.Snowflake, fetch_data: types.MessageFetchData) {
            return APIWrapper.makeRequest<types.Message[]>('GET', `/channels/${channel_id}/messages`, {
                query: fetch_data,
                headers: AUTH_HEADER
            });
        },
        async fetch(channel_id: types.Snowflake, message_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Message>('GET', `/channels/${channel_id}/messages/${message_id}`, {
                headers: AUTH_HEADER
            });
        },
        async create(channel_id: types.Snowflake, message: types.MessageData) {
            return APIWrapper.makeRequest<types.Message>('POST', `/channels/${channel_id}/messages`, {
                data: message,
                headers: AUTH_HEADER
            });
        },
        async edit(channel_id: types.Snowflake, message_id: types.Snowflake, message_data: types.MessageData) {
            return APIWrapper.makeRequest<types.Message>('PATCH', `/channels/${channel_id}/messages/${message_id}`, {
                data: message_data,
                headers: AUTH_HEADER
            });
        },
        async delete(channel_id: types.Snowflake, message_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/channels/${channel_id}/messages/${message_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async deleteMany(channel_id: types.Snowflake, message_ids: Array<types.Snowflake>, reason?: string) {
            return APIWrapper.makeRequest<null>('POST', `/channels/${channel_id}/messages/bulk-delete`, {
                data: { messages: message_ids },
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        }
    }

    static reaction = {
        async create(channel_id: types.Snowflake, message_id: types.Snowflake, emoji_identifier: string) {
            return APIWrapper.makeRequest<null>('PUT', `/channels/${channel_id}/messages/${message_id}/reactions/${emoji_identifier}/@me`, {
                headers: AUTH_HEADER
            });
        },
        async listUsers(channel_id: types.Snowflake, message_id: types.Snowflake, emoji_identifier: string, fetch_data: types.ReactionFetchData) {
            return APIWrapper.makeRequest<types.User[]>('GET', `/channels/${channel_id}/messages/${message_id}/reactions/${emoji_identifier}`, {
                query: fetch_data,
                headers: AUTH_HEADER
            });
        },
        async deleteSelf(channel_id: types.Snowflake, message_id: types.Snowflake, emoji_identifier: string, reason?: string) {
            return this.delete(channel_id, message_id, emoji_identifier, '@me', reason);
        },
        async delete(channel_id: types.Snowflake, message_id: types.Snowflake, emoji_identifier: string, user_id: types.SnowflakeOrMe, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/channels/${channel_id}/messages/${message_id}/reactions/${emoji_identifier}/${user_id}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async deleteEmoji(channel_id: types.Snowflake, message_id: types.Snowflake, emoji_identifier: string, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/channels/${channel_id}/messages/${message_id}/reactions/${emoji_identifier}`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        },
        async deleteAll(channel_id: types.Snowflake, message_id: types.Snowflake, reason?: string) {
            return APIWrapper.makeRequest<null>('DELETE', `/channels/${channel_id}/messages/${message_id}/reactions`, {
                headers: APIWrapper.addReasonHeader(AUTH_HEADER, reason)
            });
        }
    }

    static globalCommand = {
        async list(application_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Command[]>('GET', `/applications/${application_id}/commands`, {
                headers: AUTH_HEADER
            });
        },
        async create(application_id: types.Snowflake, command: types.CommandData) {
            return APIWrapper.makeRequest<types.Command>('POST', `/applications/${application_id}/commands`, {
                headers: AUTH_HEADER,
                data: command
            });
        },
        async get(application_id: types.Snowflake, command_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Command>('GET', `/applications/${application_id}/commands/${command_id}`, {
                headers: AUTH_HEADER
            });
        },
        async edit(application_id: types.Snowflake, command_id: types.Snowflake, command_data: types.CommandData) {
            return APIWrapper.makeRequest<types.Command>('PATCH', `/applications/${application_id}/commands/${command_id}`, {
                headers: AUTH_HEADER,
                data: command_data
            });
        },
        async delete(application_id: types.Snowflake, command_id: types.Snowflake) {
            return APIWrapper.makeRequest<null>('DELETE', `/applications/${application_id}/commands/${command_id}`, {
                headers: AUTH_HEADER
            });
        }
    }

    static guildCommand = {
        async list(application_id: types.Snowflake, guild_id: types.Snowflake) {
            return APIWrapper.makeRequest<types.Command[]>('GET', `/applications/${application_id}/guilds/${guild_id}/commands`, {
                headers: AUTH_HEADER
            });
        },
    }

    static interaction = {
        async respond(interaction_id: types.Snowflake, interaction_token: string, interaction_response: types.InteractionResponse) {
            return APIWrapper.makeRequest<>('POST', `/interactions/${interaction_id}/${interaction_token}/callback`, {
                headers: AUTH_HEADER,
                data: interaction_response
            });
        },
    }
}