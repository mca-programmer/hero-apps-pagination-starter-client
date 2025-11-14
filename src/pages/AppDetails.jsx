import { useEffect, useMemo, useState } from "react";
import { BiDownload } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";
import { MdReviews } from "react-icons/md";
import { useLoaderData, useParams } from "react-router";
import ReviewChart from "../ui/ReviewChart";
import NotFound from "../ui/NotFound";
import frame from "../utils/confetti";
import { toast } from "react-toastify";

const AppDetails = () => {
  const app = useLoaderData();
  const { id } = useParams();

  // Track app install status
  const [isInstalled, setIsInstalled] = useState(false);

  // Check installation on mount
  useEffect(() => {
    const installedIds = JSON.parse(localStorage.getItem("apps")) || [];
    if (installedIds.includes(id)) setIsInstalled(true);
  }, [id]);

  // Destructure app data safely
  const {
    image,
    title,
    companyName,
    description,
    size,
    reviews,
    ratingAvg,
    downloads,
    ratings,
  } = app || {};

  // Reverse rating list (latest first)
  const finalRatings = useMemo(() => {
    return ratings ? [...ratings].reverse() : [];
  }, [ratings]);

  // If no data → show 404
  if (!app) {
    return <NotFound message="App Is Not Found" />;
  }

  // Handle Install Action
  const handleInstall = () => {
    const installedIds = JSON.parse(localStorage.getItem("apps")) || [];
    installedIds.push(id);
    localStorage.setItem("apps", JSON.stringify(installedIds));

    setIsInstalled(true);
    toast.success(`Yahoo ⚡!! ${title} Installed Successfully`);
    frame(3); // Confetti animation
  };

  return (
    <div className="w-11/12 mx-auto space-y-5 py-20">
      <title>{title || "404 - App Not Found"}</title>

      {/* Top: Image + Basic Info */}
      <div className="flex lg:flex-row flex-col gap-5 items-stretch">
        {/* App Image */}
        <div className="flex-1">
          <img src={image} className="rounded-xl shadow-2xl h-full" alt="" />
        </div>

        {/* App Details */}
        <div className="flex-2">
          <div className="space-y-3 border-b-2 pb-4 border-secondary">
            <h2 className="text-primary text-3xl font-bold">{title}</h2>
            <p>
              Developed by{" "}
              <span className="text-secondary font-medium">
                {companyName}
              </span>
            </p>
          </div>

          {/* Stats Section */}
          <div className="py-5 flex justify-between items-center">
            <div className="stats stats-horizontal">
              
              {/* Downloads */}
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <BiDownload size={48} />
                </div>
                <div className="stat-title">Downloads</div>
                <div className="stat-value">{downloads}</div>
              </div>

              {/* Average Rating */}
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaStar size={48} />
                </div>
                <div className="stat-title">Average Rating</div>
                <div className="stat-value">{ratingAvg}</div>
              </div>

              {/* Total Reviews */}
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <MdReviews size={48} />
                </div>
                <div className="stat-title">Total Reviews</div>
                <div className="stat-value">{reviews}</div>
              </div>
            </div>
          </div>

          {/* Install Button */}
          <div>
            {isInstalled ? (
              <button className="btn btn-success bg-success text-white shadow-xl disabled:opacity-80 btn-xl">
                Installed
              </button>
            ) : (
              <button
                onClick={handleInstall}
                className="btn btn-success bg-success text-white shadow-xl hover:shadow-2xl btn-xl"
              >
                Install Now ({size}MB)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Ratings Chart */}
      <div>
        <h2 className="text-4xl font-bold text-primary mb-5">Ratings</h2>
        <ReviewChart ratings={finalRatings} />
      </div>

      <div className="divider" />

      {/* Description */}
      <div>
        <h2 className="text-4xl font-bold text-primary mb-5">Description</h2>
        <div className="text-justify space-y-3 opacity-60">
          {description?.split("\n").map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
