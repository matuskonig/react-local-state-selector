import React from "react";
import { AddTodo, IndexedTodo, Name, Surname, TodoList } from "./Fields";
import { LocalContextProvider } from "./localState";

const SingleApp = () => (
  <LocalContextProvider>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Name />
      <Surname />
      <AddTodo />
      <TodoList />
      <IndexedTodo />
    </div>
  </LocalContextProvider>
);
const App = () => <SingleApp />;

export default App;
