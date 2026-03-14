import axios from "axios";
import { create } from "zustand";
import { api } from "../services/api";

export type AttendanceProps = {
  studentId: string;
  fullName: string;
  email: string;
  isPresent: boolean;
};

export type AttendanceStore = {
  attendance: AttendanceProps[];
  token: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  clearError: () => void;
  clearSuccess: () => void;
  fetchAttendance: (classId: string) => Promise<void>;
  markAttendance: (
    classId: string,
    studentId: string,
    isPresent: boolean,
    date: Date,
  ) => Promise<void>;
  generateQrCode: (classId: string, date: Date) => Promise<void>;
  scanQrCode: (
    token: string,
    latitude: number,
    longitude: number,
  ) => Promise<void>;
};

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  attendance: [],
  token: "",
  loading: false,
  error: null,
  success: null,
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),
  fetchAttendance: async (classSessionId: string) => {
    try {
      set({ loading: true });
      const response = await api.get(`/attendance/${classSessionId}`);
      console.log(response.data);

      set({ attendance: response.data.sheet });
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to fetch attendance";
      set({ error: msg || "Failed to fetch attendance" });
    } finally {
      set({ loading: false });
    }
  },
  markAttendance: async (
    classId: string,
    studentId: string,
    isPresent: boolean,
    date: Date,
  ) => {
    try {
      set({ loading: true });

      set((state) => ({
        attendance: state.attendance.map((student) =>
          student.studentId === studentId ? { ...student, isPresent } : student,
        ),
      }));

      const response = await api.post(`/attendance/${classId}`, {
        studentId,
        isPresent,
        date,
      });

      set({ success: response.data.message });
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to mark attendance";
      set({ error: msg || "Failed to mark attendance" });
    } finally {
      set({ loading: false });
    }
  },
  generateQrCode: async (classId: string, date: Date) => {
    try {
      set({ loading: true });
      const response = await api.get(`/generate-qr/${classId}/${date}`);
      set({ token: response.data.token });
      set({ success: response.data.message || "QR code generated!" });
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to generate QR code";
      set({ error: msg || "Failed to generate QR code" });
    } finally {
      set({ loading: false });
    }
  },
  scanQrCode: async (token: string, latitude: number, longitude: number) => {
    try {
      set({ loading: true });
      const response = await api.post(`/scan-qr`, {
        token,
        latitude,
        longitude,
      });
      set({ success: response.data.message || "QR code scanned!" });
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to scan QR code";
      set({ error: msg || "Failed to scan QR code" });
    } finally {
      set({ loading: false });
    }
  },
}));
