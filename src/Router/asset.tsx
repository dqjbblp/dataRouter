import { Outlet } from "react-router-dom";

const Asset = () => {
  return (
    <div>
      <div>Asset</div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => {
        return <SlowItem key={item} index={item} />;
      })}
      <Outlet />
    </div>
  );
};

export default Asset;

const SlowItem = ({ index }: { index: number }) => {
  const startTime = performance.now();
  while (performance.now() - startTime < 15) {
    /* empty */
  }
  return <li>slow item:{index}</li>;
};
