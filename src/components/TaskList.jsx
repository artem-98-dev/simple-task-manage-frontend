import { useState, useEffect } from "react";
import axios from "axios";

function TaskList() {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [editingTask, setEditingTask] = useState(null);
	const [editText, setEditText] = useState("");
	const [loading, setLoading] = useState(false);

	const API_URL =
		import.meta.env.TASK_API_URL || "http://localhost:5000/api/tasks";

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		setLoading(true);
		try {
			const response = await axios.get(API_URL);
			setTasks(response.data);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		} finally {
			setLoading(false);
		}
	};

	const addTask = async (e) => {
		e.preventDefault();
		if (!newTask.trim()) return;

		await axios.post(API_URL, {
			title: newTask,
			status: false,
		});
		setNewTask("");
		fetchTasks();
	};

	const toggleStatus = async (task) => {
		await axios.patch(`${API_URL}/${task._id}`, {
			status: !task.status,
		});
		fetchTasks();
	};

	const deleteTask = async (id) => {
		await axios.delete(`${API_URL}/${id}`);
		fetchTasks();
	};

	const startEditing = (task) => {
		setEditingTask(task._id);
		setEditText(task.title);
	};

	const updateTask = async (id) => {
		await axios.patch(`${API_URL}/${id}`, {
			title: editText,
		});
		setEditingTask(null);
		fetchTasks();
	};

	return (
		<div className="task-list">
			<form onSubmit={addTask}>
				<input
					type="text"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					placeholder="Add new task"
				/>
				<button type="submit">Add Task</button>
			</form>

			{loading ? (
				<div className="loading">Loading...</div>
			) : (
				<ul>
					{tasks.map((task) => (
						<li key={task._id}>
							{editingTask === task._id ? (
								<div>
									<input
										type="text"
										value={editText}
										onChange={(e) =>
											setEditText(e.target.value)
										}
									/>
									<button
										onClick={() => updateTask(task._id)}
									>
										Save
									</button>
								</div>
							) : (
								<div>
									<input
										type="checkbox"
										checked={task.status}
										onChange={() => toggleStatus(task)}
									/>
									<span
										style={{
											textDecoration: task.status
												? "line-through"
												: "none",
										}}
									>
										{task.title}
									</span>
									<button onClick={() => startEditing(task)}>
										Edit
									</button>
									<button
										onClick={() => deleteTask(task._id)}
									>
										Delete
									</button>
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default TaskList;
