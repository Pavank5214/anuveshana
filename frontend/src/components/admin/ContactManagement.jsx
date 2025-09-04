import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../redux/slices/contactSlice";

const ContactManagement = () => {
  const dispatch = useDispatch();

  const { contacts, loading, error } = useSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-500 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Contact Management</h1>

        {loading && <p className="text-white">Loading contacts...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && contacts.length === 0 && (
          <p className="text-gray-200">No contacts found.</p>
        )}

        {!loading && contacts.length > 0 && (
          <div className="overflow-x-auto shadow-md rounded-xl bg-white border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-gray-700">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Message</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-900">{contact.name}</td>
                    <td className="py-3 px-4 text-gray-900">{contact.email}</td>
                    <td className="py-3 px-4 text-gray-900">{contact.number || "-"}</td>
                    <td className="py-3 px-4 text-gray-700 truncate max-w-xs">{contact.message}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(contact.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManagement;
