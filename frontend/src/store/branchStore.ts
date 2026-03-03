import { create } from "zustand";
import { api } from "../services/api";

export type BranchProps = {
  name: string;
  _id: string;
};

type BranchStore = {
  branch: BranchProps[];
  totalPages: number;
  fetchBranches: (page?: number) => Promise<void>;
  addBranch: (data: BranchProps) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
};

export const useBranchStore = create<BranchStore>((set) => ({
  branch: [],
  totalPages: 0,
  fetchBranches: async (page?: number) => {
    try {
      let url = `/branches`;
      if (page) {
        url += `/?page=${page}`;
      }
      const res = await api.get(url);
      console.log(res.data);
      set({ branch: res.data.branches || [], totalPages: res.data.totalPages });
    } catch (error) {
      console.log(error);
    }
  },
  addBranch: async (data) => {
    try {
      const res = await api.post("/branch", data);
      console.log(res.data);
      set((state) => ({ branch: [...state.branch, res.data.branch] }));
    } catch (error) {
      console.log(error);
    }
  },
  deleteBranch: async (id) => {
    try {
      await api.delete(`/branch/${id}`);
      set((state) => ({ branch: state.branch.filter((t) => t._id !== id) }));
    } catch (error) {
      console.log(error);
    }
  },
}));
