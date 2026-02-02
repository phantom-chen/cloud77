import { createContext } from "react";
import { Subject } from "rxjs";
import { EventEmitter } from 'events';

export const DiagramContext = createContext({ name: 'placeholder' });

export const MessageEventBus: EventEmitter = new EventEmitter();

export const MessageQueue$: Subject<string> = new Subject();