import { IQueryResult } from "./gateway";

export interface LicenseKey {
    algorithm: string;
    value: string;
    expiredAt: string;
}

export interface Device {
    machine: string;
    install: string;
}

export interface License {
    state: string;
    template: string;
    region: string;
    scope: string;
    option1: number;
    option2: number;
    option3: string;
    submitDate: string;
}

export interface Options {
    option1: number;
    option2: number;
    option3: string;
}

export interface UserLicense {
    email: string;
    data: License;
}

export interface UserLicenseKey {
    email: string;
    data: LicenseKey;
}

export interface UserDevices {
    email: string;
    data: Device[];
}

export interface LicenseQueryResult extends IQueryResult {
    data: UserLicense[];
}

export interface Reviewer {
    email: string,
    section: string,
    scope: string,
    regions: string,
}

export interface SalesMan {
    email: string,
    name: string,
    scope: string,
    regions: string,
    position: string
}