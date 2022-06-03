import * as superagent from 'superagent';
import Bot from '../structures/bot';
import { EventName, LowercaseEventName } from './gatewayTypes';
import * as num from './numberTypes';

/************ request types ************/

export type RequestOptions = {
    data?: Record<string, unknown> | unknown[] | GuildData; // added this since GuildData is an interface and can't be indexed properly
    headers?: RequestHeaders;
    query?: Record<string, unknown>;
    retries?: number;
    responseTimeout?: number;
    deadlineTimeout?: number;
};

export type RequestHeaders = Record<string, string>;

export interface TypedResponse<BodyType> extends superagent.Response {
    body: BodyType;
}

export type RequestResponse<ResponseType> = Promise<TypedResponse<ResponseType>>;

export type ResponseError = superagent.ResponseError;

/************ guild types ************/

export type UserData = {
    username?: string;
    avatar?: ImageData | null;
}

export type UserBase = {
    id: Snowflake;
    username: string;
    discriminator: number;
    avatar: string | null;
}

export interface User extends UserBase {
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: Flags;
    premium_type?: num.PREMIUM_TYPES;
    public_flags?: Flags;
}

export type StringPremiumTypes = `${num.PREMIUM_TYPES}`;

export interface UserBaseHash extends DynamicStringMap {
    id: Snowflake;
    username: string;
    discriminator: StringNum;
    avatar: string;
}

export interface UserHash extends UserBaseHash {
    bot?: StringBool;
    system?: StringBool;
    mfa_enabled?: StringBool;
    locale?: string;
    verified?: StringBool;
    email?: string;
    flags?: StringNum;
    premium_type?: StringPremiumTypes;
    public_flags?: StringNum;
}

export type Presence = {
    user: User;
    guild_id: Snowflake;
    status: Status;
    activities: Activity[];
    client_status: ClientStatus;
};

export type Status = "idle" | "dnd" | "online" | "offline";

export type ClientStatus = {
    desktop?: Status;
    mobile?: Status;
    web?: Status;
};

export type Activity = {
    name: string;
    type: num.ACTIVITY_TYPES;
    url?: URL | null;
    created_at: UnixTimestampMillis;
    timestamps?: ActivityTimestamps;
    application_id?: Snowflake;
    details?: string | null;
    state?: string | null;
    emoji?: Emoji | null;
    party?: ActivityParty;
    assets?: ActivityAssets;
    secrets?: ActivitySecrets;
    instance?: boolean;
    flags?: Bitfield;
    buttons?: ActivityButton[];
};

export type ActivityTimestamps = {
    start?: UnixTimestampMillis;
    end?: UnixTimestampMillis;
}
export type ActivityParty = {
    id?: Snowflake; // TODO: Should this be string instead?
    size?: [current_size: number, max_size: number];
}
export type ActivityAssets = {
    large_image?: URL;
    large_text?: string;
    small_image?: URL;
    small_text?: string;
}
export type ActivitySecrets = {
    join?: string;
    spectate?: string;
    match?: string;
}
export type ActivityButton = {
    label: string;
    url: URL;
}

/************ guild types ************/

type GuildDataPartial = Partial<Pick<Guild, 'name' | 'verification_level' | 'default_message_notifications' | 'explicit_content_filter' | 'afk_channel_id' | 'afk_timeout' | 'owner_id' | 'banner' | 'system_channel_id' | 'system_channel_flags' | 'rules_channel_id' | 'public_updates_channel_id' | 'preferred_locale' | 'features' | 'description'>>;

export interface GuildData extends GuildDataPartial {
    icon?: ImageData | null;
    splash?: ImageData | null;
    discovery_splash?: ImageData | null;
}

export type Guild = {
    id: Snowflake;
    name: string;
    icon: string | null;
    splash: string | null;
    discovery_splash: string | null;
    owner_id: Snowflake;
    afk_channel_id: Snowflake | null;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: Snowflake | null;
    verification_level: num.VERIFICATION_LEVELS;
    default_message_notifications: num.MESSAGE_NOTIFICATION_LEVELS;
    explicit_content_filter: num.EXPLICIT_FILTER_LEVELS;
    roles: Role[];
    emojis: Emoji[];
    features: GuildFeature[];
    mfa_level: num.MFA_LEVELS;
    application_id: Snowflake | null;
    system_channel_id: Snowflake | null;
    system_channel_flags: Flags;
    rules_channel_id: Snowflake | null;
    max_presences?: number | null;
    max_members?: number;
    vanity_url_code: string | null;
    description: string | null;
    banner: string | null;
    premium_tier: num.PREMIUM_TIERS;
    premium_subscription_count?: number;
    preferred_locale: string;
    public_updates_channel_id: Snowflake | null;
    max_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    welcome_screen?: WelcomeScreen;
    nsfw_level: num.NSFW_LEVELS;
};

