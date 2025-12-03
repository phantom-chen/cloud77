export function formatDateTimeWithTimeZone(date = new Date()) {
    // ISO string with time zone (e.g., "2025-07-08T14:30:45.123Z")
    return date.toISOString();
}

export function formatDateTimeWithLocalTimeZone(date = new Date()) {
    // Local date time string with time zone offset (e.g., "7/8/2025, 2:30:45 PM GMT-5")
    return date.toLocaleString('en-US', {
        timeZoneName: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}

export function formatDateTimeCustomTimeZone(date = new Date(), timeZone = 'America/New_York') {
    // Custom time zone format (e.g., "7/8/2025, 2:30:45 PM EDT")
    return date.toLocaleString('en-US', {
        timeZone: timeZone,
        timeZoneName: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}