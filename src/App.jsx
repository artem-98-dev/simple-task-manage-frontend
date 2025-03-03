import TaskList from "./components/TaskList.jsx";
import "./App.css";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Task Management</h1>
			</header>
			<main>
				<TaskList />
			</main>
		</div>
	);
}

export default App;
