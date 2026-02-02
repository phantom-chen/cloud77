import React, { RefObject, useContext, useEffect, useReducer, useRef, useState } from 'react';
// import { useAccount, useAdminRole } from '../hooks';

// export interface ICounter {
//     count: number
// }

// export interface ICounterAction {
//     action: 'increment' | 'decrement' | 'reset'
// }

// export function counterReducer(counter: ICounter, action: ICounterAction): ICounter {
//     console.log(counter);
//     console.log(action);

//     switch (action.action) {
//         case 'increment':
//             return { count: counter.count + 1 };
//         case 'decrement':
//             return { count: counter.count - 1 };
//         default:
//             return { count: 0 };
//     }
// }

// interface IState {
//     theme: string
// }

export const ThemeContext = React.createContext(null)
export const OtherContext = React.createContext(null)

// const initState: IState = {
//     theme: 'dark',
// }
const otherInitState = 'otherState'

// interface ThemeState {
//     theme: string
// }

// interface ThemeAction {
//     type: string,
//     val: string
// }

// const reducer = (state: ThemeState, action: ThemeAction) => {
//     switch (action.type) {
//         case 'changeTheme':
//             return {
//                 ...state,
//                 theme: action.val,
//             }
//         default:
//             return state
//     }
// }

// const otherReducer = (state: ThemeState, action: ThemeAction) => {
//     switch (action.type) {
//         case 'changeState': {
//             return action.val
//         }
//         default:
//             return state
//     }
// }

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

// function appendItem(items: number[]) {
//     items.push(items.length + 1);
// }

// export default function Diagram() {

//     // const [counter, dispatch] = useReducer(counterReducer, { count: 0 });
    
//     // const {loading, account} = useAccount("administrator");
//     // const { isAdmin } = useAdminRole(account);        

//     // const pagesRef: RefObject<number[]> = useRef([999]);
//     // const itemsRef: RefObject<number[]> = useRef([]);

//     return (
//             <div style={{ display: 'flex', width: '100%' }}>
//                 <div style={{ width: '60%' }}>

//                     {/* <button onClick={() => {
//                         setPage(page + 1);
//                         pagesRef.current?.push(page + 1);
//                         console.log(pagesRef.current);
//                         if (itemsRef.current) {
//                             console.log(itemsRef.current);
//                             appendItem(itemsRef.current);
//                             console.log(itemsRef.current);
//                         }
//                     }}>
//                         page + 1
//                     </button>                     */}

//                 </div>

//                 <div>
//                     {/* <button onClick={() => dispatch({ action: 'increment' })}>increment</button> */}
                    
//                     {/* <p>{'count: ' + counter.count}</p> */}
                    

//                     {/* {
//                         loading ? <p>loading</p> : <p>account is {account.name}</p>
//                     }
//                     {
//                         isAdmin ? <p>you are admin</p> : undefined
//                     } */}

//                 </div>
//             </div>
//     )
// }
