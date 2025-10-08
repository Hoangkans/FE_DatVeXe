import store from "../config/redux/store"
import { useState, useEffect } from "react";
import formatMoney from "../utils/ticket/money";

export default function CounterClock() {
    const [counter, setCounter] = useState(store.getState().counter.value);

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setCounter(store.getState().counter.value);
        });

        return unsubscribe;
    }, []);

  const increment = () => store.dispatch({ type: "INCREMENT" });
  const decrement = () => store.dispatch({ type: "DECREMENT" });

  const money = 800000000

  return (
    <div>
      <p>Counter: {counter}</p>

      <button onClick={increment}>+ Increase</button>
      <button onClick={decrement}>- Decrese</button>
      <p>Price: {formatMoney(money)}</p>
    </div>
  )
}