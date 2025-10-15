export interface AppStatus {
    isLogin: boolean,
    sideNavOpened: boolean
}

export interface DefaultResponse { code: string, message: string, id: string }

export interface GatewayService {
    version: string
    machine: string;
    apikey: string;
    hostname: string
    environment: string;
    home: string;
    user: string
    super: string
    canteen: string
    factory: string
    product: string
}

export interface ServiceApp {
    name: string;
    version: string;
    tags: string[];
    hostname: string;
    ip: string;
}

export interface IQueryResult {
    total: number;
    query: string;
    index: number,
    size: number
}

export interface EventEntity {
    name: string;
    email: string;
    userEmail: string,
    userName: string,
    payload: string;
    date: string;
}

export interface EventQueryResult extends IQueryResult {
    data: EventEntity[];
}

export interface MarkdownNote {
    id: string,
    userId: string,
    collection: string,
    tags: string[],
    title: string,
    description: string,
    content: string,
    createdAt: string,
    timestamp: string
}

export interface NavigationItem {
    label: string;
    link: string;
    icon: string;
}

export interface ReleaseNote {
    id: number;
    text: string;
}