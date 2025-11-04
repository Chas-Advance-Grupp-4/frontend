import Button from "../../../common/src/components/Button";
import { http } from "../../../common/src/lib/http";
import { User } from "../../../common/src/types/auth";
import React, { useState } from "react";
import ToastNotification, {
  ToastType,
} from "../../../common/src/components/ToastNotification";
import Input from "../../../common/src/components/form/Input";
import Select from "../../../common/src/components/form/Select";
import Option from "../../../common/src/components/form/Option";

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
    const [feedback, setFeedback] = useState<{
      message: string;
      type: "success" | "error";
      shown: boolean;
    }>({ message: "", type: "success", shown: false });
  
  const resetForm = () => {
    setNewUser({ username: "", password: "", role: "customer" });
  }

  const showFeedback = (message:string, type:ToastType) => {
    setFeedback({ message, type, shown: true });
    setTimeout(() => {
      setFeedback({ message: "", type:'success', shown: false });
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
      showFeedback(`User ${createdUser.username} has been created successfully!`, 'success');
    } catch (error) {
      console.error("Failed to create user:", error);
      showFeedback('Failed to create user. Please try again.', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <form
      className="p-4 shadow-xl rounded-md max-w-md"
      onSubmit={(e) => handleCreateUser(e)}
    >
      <h2 className="font-semibold mb-2">Create User</h2>
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <Select
          
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <Option value="customer">Customer</Option>
          <option value="admin">Admin</option>
          <option value="driver">Driver</option>
        </Select>
        <Button
          variant="success"
          // onClick={handleCreateUser}
          loading={creating}
          type="submit"
        >
          {creating ? "Creating…" : "Add User"}
        </Button>
      </div>
      {feedback.shown && (
        <ToastNotification
          toastType={feedback.type}
          message={feedback.message}
        />
      )}
    </form>
  );
};

export default CreateUserForm;
