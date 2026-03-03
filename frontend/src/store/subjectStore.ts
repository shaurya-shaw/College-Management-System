import { create } from "zustand";
import { api } from "../services/api";

export type SubjectProps = {
  name: string;
  _id: string;
  branch:
    | {
        name: string;
        _id: string;
      }
    | string;
};

type BranchStore = {
  subject: SubjectProps[];
  fetchSubjects: () => Promise<void>;
  addSubject: (data: SubjectProps) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
};

export const useSubjectStore = create<BranchStore>((set) => ({
  subject: [],
  fetchSubjects: async () => {
    try {
      const res = await api.get("/all-subjects");
      console.log(res.data);
      set({ subject: res.data.subjects || [] });
    } catch (error) {
      console.log(error);
    }
  },
  addSubject: async (data) => {
    try {
      const res = await api.post("/add-subject", data);
      console.log(res.data);
      set((state) => ({ subject: [...state.subject, res.data.subject] }));
    } catch (error) {
      console.log(error);
    }
  },
  deleteSubject: async (id) => {
    try {
      await api.delete(`/delete-subject/${id}`);
      set((state) => ({ subject: state.subject.filter((t) => t._id !== id) }));
    } catch (error) {
      console.log(error);
    }
  },
}));
