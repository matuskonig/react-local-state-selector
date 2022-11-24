import { useCallback, useState } from "react";
import {
  useVariableLocalContextSelector,
  useStaticLocalContextSelector,
} from "./localState";

export const Name = () => {
  const name = useStaticLocalContextSelector(({ name }) => name);
  const setName = useStaticLocalContextSelector(({ setName }) => setName);

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
  const surname = useStaticLocalContextSelector(({ surname }) => surname);
  const setSurname = useStaticLocalContextSelector(
    ({ setSurname }) => setSurname
  );

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
  const addTodoAction = useStaticLocalContextSelector(({ addTodo }) => addTodo);

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
  const todos = useStaticLocalContextSelector(({ todos }) => todos);
  const removeTodo = useStaticLocalContextSelector(
    ({ removeTodo }) => removeTodo
  );

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

export const IndexedTodo = () => {
  const [index, setIndex] = useState<number | null>(null);
  const todos = useStaticLocalContextSelector(({ todos }) => todos);
  const note = useVariableLocalContextSelector(
    useCallback(({ todos }) => (index != null ? todos[index] : null), [index])
  );
  return (
    <div>
      <select
        value={index ?? ""}
        onChange={(e) =>
          setIndex(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">Empty</option>
        {todos.map((_, i) => (
          <option value={i} key={i}>
            {i}
          </option>
        ))}
      </select>
      <div>
        {index} - {note}
      </div>
    </div>
  );
};
