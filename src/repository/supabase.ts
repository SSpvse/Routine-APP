import type { Task } from '../types/Task';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export const getTasks = async (): Promise<Task[]> => {
    const { data, error } = await supabase
        .from('Tasks')
        .select('*');

    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
    return data;
};

export const addTask = async (taskName: string): Promise<Task | null> => {
    const { data, error } = await supabase
        .from('Tasks')
        .insert([{ task_name: taskName, completed: false , date : new Date()}])
        .select()
        .single(); // return the inserted row

    if (error) {
        console.error('Error inserting task:', error);
        return null;
    }

    return data;
};

export const updateTasks = async (
    ids: number[],    // parameter one
    updates: Partial<Task>   // parameter two, where partial means not all fields are required, and in checked box case only 'completed' will be sent
): Promise<Task[] | null> => {   // return type to expect
    if (!ids.length) return [];

    const { data, error } = await supabase
        .from('Tasks')
        .update(updates)
        .in('id', ids)
        .select(); // returns an array of updated rows

    if (error) {
        console.error('Error bulk-updating tasks:', error);
        return null;
    }

    return data ?? [];
};

export const deleteTasks = async (
    ids: number[]) => {
    const { data, error } = await supabase
        .from('Tasks')
        .delete()
        .in('id', ids);

    if (error){
        console.error('Error deleting task:', error);
        return null
    }else{
        console.log(data)
        return {success: true, data};
    }

};

export const deleteTask = async (id: number) => {
    const { data, error } = await supabase
        .from('Tasks')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting task:', error);
        return { success: false, error };
    }

    return { success: true, data };
}