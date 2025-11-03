import React, { useState, useEffect, useRef, use } from "react";
import { useAuth } from "../../../common/src/hooks/auth/AuthProvider";
import { Role, User } from "common/src/types/auth";
import FilterUsersByRole from "../components/FilterUsersByRole";
import CreateUserForm from "../components/CreateUserForm";
import { http } from "../../../common/src/lib/http";
import SearchUsersField from "../components/SearchUsersField";
import DisplayedUsersList from "../components/DisplayedUsersList";

export default function UserManagementPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const [usersToDisplay, setUsersToDisplay] = useState<User[]>(users);
  const [inputSearchedUser, setInputSearchedUser] = useState<string>("");

  const [roleFilter, setRoleFilter] = useState<"no filter" | Role>("no filter");

  // ⬇️ Fetch users on component mount plus when user or token changes
  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchUsers = async () => {
      try {
        const data = await http<User[]>("/v1/users", {
          method: "GET",
        });
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, [user, token]);

  // 🔄 Update usersToDisplay whenever users change
  useEffect(() => {
    setUsersToDisplay(users);
  }, [users]);

  // 🔍 Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredUsers = users.filter((u) => {
      const matchesRole =
        roleFilter === "no filter" ? true : u.role === roleFilter;
      const matchesUsername = u.username
        .toLowerCase()
        .includes(inputSearchedUser.toLowerCase());
      return matchesRole && matchesUsername;
    });
    setUsersToDisplay(filteredUsers);
  };

  return user?.role !== "admin" ? (
    // ❌ deny access if not admin
    <p className="p-6 text-red-500">Access denied. Admins only.</p>
  ) : (
    // ✅ grant access to admin user management page
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/*➕👤 Create new user */}
      <CreateUserForm users={users} setUsers={setUsers} />

      {/* 🔍 Search and filter section */}

      <form className="flex flex-wrap gap-4" onSubmit={handleSearch}>
        <SearchUsersField
          allUsers={users}
          roleFilter={roleFilter}
          inputSearchedUser={inputSearchedUser}
          setInputSearchedUser={setInputSearchedUser}
        />

        <FilterUsersByRole
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | "no filter")}
        />
      </form>

      {/* Users list */}
      <DisplayedUsersList
        users={users}
        setUsers={setUsers}
        usersToDisplay={usersToDisplay}
      />
    </div>
  );
}
