import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // Set states
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [priority, setPriority] = useState("low");
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [dueDate, setDueDate] = useState("");

  // Edit states
  const [editTodo, setEditTodo] = useState({});
  const [openEditUI, setOpenEditUI] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("in_progress");
  const [editPriority, setEditPriority] = useState("low");
  const [editDueDate, setEditDueDate] = useState("");
  

  
  
  
  const addTodoHandler = () => {
    const postTodo = async () => {
      const postTododata = {
        name: name,
        description: description,
        status: status,
        priority: priority,
        due_date: dueDate,
      };
      const { data } = await axios.post(
        "http://127.0.0.1:8000/todos",
        postTododata
      );
      setTodos([...todos, data])
      setName("")
      setDescription("")
      setStatus("in_progress")
      setPriority("low")
      setDueDate("")
    };
    postTodo()
  };

  const editTodoHandler = (id) => {
    const updatePatchTodo = async () => {
      const updateData = {
        name: editName,
        status: editStatus,
        description: editDescription,
        priority: editPriority,
        due_date: editDueDate,
      }
      const {data} = await axios.patch(`http://127.0.0.1:8000/todos/${id}/`, updateData)
      const updatedTodos = todos.map((todo) =>{
        if(todo.id === id){
          todo.name = editName;
          todo.description = editDescription;
          todo.status = editStatus;
          todo.priority = editPriority;
          todo.due_date = editDueDate;
        }
        return todo
      })
      setTodos(updatedTodos)
      setEditTodo({})
      setEditName('')
      setEditDescription('')
      setEditStatus(false)
      setEditPriority(false)
      setOpenEditUI(false)
      setEditDueDate('')
    }
    updatePatchTodo()
  };

  const deleteTodoHandler = (id) => {
    const deleteTodo = async() =>{
      await axios.delete(`http://127.0.0.1:8000/todos/${id}/`)
      const newTodos = todos.filter((todo) => todo.id !== id)
      setTodos(newTodos)
    }
    deleteTodo()
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/todos").then((res) => {
      console.log("response:", res.data);
      setTodos(res.data.todos); 
      setStatusOptions(res.data.status_choices);  
      setPriorityOptions(res.data.priority_choices);
    });
  }, []);

  return (
    <div className="bg-slate-900 text-white h-screen relative overflow-y-auto">
      <div className="flex flex-col w-full p-10">
        <h1 className="text-5xl text-center pb-5">Todo App</h1>
  
        {/* ======= Создание ToDo ======= */}
        <div className="bg-slate-700 rounded-xl px-4 py-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="w-full py-2 px-3 rounded-xl bg-slate-600 text-white outline-none"
            placeholder="Add ToDo Name..."
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-slate-600 text-white outline-none resize-none"
            placeholder="Description..."
            rows={3}
          />
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-600 text-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-600 text-white"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-slate-600 text-white"
          />
  
          <button
            onClick={addTodoHandler}
            className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold flex items-center justify-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Todo</span>
          </button>
        </div>
  
        {/* ======= Список ToDos ======= */}
        <div className="mt-10 flex flex-col space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          {todos?.map((todo) => (
            <div
              key={todo.id}
              className="max-w-md mx-auto w-full p-5 h-full rounded-xl bg-blue-500 flex items-center justify-between"
            >
              <p
                onClick={() => {
                  setEditStatus(todo.status);
                  setEditPriority(todo.priority);
                  setEditName(todo.name);
                  setEditDescription(todo.description);
                  setEditDueDate(todo.due_date);
                  setEditTodo(todo);
                  setOpenEditUI(true);
                }}
                className="cursor-pointer"
              >
                {todo.name}{" "}
                {todo.status_display && (
                  <span className="test-xs text-gray-300">({todo.status_display})</span>
                )}
              </p>
              <i onClick={() => deleteTodoHandler(todo.id)}>
                <TrashIcon className="icons" fill="white" />
              </i>
            </div>
          ))}
        </div>
      </div>
  
      {/* ======= Редактирование ToDo ======= */}
      <div
        className={`w-72 h-fit bg-white text-slate-900 absolute left-1/2 rounded-xl px-3 py-2 -translate-x-1/2 -translate-y-1/2 ${
          openEditUI ? "" : "hidden"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg">Edit Todo</h2>
          <XMarkIcon className="w-5 h-5 cursor-pointer" onClick={() => setOpenEditUI(false)} />
        </div>
  
        <input
          type="text"
          className="w-full px-3 py-2 bg-gray-300 rounded-xl mb-2"
          placeholder="Edit Name.."
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 bg-gray-300 rounded-xl mb-2 resize-none"
          placeholder="Edit Description.."
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={3}
        />
        <select
          className="w-full px-3 py-2 bg-gray-300 rounded-xl mb-2"
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="w-full px-3 py-2 bg-gray-300 rounded-xl mb-2"
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="w-full px-3 py-2 bg-gray-300 rounded-xl mb-2"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
        />
        <button
          onClick={() => editTodoHandler(editTodo.id)}
          className="w-full p-2 rounded-xl bg-slate-700 text-white mt-2"
        >
          Update
        </button>
      </div>
    </div>
  );
}
export default App;

  // return (
//     <div className="bg-slate-900 text-white h-screen relative">
//       <div className="flex flex-col w-full p-10">
//         <h1 className="text-5xl text-center pb-5">Todo App</h1>
//         <div className="flex items-center justify-between bg-slate-700 rounded-xl px-4">
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             type="text"
//             className="w-full py-2 rounded-xl bg-slate-700 text-white outline-none"
//             placeholder="Add ToDo here..."
//           />
//           <i onClick={addTodoHandler}>
//             <PlusIcon className="icons hover:opacity-70" />
//           </i>
//         </div>

//         <div className="mt-5 flex flex-col space-y-5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
//           {todos?.map((todo, index) => (
//             <div
//               key={todo.id}
//               className="max-w-md mx-auto w-full p-5 h-full rounded-xl bg-blue-500 flex items-center justify-between"
//             >
//               <p
//                 onClick={() => {
//                   setEditStatus(todo.status_display);
//                   setEditName(todo.name);
//                   setEditTodo(todo);
//                   setOpenEditUI(true);
//                 }}
//                 className="cursor-pointer"
//               >
//                 {todo.name}{" "}
//                 {todo.status_display && (
//                   <span className="test-xs text-gray-300">({todo.status_display})</span>
//                 )}
//               </p>

//               <i onClick={() => deleteTodoHandler(todo.id)}>
//                 <TrashIcon className="icons" fill="white" />
//               </i>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div
//         className={`w-72 h-fit bg-white text-slate-900 absolute left-1/2 rounded-xl px-3 py-2 -translate-x-1/2 -translate-y-1/2 ${
//           openEditUI ? "" : "hidden"
//         }`}
//       >
//         <div className="flex flex-col mb-4">
//           <label htmlFor="status" className="text-sm font-medium mb-1">Status</label>
//           <select
//             id="status"
//             className="p-2 rounded-xl bg-gray-300"
//             value={editStatus}
//             onChange={(e) => setEditStatus(e.target.value)}
//           >
//             {statusOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>


//         <div>
//           <input
//             type="text"
//             className="w-full px-3 py-2 bg-gray-300 rounded-xl"
//             placeholder="Edit Name.."
//             value={editName}
//             onChange={(e) => setEditName(e.target.value)}
//           />
//         </div>
//         <button
//           onClick={() => editTodoHandler(editTodo.id)}
//           className="w-full p-2 rounded-xl bg-slate-700 text-white mt-2"
//         >
//           Update
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;
