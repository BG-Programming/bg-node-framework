export { PoolClient } from "pg";
type ApiHandler = (path: string, callback: (any: any) => any) => any;

interface ApiHandlers {
	get: ApiHandler;
	post: ApiHandler;
	put: ApiHandler;
	delete: ApiHandler;
}

interface API extends ApiHandlers {
	init: (app: any) => void;
	guest: ApiHandlers;
	admin: ApiHandlers;
}

interface DefaultApiParams<T> {
    params: any,
    query: any,
    body: T,
    useragent?: string
    cookies: any
};

interface UserInfo {
    email: string;
    userId: number;
	lastAccessTime: number;
	ip: string;
}

interface DefaultUserApiParams extends DefaultApiParams<undefined> {
    userInfo: UserInfo;
};

interface GuestApiParams<T> extends DefaultApiParams<T> {
    userInfo?: UserInfo | null
};

interface UserApiParams<T> extends DefaultApiParams<T> {
    userInfo: UserInfo;
};

type RouterParameters = { app: any, api: API };

// for test checkerEx
enum PlatformType {
    youtube = 'YOUTUBE',
    instagram = 'INSTAGRAM',
    tiktok = 'TIKTOK',
    facebook = 'FACEBOOK',
    etc = 'ETC'
};


export type { RouterParameters }
export {
    API, ApiHandlers, ApiHandler,
    UserInfo,
    DefaultUserApiParams, UserApiParams, GuestApiParams,
	PlatformType
}
