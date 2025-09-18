import React from "react";
import type {Task} from "./types/Task.ts";
import {deleteTask} from "./repository/supabase.ts";

type RenderListProps = {
    list: Task[];
    setList: React.Dispatch<React.SetStateAction<Task[]>>;
    deleteTask: (id: number) => void;
    setSlectedTasks: React.Dispatch<React.SetStateAction<number[]>>;
    setUnselectedTasksForUpdate: React.Dispatch<React.SetStateAction<number[]>>;
    handleCheckboxSubmit: () => void;
}
const editTask = (item : Task) => {
    item.task_name = prompt("Edit task:", item.task_name) || item.task_name;
}
export const RenderList:React.FunctionComponent<RenderListProps> = ({
    list,
    setList,
    deleteTask,
    setSlectedTasks,
    handleCheckboxSubmit,
setUnselectedTasksForUpdate}) => {


    return (
        <div>
            <ul>
                {list.map((item) => (
                    <li key={item.id}>
                        <button onClick={()=> editTask(item)}/>
                        {item.task_name}
                        <input

                            type="checkbox"
                            /* checked={selectedTasks.includes(item.id)} */
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSlectedTasks(prev => [...prev, item.id]);  // adding id numbers to the array for checked boxes
                                } else {
                                    /* setSlectedTasks(prev => prev.filter(id => id !== item.id)); */
                                    setUnselectedTasksForUpdate(prev => [...prev, item.id]); // adding id numbers to the array for unchecked boxes
                                }
                            }}
                        />
                        <button onClick={() => deleteTask(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleCheckboxSubmit}> Submit </button>
        </div>
    );
};


