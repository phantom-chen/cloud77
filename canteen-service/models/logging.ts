function formatTimezoneOffset(offsetMinutes: number): string {
    // Convert timezone offset from minutes to string format like "+05:30" or "-08:00"
    const sign = offsetMinutes <= 0 ? '+' : '-'; // Note: getTimezoneOffset() returns positive for behind UTC
    const absOffset = Math.abs(offsetMinutes);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;
    
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function logFile(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `CanteenService-${year}${month}${day}.txt`;
}

function formatToDigits(value: number): string {
    // Format a number to two digits, e.g., 5 becomes "05"
    return value.toString().padStart(2, '0');
}

function logTimestamp(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${formatToDigits(date.getHours())}:${formatToDigits(date.getMinutes())}:${formatToDigits(date.getSeconds())} ${formatTimezoneOffset(date.getTimezoneOffset())}`;
}

export function appendLog(content: string, level = 'info'): void {
    const date = new Date();
    console.log(logFile(date));
    console.log(`[${logTimestamp(date)}] [${level}] ${content}`);
}