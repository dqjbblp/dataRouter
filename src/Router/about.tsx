import { Outlet } from "react-router-dom";

const About = () => {
  return (
    <div>
      <div style={{ width: "100%", height: "40px", backgroundColor: "red" }}>
        fake table bar
      </div>
      <div>About</div>
      <Outlet />
    </div>
  );
};

export default About;
