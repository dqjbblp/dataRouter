import React from "react";

import { RouterCacheContext } from "./RouterCacheRoot";

interface Props {
  children?: React.ReactNode;
}

const RouterCache = ({ children }: Props) => {
  const routerCache = React.useContext(RouterCacheContext);

  const routerCacheKey = React.useMemo(() => {
    return window.location.pathname;
  }, []);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [hidingPlace, setHidingPlace] = React.useState<HTMLDivElement>();
  React.useEffect(() => {
    if (!routerCache.hasCache(routerCacheKey)) {
      console.log("cache", routerCacheKey, children);
      const { hidingPlace } = routerCache.cache(routerCacheKey, children);
      if (hidingPlace) {
        setHidingPlace(hidingPlace);
      }
    } else {
      const { hidingPlace } = routerCache.getCache(routerCacheKey);
      if (hidingPlace) {
        setHidingPlace(hidingPlace);
      }
    }
  }, [children, routerCache, routerCacheKey]);

  React.useEffect(() => {
    if (hidingPlace) {
      console.log(hidingPlace);

      containerRef.current?.appendChild(hidingPlace);
    }
    return () => {
      if (hidingPlace) {
        hidingPlace.parentElement?.removeChild(hidingPlace);
      }
    };
  }, [hidingPlace]);

  return (
    <>
      <div ref={containerRef} />
    </>
  );
};

export default RouterCache;
