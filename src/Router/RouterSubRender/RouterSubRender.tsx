import React from "react";
import ReactDOM from "react-dom";
import { Outlet, useLoaderData, useMatches } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

const RouterSubRender: React.FC<Props> = ({ children }) => {
  const matches = useMatches();
  const loader = useLoaderData();

  const [hidingPlace] = React.useState<HTMLDivElement>(() =>
    document.createElement("div")
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [routerOwnRendering, setRouterOwnRendering] =
    React.useState<boolean>(false);
  const [routerSubRendering, setRouterSubRendering] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const index = matches.findIndex((i) => i.id === loader.id);
    const ownBool = index >= 0 && index === matches.length - 1;
    const subBool = index >= 0 && index < matches.length - 1;
    setRouterOwnRendering(routerOwnRendering || ownBool);
    setRouterSubRendering(subBool);
  }, [loader.id, matches, routerOwnRendering]);

  React.useEffect(() => {
    if (containerRef.current) {
      if (!routerSubRendering) {
        containerRef.current.appendChild(hidingPlace);
      } else {
        try {
          containerRef.current.removeChild(hidingPlace);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          /* empty */
        }
      }
    }
  }, [routerSubRendering, hidingPlace]);

  return (
    <>
      <div ref={containerRef} />
      {routerOwnRendering && ReactDOM.createPortal(children, hidingPlace)}
      {routerSubRendering ? <Outlet /> : null}
    </>
  );
};

export default RouterSubRender;
