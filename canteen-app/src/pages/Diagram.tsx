import React, { PropsWithChildren, RefObject, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { EventEmitter } from 'events';
import { Company } from '../components/company';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { useAccount, useAdminRole } from '../hooks';
import { MessageQueue$ } from '../models/sample';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export const EventBus: EventEmitter = new EventEmitter();

export interface ICounter {
    count: number
}

export interface ICounterAction {
    action: 'increment' | 'decrement' | 'reset'
}

export function counterReducer(counter: ICounter, action: ICounterAction): ICounter {
    console.log(counter);
    console.log(action);

    switch (action.action) {
        case 'increment':
            return { count: counter.count + 1 };
        case 'decrement':
            return { count: counter.count - 1 };
        default:
            return { count: 0 };
    }
}

export const DemoContext = React.createContext({ name: 'franke' });

export function ToolBar() {

    const context = useContext(DemoContext);

    return (
        <div>
            <button onClick={() => {
                EventBus.emit("hello", context.name);
                console.log(EventBus.eventNames());
                console.log(EventBus.listenerCount("hello"));
                console.log(EventBus.listenerCount("hello2"));
            }}>{'hello ' + context.name}</button>

        </div>
    )
}

const Hello = (props: PropsWithChildren) => {

    const [message, setMessage] = useState('...');

    const helloListener = (value: string) => {
        setMessage(`receive message: ${value}`);
    }

    useEffect(() => {
        EventBus.on("hello", helloListener);
        return () => {
            EventBus.removeListener("hello", helloListener);
        }
    }, [])

    return (
        <div>
            <p>hello item</p>
            {props.children}
            <p>{message}</p>
        </div>
    )
}

interface IState {
    theme: string
}

export const ThemeContext = React.createContext(null)
export const OtherContext = React.createContext(null)

const initState: IState = {
    theme: 'dark',
}
const otherInitState = 'otherState'

interface ThemeState {
    theme: string
}

interface ThemeAction {
    type: string,
    val: string
}

const reducer = (state: ThemeState, action: ThemeAction) => {
    switch (action.type) {
        case 'changeTheme':
            return {
                ...state,
                theme: action.val,
            }
        default:
            return state
    }
}

const otherReducer = (state: ThemeState, action: ThemeAction) => {
    switch (action.type) {
        case 'changeState': {
            return action.val
        }
        default:
            return state
    }
}

// const ThemedButton = React.memo(() => {
//   console.log('button render')
//   const ctx = useContext(ThemeContext) || {}
//   const [state = {}, dispatch = null] = ctx

//   const changeTheme = () => {
//     dispatch({
//       type: 'changeTheme',
//       val: 'light',
//     })
//   }
//   return (
//     <>
//       <h1>{ state.theme }</h1>
//       <button type="button" onClick={ changeTheme }>
//         changeTheme
//       </button>
//     </>
//   )
// })

// const Toolbar = React.memo(() => <ThemedButton />)
// const OtherComponent = React.memo(() => {

//   console.log('other component render')
//   const ctx = useContext(OtherContext) || {}
//   const [state = '', dispatch = null] = ctx
//   const changeState = () => {
//     dispatch({
//       type: 'changeState',
//       val: 'change state',
//     })
//   }
//   return (
//     <>
//       <h1>{ state }</h1>
//       <button type="button" onClick={ changeState }>
//         changeOtherState
//       </button>
//     </>
//   )
// })


// const DemoApp: React.FC = () => {
//   const [state, dispatch] = useReducer(reducer, initState)
//   const [otherState, otherDispatch] = useReducer(otherReducer, otherInitState)
//   const valueA = useMemo(() => [state, dispatch], [state])
//   const valueB = useMemo(() => [otherState, otherDispatch], [otherState])

//   return (
//     <ThemeContext.Provider value={ valueA }>
//       <OtherContext.Provider value={ valueB }>
//         <Toolbar />
//         <OtherComponent />
//       </OtherContext.Provider>
//     </ThemeContext.Provider>
//   )
// }

function appendItem(items: number[]) {
    items.push(items.length + 1);
}

export default function Diagram() {

    const [counter, dispatch] = useReducer(counterReducer, { count: 0 });
    const [stamp, setStamp] = useState<string>(new Date().toLocaleTimeString());
    const {loading, account} = useAccount("administrator");
    const { isAdmin } = useAdminRole(account);        

    const sendMessage = () => {
        MessageQueue$.next(`hello ${counter}`);
    };
    
    useEffect(() => {
        const id = setInterval(() => {
            setStamp(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(id);
        }
    }, []);


    const [page, setPage] = useState<number>(999);
    const pagesRef: RefObject<number[]> = useRef([999]);
    const itemsRef: RefObject<number[]> = useRef([]);

    const sections = [
        'Technology',
        'Design',
        'Culture',
        'Business',
        'Politics',
        'Opinion',
        'Science',
        'Health',
        'Style',
        'Travel',
    ];

    const featuredPosts = [
        {
            title: 'Featured post',
            date: 'Nov 12',
            description:
                'This is a wider card with supporting text below as a natural lead-in to additional content.',
        },
        {
            title: 'Post title',
            date: 'Nov 11',
            description:
                'This is a wider card with supporting text below as a natural lead-in to additional content.',
        },
    ];

    const archives = [
        'March 2020',
        'February 2020',
        'January 2020',
        'December 2019',
        'November 2019',
        'October 2019',
        'September 2019',
        'August 2019',
        'July 2019',
        'June 2019',
        'May 2019',
        'April 2019',
    ];

    const social = ['GitHub', 'Twitter', 'Facebook'];

    return (
        <DemoContext.Provider value={{ name: 'franke-franke' }}>
            <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '60%' }}>
                    <button onClick={() => {
                        setPage(page + 1);
                        pagesRef.current?.push(page + 1);
                        console.log(pagesRef.current);
                        if (itemsRef.current) {
                            console.log(itemsRef.current);
                            appendItem(itemsRef.current);
                            console.log(itemsRef.current);
                        }
                    }}>
                        page + 1
                    </button>
                    <span>{`current page: ${page}`}</span>
                    <span>{stamp}</span>

                    <a
                        href="/contact"
                        onClick={(event) => {
                            // stop the browser from changing the URL and requesting the new document
                            event.preventDefault();
                            // push an entry into the browser history stack and change the URL
                            window.history.pushState({}, '', "/contact");
                        }}>contact</a>

                    <Company />
                </div>

                <div>
                    <button onClick={() => dispatch({ action: 'increment' })}>increment</button>
                    <p>{'count: ' + counter.count}</p>
                    <ToolBar />
                    <Hello>
                        <p>hello1</p>
                    </Hello>
                    <p>diagram works</p>
                    <div>
                        <span>diagram1</span>
                        <ArrowDownward />
                        <ArrowUpward />
                    </div>
                    {
                        loading ? <p>loading</p> : <p>account is {account.name}</p>
                    }
                    {
                        isAdmin ? <p>you are admin</p> : undefined
                    }
                    <button onClick={() => {
                        sendMessage();
                    }}>click me!</button>

                    <Link to="/user">
                        <Button variant="contained">Direct to /user</Button>
                    </Link>
                </div>
            </div>
        </DemoContext.Provider>
    )
}
