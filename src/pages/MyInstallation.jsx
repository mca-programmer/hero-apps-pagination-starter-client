import { useEffect, useState } from "react";
import { GrInstall } from "react-icons/gr";
import { useLoaderData } from "react-router";
import InstallCard from "../ui/InstallCard";
import { toast } from "react-toastify";

const MyInstallation = () => {
  // Get installed app IDs from localStorage
  const [myAppsIds] = useState(JSON.parse(localStorage.getItem("apps")) || []);
  
  // Load all apps from loader
  const allApps = useLoaderData();
  
  // State for user's installed apps
  const [myApps, setMyApps] = useState([]);

  // Populate myApps based on stored IDs
  useEffect(() => {
    const apps = myAppsIds
      .map((id) => allApps.find((app) => app._id == id))
      .filter(Boolean); // remove null/undefined
    setMyApps(apps);
  }, [allApps, myAppsIds]);

  // Sort apps by size
  const handleSort = (type) => {
    const sorted =
      type === "asc"
        ? [...myApps].sort((a, b) => a.size - b.size)
        : [...myApps].sort((a, b) => b.size - a.size);

    setMyApps(sorted);
  };

  // Uninstall app and update localStorage
  const onUninstall = (id, title) => {
    const remaining = myApps.filter((app) => app._id !== id);
    setMyApps(remaining);

    const remainingIds = remaining.map((app) => app._id);
    localStorage.setItem("apps", JSON.stringify(remainingIds));

    toast(`🗑️ ${title} un-installed from your Device`);
  };

  return (
    <div className="px-5 lg:w-11/12 mx-auto py-10">
      <title>My Installations</title>

      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-center text-primary flex justify-center gap-3">
          Your Installed Apps
          <GrInstall size={48} className="text-secondary" />
        </h2>
        <p className="text-center text-gray-400">
          Explore all trending apps developed by us
        </p>
      </div>

      {/* Sort & Count */}
      <div className="flex justify-between mt-10 sticky">
        <h2 className="text-lg underline text-secondary font-medium">
          {myApps.length} Apps Found
        </h2>
        <select
          onChange={(e) => handleSort(e.target.value)}
          className="select bg-white"
        >
          <option selected disabled>
            Sort By Size
          </option>
          <option value="asc">Low-High</option>
          <option value="desc">High-Low</option>
        </select>
      </div>

      <div className="divider"></div>

      {/* Installed Apps List */}
      <div className="grid grid-cols-1 gap-5">
        {myApps.map((app) => (
          <InstallCard
            key={app._id} // Use _id from MongoDB
            app={app}
            onUninstall={onUninstall}
          />
        ))}
      </div>
    </div>
  );
};

export default MyInstallation;
