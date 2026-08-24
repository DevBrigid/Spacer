import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createSpace,
  saveSpace,
  removeSpace,
} from "../../store/spacesSlice";
import LocationPicker from "../../components/LocationPicker";

function ManageSpaces() {

  const dispatch = useDispatch();

  const spaces = useSelector(
    (state) => state.spaces.spaces
  );


  const [showForm, setShowForm] = useState(false);

  const [editingSpace, setEditingSpace] =
    useState(null);


  const [formData, setFormData] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    pricePerHour: "",
    capacity: "",
    description: "",
    status: "Available",
  });
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [formError, setFormError] = useState("");


  /* HANDLE INPUT */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  /* RESET FORM */

  const resetForm = () => {

    setFormData({
      name: "",
      location: "",
      latitude: "",
      longitude: "",
      pricePerHour: "",
      capacity: "",
      description: "",
      status: "Available",
    });

    setEditingSpace(null);
    setLocationError("");
    setFormError("");
    setIsLocating(false);

    setShowForm(false);

  };


  /* ADD / UPDATE */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.latitude || !formData.longitude) {
      setFormError("Select the space location on the map before saving.");
      return;
    }


    const space = {

      ...formData,

      pricePerHour:
        Number(formData.pricePerHour),

      capacity:
        Number(formData.capacity),

      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };


    try {
      if (editingSpace) {
        await dispatch(saveSpace({ id: editingSpace.id, ...space })).unwrap();
      } else {
        await dispatch(createSpace(space)).unwrap();
      }
      resetForm();
    } catch (error) {
      setFormError(error || "The space could not be saved.");
    }

  };


  /* EDIT */

  const handleEdit = (space) => {

    setEditingSpace(space);

    setFormData({
      name: space.name,
      location: space.location,
      latitude: space.latitude ?? "",
      longitude: space.longitude ?? "",
      pricePerHour: space.pricePerHour,
      capacity: space.capacity,
      description: space.description || "",
      status: space.status,
    });

    setShowForm(true);

  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((current) => ({
          ...current,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6),
        }));
        setIsLocating(false);
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? "Location access was denied. Choose the location on the map instead."
          : "We could not get your location. Please try again or choose it on the map.";
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };


  /* DELETE */

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this space?"
      );

    if (confirmed) {

      try {
        await dispatch(removeSpace(id)).unwrap();
      } catch (error) {
        window.alert(error || "The space could not be deleted.");
      }

    }

  };


  return (

    <div className="admin-page">


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          Spacer
        </div>


        <nav className="sidebar-nav">

          <a
            href="/admin"
            className="nav-link"
          >
            Dashboard
          </a>

          <a
            href="/admin/spaces"
            className="nav-link active"
          >
            Manage Spaces
          </a>

          <a
            href="/admin/bookings"
            className="nav-link"
          >
            Booking History
          </a>

          <a
            href="/admin/users"
            className="nav-link"
          >
            Manage Users
          </a>

          <a
            href="/admin/profile"
            className="nav-link"
          >
            Profile
          </a>

        </nav>

      </aside>


      {/* MAIN */}

      <main className="admin-main">


        {/* HEADER */}

        <header className="admin-header">

          <div>

            <h1>
              Manage Spaces
            </h1>

            <p>
              Add and manage spaces available
              on Spacer.
            </p>

          </div>


          <button
            className="primary-button"
            onClick={() => {

              setEditingSpace(null);

              setShowForm(true);

            }}
          >
            + Add Space
          </button>

        </header>


        {/* FORM */}

        {showForm && (

          <div className="form-card">

            <div className="form-header">

              <h2>
                {editingSpace
                  ? "Edit Space"
                  : "Add New Space"}
              </h2>

              <button
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="form-grid">


                {/* NAME */}

                <div className="input-group">

                  <label>
                    Space Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter space name"
                    required
                  />

                </div>

                {/* MAP LOCATION */}

                <div className="input-group full location-picker">

                  <div className="location-picker-header">
                    <div>
                      <label>Choose location on map</label>
                      <p>Click the map to place a pin, then drag it to refine the location.</p>
                    </div>
                    <button type="button" className="secondary-button" onClick={useCurrentLocation} disabled={isLocating}>
                      {isLocating ? "Finding location…" : "Use my current location"}
                    </button>
                  </div>

                  {locationError && <p className="error-message" role="alert">{locationError}</p>}
                  <LocationPicker latitude={formData.latitude} longitude={formData.longitude} onChange={({ latitude, longitude }) => { setFormData((current) => ({ ...current, latitude, longitude })); setFormError(""); }} />

                </div>


                {/* LOCATION */}

                <div className="input-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    required
                  />

                </div>


                {/* PRICE */}

                <div className="input-group">

                  <label>
                    Price Per Hour
                  </label>

                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="KES"
                    required
                  />

                </div>


                {/* CAPACITY */}

                <div className="input-group">

                  <label>
                    Capacity
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Number of people"
                    required
                  />

                </div>


                {/* STATUS */}

                <div className="input-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Booked">
                      Booked
                    </option>

                  </select>

                </div>


                {/* DESCRIPTION */}

                <div className="input-group full">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the space"
                    rows="4"
                    required
                  />

                </div>

              </div>


              {/* BUTTONS */}

              <div className="form-buttons">

                {formError && <p className="error-message" role="alert">{formError}</p>}

                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingSpace
                    ? "Update Space"
                    : "Add Space"}
                </button>

              </div>

            </form>

          </div>

        )}


        {/* SPACES */}

        <section className="dashboard-section">


          <div className="section-header">

            <div>

              <h2>
                All Spaces
              </h2>

              <p>
                {spaces.length} spaces listed
              </p>

            </div>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Space
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Price / Hour
                  </th>

                  <th>
                    Capacity
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {spaces.map((space) => (

                  <tr key={space.id}>

                    <td>

                      <strong>
                        {space.name}
                      </strong>

                    </td>


                    <td>
                      {space.location}
                    </td>


                    <td>

                      KES{" "}
                      {Number(
                        space.pricePerHour
                      ).toLocaleString()}

                    </td>


                    <td>
                      {space.capacity}
                    </td>


                    <td>

                      <span
                        className={
                          space.status === "Available"
                            ? "status available"
                            : "status booked"
                        }
                      >
                        {space.status}
                      </span>

                    </td>


                    <td>

                      <button
                        className="table-button"
                        onClick={() =>
                          handleEdit(space)
                        }
                      >
                        Edit
                      </button>


                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(space.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>

  );

}

export default ManageSpaces;