export type UnavailableGuild = {
    id: Snowflake,
    unavailable?: true
}

export type WelcomeScreen = {
    description: string | null;
    welcome_channels: WelcomeChannel[];
}
export type WelcomeChannel = {
    channel_id: Snowflake;
    description: string;
    emoji_id: Snowflake | null;
    emoji_name: string | null;
}

// the following props are only sent in GUILD_CREATE
export interface GatewayGuildBase extends Guild {
    joined_at: Timestamp;
    large: boolean;
    unavailable: boolean;
    member_count: number;
}

// the following props are only sent in GUILD_CREATE
export interface GatewayGuild extends GatewayGuildBase {
    voice_states: VoiceState[];
    members: Member[];
    channels: GuildChannel[];
    threads: ThreadChannel[];
    presences: Presence[];
    stage_instances: StageInstance[];
}

export type StageInstance = {
    id: Snowflake;
    guild_id: Snowflake;
    channel_id: Snowflake;
    topic: string;
    privacy_level: num.STAGE_PRIVACY_LEVELS;
    discoverable_disabled: boolean;
}

// explanation of features: https://canary.discord.com/developers/docs/resources/guild#guild-object-guild-features
export type GuildFeature = "ANIMATED_ICON" | "BANNER" | "COMMERCE" | "COMMUNITY" | "DISCOVERABLE" | "FEATURABLE" | "INVITE_SPLASH" | "MEMBER_VERIFICATION_GATE_ENABLED" | "NEWS" | "PARTNERED" | "PREVIEW_ENABLED" | "VANITY_URL" | "VERIFIED" | "VIP_REGIONS" | "WELCOME_SCREEN_ENABLED" | "TICKETED_EVENTS_ENABLED" | "MONETIZATION_ENABLED" | "MORE_STICKERS" | "THREE_DAY_THREAD_ARCHIVE" | "SEVEN_DAY_THREAD_ARCHIVE" | "PRIVATE_THREADS";

export type VoiceState = {
    guild_id?: Snowflake;
    channel_id: Snowflake | null;
    user_id: Snowflake;
    member?: Member;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
    request_to_speak_timestamp: Timestamp | null;
};

export type Ban = {
    reason: string | null;
    user: User;
};

export type ReactionFetchData = {
    limit: number;
    after?: Snowflake;
}

/****** member prune types ******/

export type PruneResult = {
    pruned: number;
}

export type PruneCountData = {
    days: number,
    include_roles?: Snowflake[];
}

export type PruneData = {
    days: number,
    include_roles?: Snowflake[];
    compute_prune_count: boolean;
}

/****** emoji types ******/

export type Emoji = {
    name: string | null;
    id: Snowflake; // TODO: according to https://discord.com/developers/docs/resources/emoji#emoji-object this is nullable, but I don't see how
    animated?: boolean;
    roles?: Snowflake[];
    user?: User;
    require_colons?: boolean;
    managed?: boolean;
    available?: boolean;
};

export type EmojiCreateData = {
    name: string;
    image: ImageData;
    roles: string[];
}

export type EmojiEditData = {
    name?: string;
    roles?: string[];
}

/****** sticker types ******/

export type Sticker = {
    id: Snowflake;
    pack_id?: Snowflake;
    name: string;
    description: string;
    tags: string;
    asset: ''; // deprecated
    type: num.STICKER_TYPES;
    format_type: num.STICKER_FORMAT_TYPES;
    available?: boolean;
    guild_id?: Snowflake;
    user?: User;
    sort_value?: number;
}

/************ role types ************/

export type Role = {
    id: Snowflake;
    name: string;
    color: number;
    hoist: boolean;
    position: number;
    permissions: Bitfield;
    managed: boolean;
    mentionable: boolean;
    tags?: RoleTags;
}

