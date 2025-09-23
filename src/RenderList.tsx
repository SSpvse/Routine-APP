import React from "react";
import type {Task} from "./types/Task.ts";
import {deleteTask} from "./repository/supabase.ts";
import {Button} from "@/components/ui/button.tsx";

type RenderListProps = {
    list: Task[];
    setList: React.Dispatch<React.SetStateAction<Task[]>>;
    // deleteTask: (id: number) => void;
    setSlectedTasksForUpdate: React.Dispatch<React.SetStateAction<number[]>>;
    setUnselectedTasksForUpdate: React.Dispatch<React.SetStateAction<number[]>>;
    setSelectedTasksForDelete: React.Dispatch<React.SetStateAction<number[]>>;
    setUnselectedTasksForDelete: React.Dispatch<React.SetStateAction<number[]>>;
    handleCheckboxSubmit: () => void;
}
const editTask = (item : Task) => {
    item.task_name = prompt("Edit task:", item.task_name) || item.task_name;
}
export const RenderList:React.FunctionComponent<RenderListProps> = ({
                                        list,
                                        setList,
                                       // deleteTasks,
                                        setSlectedTasksForUpdate,
                                        handleCheckboxSubmit,
                                        setUnselectedTasksForUpdate,setSelectedTasksForDelete,setUnselectedTasksForDelete}) => {

    return (
        <div>
            <ul>
                {list.map((item) => (
                    <li key={item.id}>
                        <button style={{
                            border: '1px solid #ccc',       // border around checkbox + label
                            padding: '8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontSize: '12px',               // smaller font size
                            backgroundColor: '#f9f9f9',     // optional: light background
                        }}
                                onClick={()=> editTask(item)}>Edit</button>
                        {item.task_name}
                        <div
                            style={{
                                border: '1px solid #ccc',       // border around checkbox + label
                                padding: '8px',
                                borderRadius: '4px',
                                display: 'inline-block',
                                fontSize: '12px',               // smaller font size
                                backgroundColor: '#f9f9f9',     // optional: light background
                            }}
                        >
                            <label> Finished
                                <input
                                    type="checkbox"
                                    /* checked={selectedTasks.includes(item.id)} */
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSlectedTasksForUpdate(prev => [...prev, item.id]);  // adding id numbers to the array for checked boxes
                                        } else {
                                            /* setSlectedTasks(prev => prev.filter(id => id !== item.id)); */
                                            setUnselectedTasksForUpdate(prev => [...prev, item.id]); // adding id numbers to the array for unchecked boxes
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div
                            style={{
                                border: '1px solid #ccc',       // border around checkbox + label
                                padding: '8px',
                                borderRadius: '4px',
                                display: 'inline-block',
                                fontSize: '12px',               // smaller font size
                                backgroundColor: '#f9f9f9',     // optional: light background
                            }}
                        >
                            <label> Delete
                                <input

                                    type="checkbox"
                                    /* checked={selectedTasks.includes(item.id)} */
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTasksForDelete(prev => [...prev, item.id]);  // adding id numbers to the array for checked boxes
                                        } else {
                                            /* setSlectedTasks(prev => prev.filter(id => id !== item.id)); */
                                            setUnselectedTasksForDelete(prev => [...prev, item.id]); // adding id numbers to the array for unchecked boxes
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
            <Button variant="ghost" onClick={handleCheckboxSubmit}> Submit </Button>
        </div>
    );
};


