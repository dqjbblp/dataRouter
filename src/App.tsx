import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import RouterCacheRoot from "./Router/RouterCache/RouterCacheRoot";

function App() {
  return (
    <RouterCacheRoot>
      <RouterProvider router={router} />
    </RouterCacheRoot>
  );
}

export default App;
