import 'preact';

declare module 'preact' {
  interface Options {
    /** _diff */
    __b?(vnode: VNode): void;
    /** _render */
    __r?(vnode: VNode): void;
    /** _commit */
    __c?(vnode: VNode, commitQueue: any[]): void;
    /** _catchError */
    __e(
      error: any,
      vnode: VNode,
      oldVNode?: VNode | undefined,
      errorInfo?: ErrorInfo | undefined,
    ): void;
  }

  interface VNode {
    /** _component */
    __c?: Component | null;
  }

  interface Component {
    /** _vnode */
    __v?: VNode<P> | null;
  }
}
