import { useState } from "react";

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>Home</div>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        {count}
      </button>
    </div>
  );
};

export default Home;