export type RoleData = {
    name?: string;
    color?: number;
    hoist?: boolean;
    position?: number;
    permissions?: Bitfield;
    managed?: boolean;
    mentionable?: boolean;
}

export type RoleTags = {
    bot_id?: Snowflake;
    integration_id?: Snowflake;
    premium_subscriber?: null;
}

export type RolePositionData = {
    id: Snowflake;
    position?: number | null;
}

/************ member types ************/

export type MemberData = {
    nick?: string;
    roles?: Snowflake[];
    deaf?: boolean;
    mute?: boolean;
    channel_id?: Snowflake | null;
}

export interface PartialMember {
    user?: User; // Not included in MESSAGE_CREATE and MESSAGE_UPDATE member objects
    nick?: string;
    roles: Snowflake[];
    joined_at: Timestamp;
    premium_since?: Timestamp | null;
    pending?: boolean; // member screening, only included in GUILD_* events
    permissions?: Bitfield; // only provided in Interaction objects; includes overwrites
}

export interface Member extends PartialMember {
    user: User;
    deaf: boolean;
    mute: boolean;
}

/************ channel types ************/

// for editing only
export type ChannelData = {
    name?: string;
    nsfw?: boolean;
    rate_limit_per_user?: number;
    bitrate?: number;
    user_limit?: number;
    thread_metadata?: ThreadMeta;
}

export type PartialChannel = {
    id: Snowflake;
    type: num.CHANNEL_TYPES;
    name?: string;
    permission_overwrites?: PermissionOverwrites[];
}

export interface Channel extends PartialChannel {
    // guild fields
    guild_id?: Snowflake;
    position?: number;
    parent_id?: Snowflake | null;

    // dm fields
    recipients?: User[];

    // text fields
    topic?: string | null;
    nsfw: boolean;
    last_message_id?: Snowflake | null;
    rate_limit_per_user?: number;
    last_pin_timestamp?: Timestamp | null;
    default_auto_archive_duration?: number;

    // voice fields
    rtc_region?: VoiceRegion | null;
    bitrate?: number;
    user_limit?: number;
    video_quality_mode?: num.VIDEO_QUALITY_MODES;

    // group dm fields
    owner_id?: Snowflake; // also used in threads
    application_id?: Snowflake;
    icon?: string | null;

    // thread fields
    thread_metadata?: ThreadMeta;
    member?: ThreadMember;
    message_count?: number;
    member_count?: number;
}

export interface GuildChannel extends Channel {
    guild_id: Snowflake;
    position: number;
    recipients: undefined;
}

export interface DMBasedChannel extends Channel {
    type: num.CHANNEL_TYPES.DM | num.CHANNEL_TYPES.GROUP_DM;
    recipients: User[];
    guild_id: undefined;
}

export interface TextBasedChannel extends GuildChannel {
    nsfw: boolean;
}

export interface TextChannel extends TextBasedChannel {
    type: num.CHANNEL_TYPES.GUILD_TEXT;
}

export interface DMChannel extends DMBasedChannel {
    type: num.CHANNEL_TYPES.DM;
    owner_id: undefined;
}

export interface VoiceBasedChannel extends GuildChannel {
    type: num.CHANNEL_TYPES.GUILD_VOICE | num.CHANNEL_TYPES.GUILD_STAGE_VOICE;
    rtc_region: VoiceRegion | null;
    bitrate: number;
    user_limit: number;
}

export interface VoiceChannel extends VoiceBasedChannel {
    type: num.CHANNEL_TYPES.GUILD_VOICE;
}

export interface GroupDMChannel extends DMBasedChannel {
    type: num.CHANNEL_TYPES.GROUP_DM;
    owner_id: Snowflake;
    icon: string | null;
}

export interface CategoryChannel extends GuildChannel {
    type: num.CHANNEL_TYPES.GUILD_CATEGORY;
    parent_id: undefined | null;
}

export interface NewsChannel extends TextBasedChannel {
    type: num.CHANNEL_TYPES.GUILD_NEWS;
}

export interface StoreChannel extends TextBasedChannel {
    type: num.CHANNEL_TYPES.GUILD_STORE;
}

export interface ThreadChannel extends GuildChannel {
    type: num.CHANNEL_TYPES.GUILD_NEWS_THREAD | num.CHANNEL_TYPES.GUILD_PUBLIC_THREAD | num.CHANNEL_TYPES.GUILD_PRIVATE_THREAD;
    thread_metadata: ThreadMeta;
    member: ThreadMember;
    message_count: number;
    member_count: number;
    owner_id: Snowflake;
}

