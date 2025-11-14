import { DiVisualstudio } from "react-icons/di";
import AppCard from "../ui/AppCard";
import { useEffect, useState } from "react";

const AllAppsPage = () => {
  // ------------------------------
  // APPLICATION STATES
  // ------------------------------
  const [apps, setApps] = useState([]); // All apps list
  const [totalApps, setTotalApps] = useState(0); // Total apps count
  const [totalPage, setTotalPage] = useState(0); // Total number of pages
  const [currentPage, setCurrentPage] = useState(0); // Current active page index

  // Sorting states
  const [sort, setSort] = useState("size"); // Default sort field
  const [order, setOrder] = useState(""); // asc / desc sorting order

  // Search input state
  const [searchText, setSearchText] = useState("");

  const limit = 15; // Number of items per page

  // ------------------------------
  // FETCH DATA WHEN STATE CHANGES
  // ------------------------------
  useEffect(() => {
    // API URL dynamically updates based on sort, pagination & search
    fetch(
      `http://localhost:5000/apps?limit=${limit}&skip=${
        currentPage * limit
      }&sort=${sort}&order=${order}&search=${searchText}`
    )
      .then((res) => res.json())
      .then((data) => {
        setApps(data.apps); // Set fetched apps
        setTotalApps(data.total); // Set total found apps

        // Calculate total pages
        const page = Math.ceil(data.total / limit);
        setTotalPage(page);
      })
      .catch((err) => console.log("Error loading apps:", err));
  }, [currentPage, order, sort, searchText]);

  // ------------------------------
  // HANDLE SORTING OPTIONS
  // ------------------------------
  const handleSelect = (e) => {
    const value = e.target.value;
    const [field, sortOrder] = value.split("-");

    setSort(field); // sort field → rating, size, downloads
    setOrder(sortOrder); // sort order → asc or desc

    setCurrentPage(0); // Reset page when sorting changes
  };

  // ------------------------------
  // HANDLE SEARCH INPUT
  // ------------------------------
  const handleSearch = (e) => {
    setSearchText(e.target.value); // Update search text
    setCurrentPage(0); // Reset to first page for new search
  };

  return (
    <div>
      <title>All Apps | Hero Apps</title>

      {/* ------------------------------
           PAGE HEADER SECTION
      --------------------------------*/}
      <div className="py-16">
        <h2 className="text-4xl font-bold text-center text-primary flex justify-center gap-3">
          Our All Applications
          <DiVisualstudio size={48} className="text-secondary" />
        </h2>

        <p className="text-center text-gray-400">
          Explore All Apps on the Market developed by us. We code for Millions
        </p>
      </div>

      {/* ------------------------------
           SEARCH & FILTER SECTION
      --------------------------------*/}
      <div className="w-11/12 mx-auto flex flex-col-reverse lg:flex-row gap-5 items-start justify-between lg:items-end mt-10">
        
        {/* Apps Count */}
        <div>
          <h2 className="text-lg underline font-bold">
            ({totalApps}) Apps Found
          </h2>
        </div>

        {/* Search Input */}
        <form>
          <label className="input max-w-[300px] w-[300px] input-secondary">
            {/* Search Icon */}
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>

            {/* Search Textbox */}
            <input
              onChange={handleSearch}
              type="search"
              placeholder="Search Apps"
              className=""
            />
          </label>
        </form>

        {/* Sorting Dropdown */}
        <div>
          <select onChange={handleSelect} className="select bg-white">
            <option selected disabled>
              Sort by (R / S / D)
            </option>
            <option value="rating-desc">Ratings : High → Low</option>
            <option value="rating-asc">Ratings : Low → High</option>
            <option value="size-desc">Size : High → Low</option>
            <option value="size-asc">Size : Low → High</option>
            <option value="downloads-desc">Downloads : High → Low</option>
            <option value="downloads-asc">Downloads : Low → High</option>
          </select>
        </div>
      </div>

      {/* ------------------------------
           APPS GRID SECTION
      --------------------------------*/}
      <div className="w-11/12 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 gap-5">

        {/* Empty State */}
        {apps.length === 0 ? (
          <div className="col-span-full text-center py-10 space-y-10">
            <h2 className="text-6xl font-semibold opacity-60">No Apps Found</h2>
            <button className="btn btn-primary">Show All Apps</button>
          </div>
        ) : (
          apps.map((app) => <AppCard key={app.id} app={app} />)
        )}
      </div>

      {/* ------------------------------
           PAGINATION SECTION
      --------------------------------*/}
      <div className="flex justify-center flex-wrap gap-3 py-10">
        
        {/* Previous Button */}
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn"
          >
            Prev
          </button>
        )}

        {/* Page Numbers */}
        {[...Array(totalPage).keys()].map((i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`btn ${i === currentPage && "btn-primary"}`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Button */}
        {currentPage < totalPage - 1 && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AllAppsPage;
