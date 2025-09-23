import React, {useEffect, useState} from "react";
import {RenderList} from "./RenderList.tsx";
import type {Task} from "./types/Task.ts";
import { createClient } from "@supabase/supabase-js";
import {addTask, getTasks, deleteTask, updateTasks, deleteTasks} from "./repository/supabase.ts";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";


const ToDo = () => {

    const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

    const [taskList, setTasksList] = useState<Task[]>([]);
    const [itemListBool, setItemListBool] = useState(false);
    const [showToDoBool, setShowToDoBool] = useState(false);
    const [newItem, setNewItem] = useState("");
    //lists for checkbox handling for finished / notfinished tasks
    const [selectedTasksForUpdate, setSelectedTasksForUpdate] = useState<number[]>([]);  //  keeps the ids of the tasks selected by checkbox before submitting
    const [unserlectedTasksForUpdate, setUnselectedTasksForUpdate] = useState<number[]>([]);  //  keeps the ids of the tasks unselected by checkbox before submitting
    //lists for checkbox handling for deleting tasks
    const [selectedTasksForDelete, setSelectedTasksForDelete] = useState<number[]>([]);
    const [unserlectedTasksForDelete, setUnselectedTasksForDelete] = useState<number[]>([]);


    // on component mount, fetch tasks from DB
    useEffect(() => {
        getTasksFromDB();
    }, []);

    async function getTasksFromDB() {
        const {data} = await supabase.from('Tasks').select('*');
        setTasksList(data || []);
    }

    const handleAddTaskToListButton = () => {
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
        } else {
            setTasksList(prevState => [...prevState, resFromDb]);
        }

        setNewItem(""); // clear input
    }
    // handle deleting a Task from the list and DB
    /*const handleDeleteTask = async (id: number) => {
        const result = await deleteTask(id);
        if (!result.success) {
            console.error('Failed to delete task from the database:', result.error);
            return;
        }
        setTasksList(prev => prev.filter(item => item.id !== id));
    }
    NEED TO UPDATE THE SUPABASE.TS TO HAVE ONE TASK AT A TIME
     */

    const handleDeleteTasks = async (ids: number[]) => {
        const result = await deleteTasks(ids);
        if (!result) {
            console.error('Failed to delete tasks from the database:', result);
            return;
        }
        setTasksList(prev => prev.filter(item => !ids.includes(item.id)));
    }
    const handleCheckboxSubmit = () => {
        const updateCheck = updateTasks(selectedTasksForUpdate, {completed : true} )
        const updateUncheck = updateTasks(unserlectedTasksForUpdate, {completed : false} )

        const updateDelete = deleteTasks(selectedTasksForDelete);


// deleting tasks in frontend after DB update
        if (updateDelete === null) {
            console.error('Failed to delete tasks in the database');
            return;
        } else {
            setTasksList(prev => prev.filter(item => !selectedTasksForDelete.includes(item.id)));
            // update the local state to show changes
            setSelectedTasksForDelete([]);   // clear selected tasks after update for later use
        }
// updating tasks in frontend after DB update
        if (updateCheck === null || updateUncheck === null) {
            console.error('Failed to update tasks in the database');
            return;
        } else {
            // update the local state to show changes
            setTasksList(prevTasks =>
                prevTasks.map(task =>
                    selectedTasksForUpdate.includes(task.id)
                        ? {...task, completed: true}
                        : unserlectedTasksForUpdate.includes(task.id) ? {...task, completed: false} : task
                )
            );
            setSelectedTasksForUpdate([]);   // clear selected tasks after update for later use
            setUnselectedTasksForUpdate([]);
        }
    }


    return (
        <main>
            <Link to="/"> Menu</Link>
            <p> ToDo.tsx !</p>

            <button onClick={handleAddTaskToListButton}>Add to do.</button>
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

                    <div className="flex flex-wrap items-center gap-2 md:flex-row">
                        <Button onClick={handleClickShowToDoList}>Hide list</Button>
                    </div>
                    <RenderList
                        list={taskList}
                        setList={setTasksList}
                        // deleteTasks={handleDeleteTask}
                        // lists for checkbox handling for finished / notfinished tasks
                        setSlectedTasksForUpdate={setSelectedTasksForUpdate}
                        setUnselectedTasksForUpdate={setUnselectedTasksForUpdate}
                        // lists for checkbox handling for deleting tasks
                        setSelectedTasksForDelete={setSelectedTasksForDelete}
                        setUnselectedTasksForDelete={setUnselectedTasksForDelete}
                        handleCheckboxSubmit={handleCheckboxSubmit}

                    />
                </div>}
            { /* showToDoBool && <ToDo/> */
}
            <p> End of ToDo.tsx</p>

        </main>

    );
};

export default ToDo;
