"use client";

import * as React from "react";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  open?: boolean;
  duration?: number;
  [key: string]: unknown;
};

type State = { toasts: ToasterToast[] };

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

const listeners = new Set<(s: State) => void>();
let memoryState: State = { toasts: [] };
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

function genId() {
  return Math.random().toString(36).slice(2, 10);
}
function addToRemoveQueue(id: string) {
  if (timeouts.has(id)) return;
  const t = setTimeout(() => {
    timeouts.delete(id);
    dispatch({ type: "REMOVE_TOAST", toastId: id });
  }, TOAST_REMOVE_DELAY);
  timeouts.set(id, t);
}

function dispatch(action: Action) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = {
        ...memoryState,
        toasts: [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
      };
      break;
    case "UPDATE_TOAST":
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
      break;
    case "DISMISS_TOAST": {
      const id = action.toastId;
      if (id) addToRemoveQueue(id);
      else memoryState.toasts.forEach((t) => addToRemoveQueue(t.id));
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.map((t) =>
          !id || t.id === id ? { ...t, open: false } : t
        ),
      };
      break;
    }
    case "REMOVE_TOAST": {
      const id = action.toastId;
      memoryState = {
        ...memoryState,
        toasts: id ? memoryState.toasts.filter((t) => t.id !== id) : [],
      };
      break;
    }
  }
  listeners.forEach((l) => l(memoryState));
}

export function toast(input: Omit<ToasterToast, "id">) {
  const id = genId();
  dispatch({ type: "ADD_TOAST", toast: { id, open: true, ...input } });
  return id;
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);
  React.useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState); // ✅ niente 'void'
    };
  }, []);
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}