export interface NewsThreadChannel extends ThreadChannel {
    type: num.CHANNEL_TYPES.GUILD_NEWS_THREAD;
}

export interface PublicThreadChannel extends ThreadChannel {
    type: num.CHANNEL_TYPES.GUILD_PUBLIC_THREAD;
}

export interface PrivateThreadChannel extends ThreadChannel {
    type: num.CHANNEL_TYPES.GUILD_PRIVATE_THREAD;
}

export interface VoiceStageChannel extends VoiceBasedChannel {
    type: num.CHANNEL_TYPES.GUILD_STAGE_VOICE;
}

//export type GuildChannel = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | ThreadChannel | NewsThreadChannel | PublicThreadChannel | VoiceStageChannel;

//export type Channel = GuildChannel | DMChannel |  GroupDMChannel;

export type ThreadMeta = {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: Timestamp;
    locked: boolean;
}

export type ThreadMember = {
    id?: Snowflake,
    user_id?: Snowflake;
    join_timestamp: Timestamp;
    flags: Flags;
}

export type VoiceRegion = {
    id: Snowflake,
    name: string;
    vip: boolean;
    optimal: boolean;
    deprecated: boolean;
    custom: boolean;
}

export type PermissionOverwrites = {
    id: Snowflake;
    type: num.PERMISSION_OVERWRITE_TYPES;
    allow: Bitfield;
    deny: Bitfield;
}

export type ChannelPositionData = {
    id: Snowflake;
    position: number | null;
    lock_permissions?: boolean | null;
    parent_id?: Snowflake | null;
}

/************ integration types ************/

export type Integration = {
    id: Snowflake;
    name: string;
    type: IntegrationType;
    enabled: boolean;
    syncing?: boolean;
    role_id?: Snowflake;
    enable_emoticons?: boolean;
    expire_behavior?: num.INTEGRATION_EXPIRE_BEHAVIORS;
    expire_grace_period?: number;
    user?: User;
    account: IntegrationAccount;
    synced_at?: Timestamp;
    subscriber_count?: number;
    revoked?: boolean;
    application?: IntegrationApplication;
}

export type IntegrationType = 'twitch' | 'youtube' | 'discord';

export type IntegrationAccount = {
    id: string;
    name: string;
}

export type IntegrationApplication = {
    id: Snowflake;
    name: string;
    icon: string | null;
    description: string;
    summary: string;
    bot?: User;
}

/************ interaction types ************/

export type Interaction = {
    id: Snowflake;
    application_id: Snowflake;
    type: num.INTERACTION_REQUEST_TYPES;
    data?: InteractionData;
    guild_id?: Snowflake;
    channel_id?: Snowflake;
    member?: Member;
    user?: User;
    token: string;
    version: 1;
    message?: Message;
    locale?: string;
    guild_locale?: string;
}

export type InteractionData = {
    id: Snowflake;
    name: string;
    resolved?: InteractionDataResolved;
    options?: InteractionDataOption[];
    custom_id?: string;
    component_type?: num.MESSAGE_COMPONENT_TYPES;
    values?: string[];
    target_id?: Snowflake;
}

export type InteractionDataResolved = {
    users?: Record<Snowflake, User>;
    members?: Record<Snowflake, PartialMember>;
    roles?: Record<Snowflake, Role>;
    channels?: Record<Snowflake, PartialChannel>;
}

export type InteractionDataOption = {
    name: string;
    type: num.COMMAND_OPTION_TYPES;
    value?: CommandOptionValue;
    options?: InteractionDataOption[];
}

export type InteractionResponse = {
    type: num.INTERACTION_CALLBACK_TYPES;
    data?: InteractionResponseData;
}

export type InteractionResponseData = {
    tts?: boolean;
    content?: string;
    embeds?: Embed[];
    allowed_mentions?: AllowedMentions;
    flags?: Flags;
    components?: MessageComponent[];
}

export type MessageInteraction = {
    id: Snowflake;
    type: num.INTERACTION_REQUEST_TYPES;
    name: string;
    user: User;
}

/****** application command types ******/

