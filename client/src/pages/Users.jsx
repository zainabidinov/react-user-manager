import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ImUnlocked } from "react-icons/im";
import { FaLock } from "react-icons/fa";
import axios from "axios";

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [deleteAttempts, setDeleteAttempts] = useState(0);
  const [blockAttempts, setBlockAttempts] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAllChecked(isChecked);
    setUsers(users.map((user) => ({ ...user, isChecked })));
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/users`
      );
      setUsers(
        response.data.rows.map((user) => ({ ...user, isChecked: false }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/current-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentUser(response.data);
      if (!response.data) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCurrentUser();
  }, []);

  const handleBlockSelectedUsers = async () => {
    if (
      (blockAttempts > 0 && currentUser.status === "blocked") ||
      !users.find((user) => user.id === currentUser.id)
    ) {
      handleLogout();
    } else {
      try {
        const selectedUsers = users.filter((user) => user.isChecked);

        await Promise.all(
          selectedUsers.map(async (user) => {
            await axios.put(
              `${process.env.REACT_APP_SERVERURL}/block/${user.id}`
            );
          })
        );
        fetchData();
        setBlockAttempts((prevValue) => prevValue + 1);
        fetchCurrentUser();
      } catch (error) {
        console.error("Error blocking users:", error);
      }
    }
  };

  const handleUnblockSelectedUsers = async () => {
    if (
      (blockAttempts > 0 && currentUser.status === "blocked") ||
      (deleteAttempts > 0 && !users.find((user) => user.id === currentUser.id))
    ) {
      handleLogout();
    } else {
      try {
        const selectedUsers = users.filter((user) => user.isChecked);

        await Promise.all(
          selectedUsers.map(async (user) => {
            await axios.put(
              `${process.env.REACT_APP_SERVERURL}/unblock/${user.id}`
            );
          })
        );
        fetchData();
      } catch (error) {
        console.error("Error blocking users:", error);
      }
    }
  };

  const handleDeleteSelectedUsers = async () => {
    if (
      (deleteAttempts > 0 &&
        !users.find((user) => user.id === currentUser.id)) ||
      currentUser.status === "blocked"
    ) {
      handleLogout();
    } else {
      try {
        const selectedUsers = users.filter((user) => user.isChecked);
        await Promise.all(
          selectedUsers.map(async (user) => {
            await axios.delete(
              `${process.env.REACT_APP_SERVERURL}/delete/${user.id}`
            );
          })
        );
        fetchData();
        setDeleteAttempts((prevValue) => prevValue + 1);
      } catch (error) {
        console.error("Error deleting users:", error);
      }
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="bg-gray-300 flex justify-end">
        <div className="flex flex-row py-3 pr-10 gap-2">
          <h1>Hello, {currentUser.name}!</h1>{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="h-full w-full mt-10 flex justify-center content-center">
        <div className="max-w-[1000px] w-full">
          <div className="flex gap-4">
            <button
              onClick={handleBlockSelectedUsers}
              className="border border-gray-950 px-2 py-1 rounded-sm flex items-center gap-1"
            >
              <FaLock />
              Block
            </button>
            <button
              onClick={handleUnblockSelectedUsers}
              className="border border-gray-950 px-4 py-1 rounded-sm text-lg"
            >
              <ImUnlocked />
            </button>
            <button
              onClick={handleDeleteSelectedUsers}
              className="border border-gray-950 px-4 py-1 rounded-sm bg-red-500 text-white text-lg"
            >
              <RiDeleteBin5Fill />
            </button>
          </div>

          <table className="w-full table-fixed border border-collapse mt-4">
            <thead>
              <tr>
                <th className="border border-black bg-gray-300">
                  <input
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th className="border border-black bg-gray-300">
                  Name
                  <br /> Position
                </th>
                <th className="border border-black bg-gray-300">e-Mail</th>
                <th className="border border-black bg-gray-300">Last Login</th>
                <th className="border border-black bg-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border border-black">
                    <input
                      type="checkbox"
                      checked={user.isChecked}
                      onChange={(e) =>
                        setUsers(
                          users.map((u) =>
                            u.id === user.id
                              ? { ...u, isChecked: e.target.checked }
                              : u
                          )
                        )
                      }
                    />
                  </td>
                  <td className="border border-black">
                    {user.name}
                    <br />
                    {user.position}
                  </td>
                  <td className="border border-black">{user.email}</td>
                  <td className="border border-black">
                    {formatTimestamp(user.last_login)}
                  </td>
                  <td className="border border-black">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
