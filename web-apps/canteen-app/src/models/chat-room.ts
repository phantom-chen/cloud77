export interface IChatRoom {
    id: string; // generate id
    name: string;   // user defined
    description: string;    // user defined
    capacity: number;   // user defined
    location: string;
    amenities: string[];
    features: string[];
    availability: {
        monday: { open: string; close: string; };
        tuesday: { open: string; close: string; };
        wednesday: { open: string; close: string; };
        thursday: { open: string; close: string; };
        friday: { open: string, close: string; };
        saturday: { open: string, close: string; };
        sunday: { open: string, close: string; };
    }
}

export const defaultChatRoom: IChatRoom = {
    id: '',
    name: '',
    description: '',
    capacity: 0,
    location: '',
    amenities: [],
    features: [],
    availability: {
        "monday": {
            "open": "",
            "close": ""
        },
        "tuesday": {
            "open": "",
            "close": ""
        },
        "wednesday": {
            "open": "",
            "close": ""
        },
        "thursday": {
            "open": "",
            "close": ""
        },
        "friday": {
            "open": "",
            "close": ""
        },
        "saturday": {
            "open": "",
            "close": ""
        },
        "sunday": {
            "open": "",
            "close": ""
        }
    }
};