const localeList = [
    'da',    // Danish          Dansk
    'de',    // German          Deutsch
    'en-GB', // English, UK
    'en-US', // English, US
    'es-ES', // Spanish         Español
    'fr',    // French          Français
    'hr',    // Croation        Hrvatski
    'it',	 // Italian         Italiano
    'lt',	 // Lithuanian	    Lietuviškai
    'hu',	 // Hungarian	    Magyar
    'nl',	 // Dutch	        Nederlands
    'no',	 // Norwegian	    Norsk
    'pl',	 // Polish	        Polski
    'pt-BR', // Portuguese, Brazilian	Português do Brasil
    'ro',	 // Romanian, Romania	    Română
    'fi',	 // Finnish	        Suomi
    'sv-SE', // Swedish	        Svenska
    'vi',	 // Vietnamese	    Tiếng Việt
    'tr',	 // Turkish	        Türkçe
    'cs',	 // Czech	        Čeština
    'el',	 // Greek	        Ελληνικά
    'bg',	 // Bulgarian	    български
    'ru',	 // Russian	        Pусский
    'uk',	 // Ukrainian	    Українська
    'hi',	 // Hindi	        हिन्दी
    'th',	 // Thai	        ไทย
    'zh-CN', // Chinese, China	中文
    'ja',	 // Japanese	    日本語
    'zh-TW', // Chinese, Taiwan	繁體中文
    'ko',	 // Korean	        한국어
] as const;
export type Locale = typeof localeList[number];
export type LocaleDict = Record<Locale, string>;

export type CommandBase = {
    name?: string;
    name_localizations?: LocaleDict;
    description?: string;
    description_localizations?: LocaleDict;
    options?: CommandOption[];
    default_member_permissions?: Bitfield | null;
    dm_permission?: boolean | null;
    type?: num.COMMAND_TYPES;
}
export interface CommandCreateData extends CommandBase {
    name: string;
    description: string;
}
export type CommandEditData = Omit<CommandBase, "type">;

export interface Command extends CommandCreateData {
    id: Snowflake;
    application_id: Snowflake;
    guild_id?: Snowflake;
    version: Snowflake;
    type: num.COMMAND_TYPES;
}

export type CommandOptionValue = CommandOption | string | number | boolean | User | Channel | Role;

export type CommandOption = {
    type: num.COMMAND_OPTION_TYPES;
    name: string;
    description: string;
    required?: boolean;
    choices?: CommandOptionChoice[];
    options?: CommandOption[];
}

export type CommandOptionChoice = {
    name: string;
    value: string | number;
}

export type CommandPermissions = {
    id: Snowflake;
    application_id: Snowflake;
    guild_id: Snowflake;
    permissions: CommandPermissionsData[];
}

export type CommandPermissionsData = {
    id: Snowflake;
    type: num.COMMAND_PERMISSION_TYPES;
    permission: boolean;
}

/************ message types ************/

export type Message = {
    id: Snowflake;
    channel_id: Snowflake;
    guild_id?: Snowflake;
    author: User;
    member?: Member; // only included in MESSAGE_CREATE and MESSAGE_UPDATE
    content: string;
    timestamp: Timestamp;
    edited_timestamp: Timestamp | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions?: User[];
    file?: Buffer;
    embeds?: Embed[];
    allowed_mentions?: AllowedMentions;
    message_reference?: MessageReference;
    components?: MessageComponent[];
}

export type AllowedMentions = {
    parse: Array<"roles" | "users" | "everyone">;
    roles: Snowflake[];
    users: Snowflake[];
    replied_user?: boolean;
};

export type MessageReference = {
    message_id?: Snowflake;
    channel_id?: Snowflake;
    guild_id?: Snowflake;
    fail_if_not_exists?: boolean;
};

export type MessageData = {
    content?: string;
    file?: Buffer;
    embeds?: Embed[];
    allowed_mentions?: AllowedMentions;
    message_reference?: MessageReference;
    components?: MessageComponent[];
}

export type MessageFetchData = {
    limit: number;
    around?: Snowflake;
    before?: Snowflake;
    after?: Snowflake;
}

/****** message component types ******/

