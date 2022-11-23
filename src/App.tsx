import React from "react";
import { AddTodo, Name, Surname, TodoList } from "./Fields";
import { LocalStateProvider } from "./localState";

const SingleApp = () => (
  <LocalStateProvider>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Name />
      <Surname />
      <AddTodo />
      <TodoList />
    </div>
  </LocalStateProvider>
);
const App = () => <SingleApp />;

export default App;
