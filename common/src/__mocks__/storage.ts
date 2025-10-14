import { vi } from "vitest";

const store: Record<string, string> = {};

export const getJSON = vi.fn((key: string) => {
	return store[key] ? JSON.parse(store[key]) : null;
});

export const setJSON = vi.fn((key: string, value: any) => {
	store[key] = JSON.stringify(value);
});

export const remove = vi.fn((key: string) => {
	delete store[key];
});

export const __clearStore = () => {
	Object.keys(store).forEach((key) => delete store[key]);
};
