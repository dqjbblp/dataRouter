import React from "react";
import { router, useMatches } from "..";
import { Meta } from "../utils";

interface Props {
  children?: React.ReactNode;
}

const RouterGuard: React.FC<Props> = ({ children }) => {
  const [beforeEnterRun, setBeforeEnterRun] = React.useState<
    "initial" | "running" | "successful" | "error"
  >("initial");

  const matches = useMatches();

  const [isUsed, setIsUsed] = React.useState<boolean>(false);

  const findFinalRendering = React.useCallback((children: Meta[]): string[] => {
    return children.flatMap((item) => {
      if (item.name === "index") {
        if (item.children) {
          return findFinalRendering(item.children);
        }
      }
      return [
        ...(item.hasComponent && item.isSubMenu && item.fullPath
          ? [item.fullPath]
          : []),
        ...(item.children && !item.isSubMenu
          ? findFinalRendering(item.children)
          : []),
      ];
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        setBeforeEnterRun("running");
        const path = location.pathname;
        const actualMatches = matches.filter((i) => !i.data?.isMiddlewares);
        if (
          actualMatches.some((i) => i.data?.auth === "need-login-operators")
        ) {
          if (Math.random() + 0.1 > 0.5) {
            const bool = actualMatches.every((i) => {
              if (i.data?.id) {
                return true;
              }
              return false;
            });
            if (bool) {
              const matchPaths = findFinalRendering(
                matches[matches.length - 1]?.data?.children ?? []
              );
              console.log(matchPaths, 57);
              if (matchPaths?.[0] && matchPaths?.[0] !== location.pathname) {
                router.navigate(matchPaths?.[0], { replace: true });
              }
            } else {
              console.log(60, bool);
            }
          } else if (Math.random() > 0.3) {
            console.log(65);
          } else {
            console.log(67);

            // router.navigate("/login", { replace: true });
          }
        } else if (actualMatches.some((i) => i?.data?.auth === "need-login")) {
          // 这里替换成是否登陆
          if (Math.random() + 0.1 > 0.4) {
            const bool = true;
            if (bool) {
              // pass
            } else {
              //
            }
          } else {
            router.navigate("/login?redirect=" + path, { replace: true });
          }
        } else {
          if (location.pathname !== "/login") {
            router.navigate("/login", { replace: true });
          }
        }
        setTimeout(() => {
          setBeforeEnterRun("successful");
        }, 2000);
      } catch (error) {
        console.error(error);
        setBeforeEnterRun("error");
      }
    })();
  }, [matches, findFinalRendering]);

  React.useEffect(() => {
    if (["successful"].includes(beforeEnterRun)) {
      setIsUsed(true);
    }
  }, [beforeEnterRun]);

  if (!isUsed && ["initial", "running"].includes(beforeEnterRun)) {
    return (
      <div style={{ width: "100vw", height: "100vh", backgroundColor: "blue" }}>
        loading...中间件
      </div>
    );
  }
  return (
    <div style={{ width: "100vw", height: "100vh", background: "pink" }}>
      {children}
    </div>
  );
};

export default RouterGuard;
