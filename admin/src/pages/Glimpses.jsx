import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/admin_assets/assets";

const Glimpses = ({ token }) => {
  const [image, setImage] = useState(null);
  const [glimpses, setGlimpses] = useState([]);

  const fetchGlimpses = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/glimpses/list");
      if (response.data.success) {
        setGlimpses(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch glimpses");
    }
  };

  useEffect(() => {
    fetchGlimpses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(backendUrl + "/api/glimpses/add", formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("Image uploaded successfully");
        setImage(null);
        fetchGlimpses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/glimpses/delete",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Image deleted");
        fetchGlimpses();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Add Section */}
      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <p className="mb-2">Upload a Glimpse Image</p>
        <label htmlFor="glimpse-image" className="cursor-pointer">
          <img
            className="w-32 border rounded"
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Upload Preview"
          />
          <input
            type="file"
            id="glimpse-image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        <button
          type="submit"
          className="w-28 py-2 bg-black text-white rounded"
        >
          Upload
        </button>
      </form>

      {/* List Section */}
      <div className="mt-4">
        <p className="mb-2 text-lg font-semibold">Uploaded Glimpses</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {glimpses.map((item, index) => (
            <div key={index} className="relative">
              <img
                src={item.image}
                alt={`glimpse-${index}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Glimpses;