import { Routes, Route } from "react-router-dom";
import AddTodo from "./addTodo";
import ShowTodos from "./ShowTodos";
import UpdateTodo from "./UpdateTodo";
import ViewTodo from "./ViewTodo";
import SearchBtn from "./SearchBtn";

const Todos = () => {
  return (
    <Routes>
      {/* URL banega: /dashboard/todos */}
      <Route  element={<div>Todos List Page</div>} />

      {/* URL banega: /dashboard/todos/addTodo */}
      <Route path="/" element={<ShowTodos />} />
      <Route path="addTodos" element={<AddTodo />} />
      <Route path="searchTodos" element={<SearchBtn />} />
      <Route path="updateTodos/:id" element={<UpdateTodo />} />
      <Route path="viewTodos/:id" element={<ViewTodo />} />
    </Routes>
  );
};

export default Todos;