// https://canary.discord.com/developers/docs/interactions/message-components#component-object
export type MessageComponent = {
    type: num.MESSAGE_COMPONENT_TYPES;
};
export interface MessageComponentRow extends MessageComponent {
    type: num.MESSAGE_COMPONENT_TYPES.ACTION_ROW;
    components: MessageComponent[];
}
export interface MessageComponentButton extends MessageComponent {
    type: num.MESSAGE_COMPONENT_TYPES.BUTTON;
    custom_id?: string;
    disabled?: boolean;
    style?: num.BUTTON_STYLES;
    label?: string;
    emoji?: Emoji;
    url?: URL;
}
export interface MessageComponentSelect extends MessageComponent {
    type: num.MESSAGE_COMPONENT_TYPES.SELECT_MENU;
    custom_id?: string;
    disabled?: boolean;
    options: MessageComponentSelectOption[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
}
export type MessageComponentSelectOption = {
    label: string,
    value: string,
    description?: string;
    emoji?: Emoji;
    default?: boolean;
}

/****** embed types ******/

export type Embed = {
    title?:	string;
    type?: string;
    description?: string;
    url?: URL;
    timestamp?: Timestamp;
    color?: number;
    footer?: EmbedFooter;
    image?: EmbedMedia;
    thumbnail?: EmbedMedia;
    video?: EmbedMedia;
    provider?: EmbedProvider;
    author?: EmbedAuthor;
    fields?: EmbedField[];
}

export type EmbedFooter = {
    text: string;
    icon_url?: URL;
    proxy_icon_url?: URL;
};
export type EmbedMedia = {
    url: string;
    proxy_url?: URL;
    height?: number;
    width?: number;
};
export type EmbedProvider = {
    name?: string;
    url?: URL;
};
export type EmbedAuthor = {
    name: string;
    url?: URL;
    icon_url?: URL;
    proxy_url?: URL;
};
export type EmbedField = {
    name: string;
    value: string;
    inline?: boolean;
};

/************ misc types ************/

export type LangMap = Record<string, Lang>;

export type Lang = Record<string, string>;

export type ReplaceMap = Record<string, string>;

/****** special dev types ******/

export type CustomEmojiIdentifier = `${string}:${Snowflake}`;

export type UnicodeEmoji = string;

// formatted as name:id (i.e. ) or Unicode emoji (i.e. 🔥)
export type EmojiIdentifier = CustomEmojiIdentifier | UnicodeEmoji;

// ISO8601 timestamp
export type Timestamp = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

// bitfield number represented as string
export type Bitfield = `${number | bigint}`;

// bitfield number represented as number
export type Flags = number;

// URI encoded image
export type ImageData = `data:image/${"jpeg" | "png" | "gif"};base64,${string}`;

// Any kind of URL
export type URL = `${string}://${string}`;

// Discord Snowflake, 18-20 digits
export type Snowflake = `${number | bigint}`;

export type SnowflakeOrMe = Snowflake | "@me";

// Unix timestamp (seconds since epoch)
export type UnixTimestamp = number;

// Unix timestamp (millis since epoch)
export type UnixTimestampMillis = number;

/* what the run() or runText() functions in commands can return.
 * may add more types later.
 */
export type CommandResponse = Promise<Message | null>;

export type PartialApplication = {
    id: Snowflake,
    flags: Flags
}

export type StringMap = Record<string, string>;

// Used for objects with optional fields (namely users for redis cache.) This is just a workaround to get the compiler to play nice; shouldn't be used to manually set fields to undefined.
export type DynamicStringMap = Partial<StringMap>;

export type StringBool = "true" | "false";

export type StringNum = `${number}`;

export type TimeoutList = {
    gatewayError: NodeJS.Timeout[];
}

/*** event handler types ***/

export type EventHandlerFunction = (event: any) => any; // wanted to use event: EventData here but ts is shit

export class EventHandler {
    bot: Bot;
    name: EventName;
    cacheHandler?: EventHandlerFunction;
    handler!: EventHandlerFunction;

    constructor(eventName: LowercaseEventName, bot: Bot) {
        this.name = eventName.toUpperCase() as EventName;
        this.bot = bot;
    }
}

export const NON_WAITING_EVENTS: EventName[] = ['READY', 'RESUMED'];

/*** permission types ***/

export type PermissionName = keyof typeof num.PERMISSIONS;

export type BenderPermission = RoleHierarchyPermission | RoleListPermission | DiscordPermission;

export type RoleHierarchyPermission = Snowflake;
export type RoleListPermission = Snowflake[];
export type DiscordPermission = PermissionName;