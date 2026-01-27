import type { Component } from "vue";

export interface ToolbarAction {
  key: string;
  label?: string;
  icon?: Component;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "secondary"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  show?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isIconOnly?: boolean;
  tooltip?: string;
}
