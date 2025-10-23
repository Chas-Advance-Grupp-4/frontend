import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import Card from "../../../common/src/components/Card";
import Button from "../../../common/src/components/Button";

interface User {
	id: string;
	username: string;
	role: string;
	created_at: string;
}

export default function UserManagementPage() {
	const { user, token } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [filter, setFilter] = useState<string>("");

	// states for create
	const [newUser, setNewUser] = useState<{
		username: string;
		password: string;
		role: string;
	}>({
		username: "",
		password: "",
		role: "customer",
	});
	const [creating, setCreating] = useState(false);

	// states for edit
	const [editingUserId, setEditingUserId] = useState<string | null>(null);
	const [editData, setEditData] = useState<{
		username: string;
		password?: string;
		role: string;
	}>({ username: "", password: "", role: "customer" });
	const [saving, setSaving] = useState(false);

	// states for delete
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		if (user?.role !== "admin") return;
		const fetchUsers = async () => {
			const res = await fetch("http://localhost:8000/api/v1/users", {
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			});
			if (!res.ok) {
				console.error("Failed to fetch users", await res.text());
				return;
			}
			const data = await res.json();
			setUsers(data);
		};
		fetchUsers();
	}, [user, token]);

	if (user?.role !== "admin") {
		return <p className="p-6 text-red-500">Access denied. Admins only.</p>;
	}

	const filteredUsers = filter
		? users.filter((u) =>
				u.username.toLowerCase().includes(filter.toLowerCase())
		  )
		: users;

	const handleCreateUser = async () => {
		setCreating(true);
		try {
			const res = await fetch("http://localhost:8000/api/v1/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify(newUser),
			});
			if (!res.ok) {
				console.error("Failed to create user", await res.text());
				return;
			}
			const createdUser = await res.json();
			setUsers([...users, createdUser]);
			setNewUser({ username: "", password: "", role: "customer" });
		} finally {
			setCreating(false);
		}
	};

	const handleDeleteUser = async (id: string) => {
		setDeletingId(id);
		try {
			const res = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
				method: "DELETE",
				headers: {
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			});
			if (res.ok) {
				setUsers(users.filter((u) => u.id !== id));
			} else {
				console.error("Failed to delete user", await res.text());
			}
		} finally {
			setDeletingId(null);
		}
	};

	const handleSaveEdit = async (id: string) => {
		setSaving(true);
		try {
			const res = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify(editData),
			});
			if (!res.ok) {
				console.error("Failed to update user", await res.text());
				return;
			}
			const updatedUser = await res.json();
			setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
			setEditingUserId(null);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="p-6 space-y-8">
			<h1 className="text-2xl font-bold">User Management</h1>

			{/* Create new user */}
			<div className="p-4 border rounded-md max-w-md">
				<h2 className="font-semibold mb-2">Create User</h2>
				<div className="space-y-3">
					<input
						type="text"
						className="border rounded p-2 w-full"
						placeholder="Username"
						value={newUser.username}
						onChange={(e) =>
							setNewUser({ ...newUser, username: e.target.value })
						}
					/>
					<input
						type="password"
						className="border rounded p-2 w-full"
						placeholder="Password"
						value={newUser.password}
						onChange={(e) =>
							setNewUser({ ...newUser, password: e.target.value })
						}
					/>
					<select
						className="border rounded p-2 w-full"
						value={newUser.role}
						onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
					>
						<option value="customer">Customer</option>
						<option value="admin">Admin</option>
						<option value="driver">Driver</option>
					</select>
					<Button
						variant="success"
						onClick={handleCreateUser}
						loading={creating}
					>
						{creating ? "Creating…" : "Add User"}
					</Button>
				</div>
			</div>

			{/* Filter */}
			<div className="flex items-center gap-4">
				<input
					type="text"
					className="border rounded p-2 flex-1"
					placeholder="Filter by username"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
				/>
			</div>

			{/* Users list */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredUsers.map((u) => (
					<Card key={u.id} title={u.username} subtitle={`Role: ${u.role}`}>
						{editingUserId === u.id ? (
							<div className="space-y-2">
								<input
									type="text"
									className="border rounded p-2 w-full"
									value={editData.username}
									onChange={(e) =>
										setEditData({ ...editData, username: e.target.value })
									}
								/>
								<input
									type="password"
									className="border rounded p-2 w-full"
									placeholder="New Password (optional)"
									value={editData.password}
									onChange={(e) =>
										setEditData({ ...editData, password: e.target.value })
									}
								/>
								<select
									className="border rounded p-2 w-full"
									value={editData.role}
									onChange={(e) =>
										setEditData({ ...editData, role: e.target.value })
									}
								>
									<option value="customer">Customer</option>
									<option value="admin">Admin</option>
									<option value="driver">Driver</option>
								</select>
								<div className="flex gap-2">
									<Button
										variant="success"
										onClick={() => handleSaveEdit(u.id)}
										loading={saving}
									>
										{saving ? "Saving…" : "Save"}
									</Button>
									<Button
										variant="secondary"
										onClick={() => setEditingUserId(null)}
									>
										Cancel
									</Button>
								</div>
							</div>
						) : (
							<>
								<p className="text-xs text-gray-500">
									Created: {new Date(u.created_at).toLocaleDateString()}
								</p>
								<div className="mt-3 flex gap-2">
									<Button variant="primary" onClick={() => startEditing(u)}>
										Edit
									</Button>
									<Button
										variant="danger"
										appearance="filled"
										onClick={() => handleDeleteUser(u.id)}
										loading={deletingId === u.id}
									>
										{deletingId === u.id ? "Deleting…" : "Delete"}
									</Button>
								</div>
							</>
						)}
					</Card>
				))}
			</div>
		</div>
	);

	function startEditing(u: User) {
		setEditingUserId(u.id);
		setEditData({ username: u.username, role: u.role, password: "" });
	}
}
