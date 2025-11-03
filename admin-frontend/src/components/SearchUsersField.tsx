import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { Role, User } from "../../../common/src/types/auth";

type Props = {
  allUsers: User[];
  roleFilter: "no filter" | Role;
  inputSearchedUser: string;
  setInputSearchedUser: React.Dispatch<React.SetStateAction<string>>;
  setUsersToDisplay: React.Dispatch<React.SetStateAction<User[]>>;
};

const SearchUsersField = ({
  allUsers,
  roleFilter,
  inputSearchedUser,
  setInputSearchedUser,
  setUsersToDisplay,
}: Props) => {
  const [isShowingSearchSuggestions, setIsShowingSearchSuggestions] =
    useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const searchFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dismissSearchSuggestions = (e: MouseEvent) => {
      if (
        searchFieldRef.current &&
        !searchFieldRef.current.contains(e.target as Node)
      ) {
        setIsShowingSearchSuggestions(false);
      }
    };
    document.body.addEventListener("click", dismissSearchSuggestions);
    return () => {
      document.body.removeEventListener("click", dismissSearchSuggestions);
    };
  }, []);

  const handleSearchSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchedUser(e.target.value);
    const inputValue = e.target.value;
    // Leave this function if input is empty
    if (inputValue.length === 0) {
      setIsShowingSearchSuggestions(false);
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
    <div ref={containerRef} className="flex items-center gap-4 relative">
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
      <button
        className="absolute bg-blue-100 h-full rounded-l-lg hover:bg-blue-200 shadow-sm"
        type="submit"
      >
        <MagnifyingGlassIcon className="h-6 w-6 ml-2 text-blue-700" />
      </button>

      {/* Search suggestions list 🧐 */}
      {searchSuggestions.length > 0 && isShowingSearchSuggestions ? (
        <ul
          role="listbox"
          className="w-full rounded-2xl shadow-2xl absolute top-12 bg-gray-100  "
        >
          {searchSuggestions.map((u) => (
            <li
              key={u.id}
              role="option"
              className="hover:bg-gray-200 rounded-2xl w-full"
            >
              <button
                onClick={(e) => {
                  // e.stopPropagation();
                  setInputSearchedUser(u.username);
                  setUsersToDisplay([u]);
                  setIsShowingSearchSuggestions(false);
                }}
                className="flex w-full p-2 rounded-2xl text-left"
              >
                {u.username}
              </button>
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
