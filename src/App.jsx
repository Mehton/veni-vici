import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState(null); // Change to null to show one item at a time
  const [queryParams, setQueryParams] = useState({
    limit: 2,
  });
  const [apiKey] = useState(import.meta.env.VITE_APP_ACCESS_KEY);
  const [banList, setBanList] = useState([]); // State for the ban list

  const fetchData = async () => {
    const { limit } = queryParams;
    const url = `https://api.thedogapi.com/v1/images/search?limit=${limit}`;

    try {
      const response = await fetch(url, {
        headers: { "x-api-key": apiKey },
      });
      const result = await response.json();
      // Filter out banned items
      const filteredResult = result.filter((item) => {
        const breed = item.breeds[0];
        return (
          !banList.includes(breed?.bred_for) &&
          !banList.includes(breed?.breed_group) &&
          !banList.includes(breed?.life_span)
        );
      });
      // If no filtered results, reset ban list (optional)
      if (filteredResult.length === 0) {
        setBanList([]); // or handle as needed
      } else {
        setData(
          filteredResult[Math.floor(Math.random() * filteredResult.length)]
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [queryParams, banList]); // Trigger fetch when banList changes

  const handleBan = (attribute) => {
    setBanList((prev) => [...prev, attribute]);
    fetchData(); // Fetch new data after banning
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Veni Vici!</h1>
        <h3>Discover dogs from your wildest dreams!</h3>
        <h3>🐕🐶🐕‍🦺🐩🐕🐶🐕‍🦺🐩</h3>

        <div>
          {data ? (
            <div>
              {data.breeds.length > 0 ? (
                <div>
                  <h3
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5em",
                      cursor: "pointer",
                    }}
                    onClick={() => handleBan(data.breeds[0].name)}
                  >
                    {data.breeds[0].name}
                  </h3>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    <button onClick={() => handleBan(data.breeds[0]?.bred_for)}>
                      {data.breeds[0]?.bred_for}
                    </button>
                    <button
                      onClick={() => handleBan(data.breeds[0]?.breed_group)}
                    >
                      {data.breeds[0]?.breed_group}
                    </button>
                    <button
                      onClick={() => handleBan(data.breeds[0]?.life_span)}
                    >
                      {data.breeds[0]?.life_span}
                    </button>
                    <button
                      onClick={() =>
                        handleBan(data.breeds[0]?.weight?.imperial)
                      }
                    >
                      Weight: {data.breeds[0].weight.imperial}
                      {/* {data.breeds[0].weight.metric} (Metric) */}
                    </button>
                  </div>
                </div>
              ) : (
                <p>No information available.</p>
              )}
              <img
                src={data.url}
                alt="Dog"
                style={{ width: "250px", height: "250px" }} // Set image size
              />
              <br />
              <button onClick={fetchData}>🔀Discover</button>
            </div>
          ) : (
            <p>No valid data found or all breeds are banned.</p>
          )}
        </div>
      </div>
      <div
        style={{
          width: "300px",
          padding: "20px",
          borderLeft: "1px solid #ccc",
        }}
      >
        <h4>Ban List:</h4>
        <ul>
          {banList.map((breed, index) => (
            <button
              style={{
                backgroundColor: "#FFE4C4",
              }}
            >
              <li key={index}>{breed}</li>
            </button>
          ))}
          <br />
        </ul>
      </div>
    </div>
  );
};

export default App;
