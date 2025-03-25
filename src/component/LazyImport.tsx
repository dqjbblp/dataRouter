import { ComponentType, FC, LazyExoticComponent, Suspense } from "react";

interface LazyImportProps {
  lazy?: LazyExoticComponent<ComponentType>;
}

const LazyImport: FC<LazyImportProps> = ({ lazy }) => {
  const Component = lazy ? lazy : () => null;
  return (
    <Suspense
      fallback={
        <div
          style={{ width: "100vw", height: "100vh", backgroundColor: "red" }}
        >
          loading...
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export default LazyImport;
