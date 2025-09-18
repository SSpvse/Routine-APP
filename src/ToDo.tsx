import React, {useEffect, useState} from "react";
import {RenderList} from "./RenderList.tsx";
import type {Task} from "./types/Task.ts";
import { createClient } from "@supabase/supabase-js";
import { addTask , getTasks, deleteTask , updateTasks} from "./repository/supabase.ts";
import {Link} from "react-router-dom";


const ToDo = () => {

    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

    const [taskList, setTasksList] = useState<Task[]>([]);
    const [itemListBool, setItemListBool] = useState(false);
    const [showToDoBool, setShowToDoBool] = useState(false);
    const [newItem, setNewItem] = useState("");
    const [selectedTasksForUpdate, setSelectedTasksForUpdate] = useState<number[]>([]);  //  keeps the ids of the tasks selected by checkbox before submitting
    const [unserlectedTasksForUpdate, setUnselectedTasksForUpdate] = useState<number[]>([]);  //  keeps the ids of the tasks unselected by checkbox before submitting

    // on component mount, fetch tasks from DB
    useEffect(() => {
        getTasksFromDB();
    }, []);

    async function getTasksFromDB() {
        const {data} = await supabase.from('Tasks').select('*');
        setTasksList(data || []);
    }
    const handleClickButton = () => {
        setItemListBool(prev => !prev);
    }
    const handleClickShowToDoList = () => {
        setShowToDoBool(prev => !prev);
    }
    // handle sumbitting the written to do Task
    const handleNamingTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // stop page reload
        if (!newItem.trim()) return; // ignore empty
        /*setToDoList((prev) => [...prev, newItem]); // add to array*/

        const resFromDb = await addTask(newItem);
        if (resFromDb === null) {
            console.error('Failed to add task to the database');
            return;
        }else {
            setTasksList(prevState => [...prevState, resFromDb]);
        }

        setNewItem(""); // clear input
    }
    // handle deleting a Task from the list and DB
    const handleDeleteTask = async (id: number) => {
        const result = await deleteTask(id);
        if (!result.success) {
            console.error('Failed to delete task from the database:', result.error);
            return;
        }
        setTasksList(prev => prev.filter(item => item.id !== id));
    }

    const handleCheckboxSubmit = () => {
        const updateCheck = updateTasks(selectedTasksForUpdate, {completed : true} )
        const updateUncheck = updateTasks(unserlectedTasksForUpdate, {completed : false} )
        if (updateCheck === null || updateUncheck === null) {
            console.error('Failed to update tasks in the database');
            return;
        } else {
            // update the local state to reflect changes
            setTasksList(prevTasks =>
                prevTasks.map(task =>
                    selectedTasksForUpdate.includes(task.id)
                        ? {...task, completed: true}
                        : unserlectedTasksForUpdate.includes(task.id) ? {...task, completed: false} : task
                )
            );
            setSelectedTasksForUpdate([]);   // clear selected tasks after update for later use
        }
    }


    return (
        <main>
            <Link to="/"> Menu</Link>
            <p> ToDo.tsx !</p>

            <button onClick={handleClickButton}>Add to do.</button>
            {itemListBool ? (
                <form onSubmit={handleNamingTaskSubmit}>
                    <input
                        type="text"
                        placeholder="Enter a to do item"
                        value={newItem}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                            setNewItem(e.target.value)
                            console.log(e.target.value)
                        }}
                    />
                    <button type="submit">Add</button>
                </form>
            ) : null}

            <br></br>

            {!showToDoBool ? <button onClick={handleClickShowToDoList}> show To Do list </button>:
                <div>
                    <button onClick={handleClickShowToDoList}> hide to do list </button>
                    <RenderList
                        list={taskList}
                        setList={setTasksList}
                        deleteTask={handleDeleteTask}
                        setSlectedTasks={setSelectedTasksForUpdate}
                        setUnselectedTasksForUpdate={setUnselectedTasksForUpdate}
                        handleCheckboxSubmit={handleCheckboxSubmit}
                    />
                </div>}
            { /* showToDoBool && <ToDo/> */}
            <p> End of ToDo.tsx</p>

        </main>

    );
};

export default ToDo;
