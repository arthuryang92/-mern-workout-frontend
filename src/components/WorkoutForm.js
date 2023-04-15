import { useState } from "react";
import { useWorkoutsContext } from "../hook/useWorkoutsContext";
import { useAuthContext } from "../hook/useAuthContext";
const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState("");
  const [singleDetails, setSingleDetails] = useState([]);
  const { REACT_APP_API_ENDPOINT } = process.env;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("User must logged in!");
      return;
    }
    const workout = { title, load, reps };
    const response = await fetch(`${REACT_APP_API_ENDPOINT}/api/workouts/`, {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setSingleDetails(json.singleDetails);
    }
    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      setSingleDetails([]);
      console.log("new workout added", json);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>
      <label>Title : </label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={singleDetails.includes("title") ? "error" : ""}
      />
      <label>Load (in kg): </label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={singleDetails.includes("load") ? "error" : ""}
      />
      <label>Reps : </label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={singleDetails.includes("reps") ? "error" : ""}
      />
      <button>Submit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
