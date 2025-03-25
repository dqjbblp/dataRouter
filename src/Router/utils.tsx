import { ComponentType, LazyExoticComponent } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import LazyImport from "../component/LazyImport";

export type LazyComponent = LazyExoticComponent<ComponentType>;
export interface Meta {
  name?: string;
  title?: string;
  auth?: "need-login" | "need-login-operators";
  permission?: string;
  permissionId?: string;
  isMiddlewares?: boolean;
  isMainMenu?: boolean;
  isSubMenu?: boolean;
  isSubMenuGroup?: boolean;
  is404?: boolean;
  hasComponent?: boolean;
  children?: Meta[];
  fullPath?: string;
  id?: string;
}
export type RouteConfig = Omit<
  RouteObject,
  "element" | "children" | "Component" | "lazy"
> & {
  meta: Meta;
  element?: LazyComponent;
  middlewares?: React.FC<{
    children?: React.ReactNode;
  }>[];
  children?: RouteConfig[];
};

/**
 * 路由元信息
 */
const metaMap: Record<string, Meta> = {};

export const buildRoutes = (
  routes: RouteConfig[],
  parentId?: string
): RouteObject[] => {
  return routes.map((item) => {
    const { element, middlewares, children, meta, ...restProps } = item;

    /**
     * 构建路由元信息
     */
    const fullPath = [
      (parentId && metaMap[parentId]?.fullPath) || "/",
      restProps.path,
    ]
      .join("/")
      .replace(/\/+/g, "/");
    const id = fullPath;
    metaMap[id] = {
      ...meta,
      fullPath,
      hasComponent: !!element,
      id,
    };
    if (parentId) {
      if (!metaMap[parentId].children) {
        metaMap[parentId].children = [];
      }
      metaMap[parentId].children?.push(metaMap[id]);
    }

    // 要返回的路由对象
    const routeObject: RouteObject = {
      ...restProps,
      id,
    };

    // 递归构建子路由
    if (children) {
      routeObject.children = buildRoutes(children, id);
    }

    // 异步加载组件
    routeObject.element = element ? (
      <LazyImport lazy={element} key={id} />
    ) : (
      <Outlet />
    );
    routeObject.loader = async () => {
      return metaMap[id];
    };

    // 中间件处理
    if (middlewares && middlewares.length > 0) {
      // 从后往前遍历中间件，这样中间件的执行顺序就是从前往后
      // 例如：[A, B, C] => A(B(C()))
      for (let i = middlewares.length - 1; i >= 0; i--) {
        const Middleware = middlewares[i];
        routeObject.element = (
          <Middleware key={id + i}>{routeObject.element}</Middleware>
        );
      }
    }

    // 返回路由对象
    return routeObject;
  });
};
