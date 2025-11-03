import Button from "../../../common/src/components/Button";
import { http } from "../../../common/src/lib/http";
import { User } from "../../../common/src/types/auth";
import React, { useState } from "react";
import ToastNotification, {
  ToastType,
} from "../../../common/src/components/ToastNotification";

interface Props {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}
const CreateUserForm = ({ users, setUsers }: Props) => {
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
  const[feedbackShown, setFeedbackShown] = useState(false);
  const [feedBackMessage, setFeedBackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<ToastType>("success");
  
  const resetForm = () => {
    setNewUser({ username: "", password: "", role: "customer" });
  }

  const showFeedback = (message:string, type:ToastType) => {
    setFeedbackShown(true);
    setFeedbackType(type);
    setFeedBackMessage(message);
    setTimeout(() => {
      setFeedbackShown(false);
    }, 3000);
  }

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    try {
      const createdUser = await http<User>("/v1/users/register", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      setUsers([...users, createdUser]);
      resetForm();
      showFeedback('User created successfully!', 'success');
    } catch (error) {
      console.error("Failed to create user:", error);
      showFeedback('Failed to create user. Please try again.', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <form
      className="p-4 border rounded-md max-w-md"
      onSubmit={(e) => handleCreateUser(e)}
    >
      <h2 className="font-semibold mb-2">Create User</h2>
      <div className="space-y-3">
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          className="border rounded p-2 w-full"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
          // onClick={handleCreateUser}
          loading={creating}
          type="submit"
        >
          {creating ? "Creating…" : "Add User"}
        </Button>
      </div>
      {feedbackShown && (
        <ToastNotification toastType={feedbackType} message={feedBackMessage} />
      )}
    </form>
  );
};

export default CreateUserForm;
