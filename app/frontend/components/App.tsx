import React from "react";

const App = () => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/v1/friends")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  return (
    <div>
      <h1>Friends</h1>
      <hr />
      {data.map(({ first_name, last_name, email, twitter }) => (
        <>
          <h3>Name</h3>
          <div>
            {first_name} {last_name}
          </div>

          <h3>Contact</h3>
          <div>Email: {email}</div>
          <div>Twitter: {twitter}</div>
          <hr />
        </>
      ))}
    </div>
  );
};

export default App;
