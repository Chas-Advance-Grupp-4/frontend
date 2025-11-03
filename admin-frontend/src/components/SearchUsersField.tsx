import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Role, User } from "../../../common/src/types/auth";
import Button from "../../../common/src/components/Button";

type Props = {
  allUsers: User[];
  roleFilter: "no filter" | Role;
  inputSearchedUser: string;
    setInputSearchedUser: React.Dispatch<React.SetStateAction<string>>;
};

const SearchUsersField = ({
  allUsers,
  roleFilter,
  inputSearchedUser,
    setInputSearchedUser,
  
}: Props) => {
  const [isShowingSearchSuggestions, setIsShowingSearchSuggestions] =
    useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);

  const searchFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.addEventListener("click", dismissSearchSuggestions);
  }, [inputSearchedUser]);

  const dismissSearchSuggestions = () => {
    setIsShowingSearchSuggestions(false);
  };

 

  const handleSearchSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchedUser(e.target.value);
    const inputValue = e.target.value;
    // Leave this function if input is empty
    if (inputValue.length === 0) {
      dismissSearchSuggestions();
      setSearchSuggestions([]);
      return;
    }

    // Filter suggestions based on input and role filter
    const filteredSuggestions = allUsers.filter((u) => {
      const matchesRole =
        roleFilter === "no filter" ? true : u.role === roleFilter;
      const matchesUsername = u.username
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      return matchesRole && matchesUsername;
    });

    setSearchSuggestions(filteredSuggestions);
    setIsShowingSearchSuggestions(true);
  };


  return (
    <div className="flex items-center gap-4 relative">
      {/* 💬 search field */}
      <input
        ref={searchFieldRef}
        type="search"
        className="rounded-lg p-2 flex-1 pl-9 placeholder:text-gray-500 shadow-md hover:shadow-lg"
        placeholder="Search by username"
        value={inputSearchedUser}
        onChange={(e) => {
          handleSearchSuggestions(e);
        }}
      />

      {/*🔍 search button */}
      <button className="absolute bg-blue-100 h-full rounded-l-lg hover:bg-blue-200 shadow-sm" type="submit">
        <MagnifyingGlassIcon className="h-6 w-6 ml-2 text-blue-700" />
      </button>

      {/* Search suggestions list 🧐 */}
      {searchSuggestions.length > 0 ? (
        <ul className="w-full rounded-2xl shadow-2xl absolute top-12 bg-gray-100 p-2 ">
          {searchSuggestions.map((u) => (
            <li key={u.id} className="hover:bg-gray-200 p-2 rounded-md">
              {u.username}
            </li>
          ))}
        </ul>
      ) : (
        isShowingSearchSuggestions && (
          <p className="w-full rounded-2xl shadow-2xl absolute top-12 bg-gray-100 p-4 ">
            No users found.
          </p>
        )
      )}
    </div>
  );
};

export default SearchUsersField;
