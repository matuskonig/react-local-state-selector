import { useState } from "react";
import { useLocalContextSelector } from "./localState";

export const Name = () => {
  const name = useLocalContextSelector(({ name }) => name);
  const setName = useLocalContextSelector(({ setName }) => setName);

  return (
    <div>
      Name:
      <input
        width={50}
        type={"text"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

export const Surname = () => {
  const surname = useLocalContextSelector(({ surname }) => surname);
  const setSurname = useLocalContextSelector(({ setSurname }) => setSurname);

  return (
    <div>
      Surname:
      <input
        type={"text"}
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        width={50}
      />
    </div>
  );
};

export const AddTodo = () => {
  const [todo, setTodo] = useState<string>("");
  const addTodoAction = useLocalContextSelector(({ addTodo }) => addTodo);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (todo) {
            addTodoAction(todo);
            setTodo("");
          }
        }}
      >
        New todo name:
        <input
          type={"text"}
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          width={50}
        />
        <input type={"submit"} />
      </form>
    </div>
  );
};

export const TodoList = () => {
  const todos = useLocalContextSelector(({ todos }) => todos);
  const removeTodo = useLocalContextSelector(({ removeTodo }) => removeTodo);

  return (
    <>
      {todos.map((todo, i) => (
        <div key={`${todo}-${i}`}>
          {todo}
          <button onClick={() => removeTodo(i)}>x</button>
        </div>
      ))}
    </>
  );
};
