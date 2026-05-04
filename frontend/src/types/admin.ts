import type { Application } from "./candidate";
import type { User } from "./auth";
import type { Job } from "./job";

export type AdminUserList = {
  items: User[];
  total: number;
};

export type AdminJobList = {
  items: Job[];
  total: number;
};

export type AdminApplicationList = {
  items: Application[];
  total: number;
};
