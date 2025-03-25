import React from "react";
import { buildRoutes, Meta, RouteConfig } from "./utils";
import {
  createBrowserRouter,
  UIMatch,
  useMatches as useMatches_,
} from "react-router-dom";
import ErrorBoundary from "../component/ErrorBoundary/ErrorBoundary";

const routesConfig: RouteConfig[] = [
  {
    ErrorBoundary: ErrorBoundary,
    meta: {
      isMiddlewares: true,
    },
    children: [
      {
        path: "login",
        meta: {
          name: "login",
          title: "登录",
        },
        middlewares: [React.lazy(() => import("./RouterGuard/RouterGuard"))],
        element: React.lazy(() => import("./login")),
      },
      {
        path: "about",
        meta: {
          name: "about",
          title: "关于",
          auth: "need-login",
        },
        children: [
          {
            path: "home",
            meta: { name: "home", title: "用户" },
            element: React.lazy(() => import("./home")),
          },
        ],
        middlewares: [React.lazy(() => import("./RouterGuard/RouterGuard"))],
        element: React.lazy(() => import("./about")),
      },
      {
        path: "index",
        meta: {
          name: "index",
          title: "资产",
          auth: "need-login-operators",
        },
        children: [
          {
            path: "home",
            meta: { name: "home", title: "用户", isSubMenu: true },
            element: React.lazy(() => import("./home")),
          },
        ],
        middlewares: [React.lazy(() => import("./RouterGuard/RouterGuard"))],
        element: React.lazy(() => import("./asset")),
      },
      {
        path: "*",
        meta: {
          name: "404",
          title: "404",
        },
        element: React.lazy(() => import("./404")),
      },
    ],
  },
];

export const useMatches = () => {
  return useMatches_() as UIMatch<Meta | undefined>[];
};

export const router = createBrowserRouter(buildRoutes(routesConfig));
