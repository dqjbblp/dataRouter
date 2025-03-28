import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children?: React.ReactNode;
}

interface RouterCacheContextType {
  cache: (
    key: string,
    children: React.ReactNode,
  ) => { hidingPlace: HTMLDivElement | null; portal: React.ReactPortal | null };
  getCache: (key: string) => { hidingPlace: HTMLDivElement | null; portal: React.ReactPortal | null };
  hasCache: (key: string) => boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const RouterCacheContext = React.createContext<RouterCacheContextType>({
  cache: () => {
    return {
      hidingPlace: null,
      portal: null,
    };
  },
  getCache: () => {
    return {
      hidingPlace: null,
      portal: null,
    };
  },
  hasCache: () => {
    return false;
  },
});

const RouterCacheRoot = ({ children }: Props) => {
  const [hidingPlaceMap, setHidingPlaceMap] = React.useState<{
    [key: string]: HTMLDivElement;
  }>({});
  const [portalMap, setPortalMap] = React.useState<{
    [key: string]: React.ReactPortal;
  }>({});

  const cache = React.useCallback<RouterCacheContextType['cache']>(
    (key, children) => {
      const hidingPlace = hidingPlaceMap[key] ?? document.createElement('div');
      const portal = ReactDOM.createPortal(children, hidingPlace);
      setHidingPlaceMap((hidingPlaceMap) => {
        return {
          ...hidingPlaceMap,
          [key]: hidingPlace,
        };
      });
      setPortalMap((portalMap) => {
        return { ...portalMap, [key]: portal };
      });
      return {
        hidingPlace,
        portal,
      };
    },
    [hidingPlaceMap],
  );

  const getCache = React.useCallback<RouterCacheContextType['getCache']>(
    (key) => {
      return {
        hidingPlace: hidingPlaceMap[key] ?? null,
        portal: portalMap[key] ?? null,
      };
    },
    [hidingPlaceMap, portalMap],
  );

  const hasCache = React.useCallback<RouterCacheContextType['hasCache']>(
    (key) => {
      return !!hidingPlaceMap[key];
    },
    [hidingPlaceMap],
  );

  const portals = React.useMemo(() => {
    return Object.values(portalMap);
  }, [portalMap]);
  // React.useEffect(() => {
  //   console.log('portals', portals);
  // }, [portals]);

  return (
    <RouterCacheContext.Provider
      value={{
        cache,
        getCache,
        hasCache,
      }}
    >
      {children}
      {portals}
    </RouterCacheContext.Provider>
  );
};

export default RouterCacheRoot;
