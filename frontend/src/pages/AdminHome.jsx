import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ADMIN_API_ENDPOINT } from "../utils/constant";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const AdminHome = () => {
    const [clientsData, setClientsData] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${ADMIN_API_ENDPOINT}/getclients`, { withCredentials: true });
                setClientsData(response.data.clients);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };
        fetchClients();
    }, []);


    const LogOutHandler = async () => {
        try {
            dispatch(logout());
            await axios.get(`${ADMIN_API_ENDPOINT}/logout`);
            navigate("/");
            toast.success("Logout Successful");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-900 text-white w-full">
            {/* Navbar */}
            <div className="w-full bg-gray-800 py-4 px-8 flex justify-between items-center shadow-md">
                <Link className="text-3xl font-bold flex items-center">
                    <span className="text-blue-500 hover:scale-110 transition-transform">ADMIN</span>
                    <span className="ml-2 hover:scale-110 transition-transform">PANEL</span>
                </Link>
                <div className="flex gap-6">
                    <Link to="/adminHome/addClient" className="hover:text-red-400 transition">
                        Add Client
                    </Link>
                    <Link to="/adminHome/seeQueries" className="hover:text-red-400 transition">
                        Queries
                    </Link>
                    <Link onClick={LogOutHandler} className="hover:text-red-400 transition">
                        Logout
                    </Link>
                </div>

            </div>

            {/* Table Container */}
            <div className="mt-10 p-4 w-full   bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                <h2 className="text-2xl font-semibold text-center mb-4">MLA Info</h2>
                {clientsData.length > 0 ? (
                    <table className="w-full table-auto border-collapse border border-gray-700 text-sm text-left">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                {["ID", "Name", "Age", "Constituency", "Mandal", "Email", "Mobile", "Political Party"].map((header, index) => (
                                    <th key={index} className="border border-gray-600 px-4 py-2 text-center font-semibold">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clientsData.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-600 text-gray-300">
                                    <td className="border border-gray-600 px-2 py-2 text-center">{client.id}</td>
                                    <td className="border border-gray-600 px-2 py-2 truncate">{client.name}</td>
                                    <td className="border border-gray-600 px-2 py-2 text-center">{client.age}</td>
                                    <td className="border border-gray-600 px-2 py-2 truncate">{client.constituency}</td>
                                    <td className="border border-gray-600 px-2 py-2 truncate">{client.mandal || "-"}</td>
                                    <td className="border border-gray-600 px-2 py-2 truncate">{client.Email || "-"}</td>
                                    <td className="border border-gray-600 px-2 py-2 truncate">{client.Mobile || "-"}</td>
                                    <td className="border border-gray-600 px-2 py-2 truncate">{client.PoliticalParty || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-300 text-center">No data found.</p>
                )}
            </div>

        </div>
    );
};

export default AdminHome;
