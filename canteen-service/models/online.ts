let count = 0;

export function serverConnected(): number {
    count++;
    return count;
}

export function serverDisConnected(): number {
    count--;
    return count;
}

export function connectedUsers(): number {
    return count;
}