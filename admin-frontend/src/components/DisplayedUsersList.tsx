import Button from "../../../common/src/components/Button";
import Card from "../../../common/src/components/Card";
import { http } from "../../../common/src/lib/http";
import { Role, User } from "../../../common/src/types/auth";
import React, { useState } from "react";

interface Props {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  usersToDisplay: User[];
}

const DisplayedUsersList = ({
  users,
  setUsers,
  usersToDisplay,
}: Props) => {
  // states for edit
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    username: string;
    password?: string;
    role: string;
  }>({
    username: "",
    password: "",
    role: "customer",
  });
  const [saving, setSaving] = useState(false);

  // states for delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function startEditing(u: User) {
    setEditingUserId(u.id);
    setEditData({ username: u.username, role: u.role, password: "" });
  }

  const handleDeleteUser = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await http<void>(`/v1/users/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    try {
      const updatedUser = await http<User>(`/v1/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editData),
      });
      setUsers(users.map((u) => (u.id === id ? updatedUser : u)));
      setEditingUserId(null);
    } catch (error) {
      console.error("Failed to update user", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {usersToDisplay.map((u) => (
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
    </ul>
  );
};

export default DisplayedUsersList;
