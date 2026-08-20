import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addSpace,
  updateSpace,
  deleteSpace,
} from "../../store/spacesSlice";

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
    pricePerHour: "",
    capacity: "",
    description: "",
    status: "Available",
  });


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
      pricePerHour: "",
      capacity: "",
      description: "",
      status: "Available",
    });

    setEditingSpace(null);

    setShowForm(false);

  };


  /* ADD / UPDATE */

  const handleSubmit = (e) => {

    e.preventDefault();


    const space = {

      ...formData,

      pricePerHour:
        Number(formData.pricePerHour),

      capacity:
        Number(formData.capacity),
    };


    if (editingSpace) {

      dispatch(
        updateSpace({
          id: editingSpace.id,
          ...space,
        })
      );

    } else {

      dispatch(
        addSpace(space)
      );

    }


    resetForm();

  };


  /* EDIT */

  const handleEdit = (space) => {

    setEditingSpace(space);

    setFormData({
      name: space.name,
      location: space.location,
      pricePerHour: space.pricePerHour,
      capacity: space.capacity,
      description: space.description || "",
      status: space.status,
    });

    setShowForm(true);

  };


  /* DELETE */

  const handleDelete = (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this space?"
      );

    if (confirmed) {

      dispatch(
        deleteSpace(id)
      );

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