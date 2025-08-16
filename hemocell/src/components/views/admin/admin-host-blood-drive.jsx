import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderStats from "../../sections/header-stats/header_stats";
import DisplayTableComponent from "../../sections/display-table/display-table-component";
import FilterableComponent from "../../sections/filterable/filterable-component";
import InitialDataFetching from "../../utility-functions/initial-data-fetching";
import './modal.css'; // (Assume modal styles or use inline styles)

export default function AdminHostBloodDrive() {
	const [data, setData] = useState([]);
	const [filter, setFilter] = useState("");
	const [selectedOpt, setSelectedOpt] = useState("name");

	const [status, setStatus] = useState("normal");
	const [selectedId, setSelectedId] = useState(null);
	const [updatedData, setUpdatedData] = useState({
		name: "",
		phone: "",
		institute: "",
		designation: "",
		city: "",
		message: "",
	});

	const [showModal, setShowModal] = useState(false);
	const [newDrive, setNewDrive] = useState({
		name: '',
		phone: '',
		email: '',
		institute: '',
		designation: '',
		city: '',
		message: '',
	});

	useEffect(() => {
		InitialDataFetching({ source: "host-blood-drive", setData });
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/api/host-blood-drive")
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		data.map((item) => {
			if (item.id == selectedId) {
				setUpdatedData({
					name: item.name,
					phone: item.phone,
					institute: item.institute,
					designation: item.designation,
					city: item.city,
					message: item.message,
				});
				// console.log("useEffect");
			}
		});
	}, [selectedId]);

	const filterData = (search) => {
		return data.filter((item) => {
			let matches = true;

			if (selectedOpt === "all") {
				return true;
			} else if (
				selectedOpt === "done" &&
				"no".toLowerCase().includes(search.toLowerCase()) &&
				item.done === 0
			) {
				matches = true;
			} else if (
				selectedOpt === "done" &&
				"yes".toLowerCase().includes(search.toLowerCase()) &&
				item.done === 1
			) {
				matches = true;
			} else if (
				item[selectedOpt]
					.toString()
					.toLowerCase()
					.includes(search.toLowerCase())
			) {
				matches = true;
			} else {
				matches = false;
			}
			return matches;
		});
	};

	const handleSearchChange = (e) => {
		setFilter(e.target.value);
	};

	const handleInputChange = (e) => {
		setSelectedOpt(e.target.value);
	};

	const handleHostChange = (id) => {
		const item = data.find((item) => item.id === id);
		let status = !item.done;

		axios
			.put(`http://localhost:3001/api/host-blood-drive/done`, {
				status,
				id,
			})
			.then((response) => {
				setData(
					data.map((item) =>
						item.id === id ? { ...item, done: status } : item
					)
				);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleDelete = (id) => {
		axios
			.delete(`http://localhost:3001/api/host-blood-drive/delete/${id}`)
			.then((response) => {
				setData(data.filter((item) => item.id !== id));
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleUpdateClick = (id) => {
		axios
			.put(`http://localhost:3001/api/host-blood-drive/update/${id}`, {
				updatedData,
			})
			.then((response) => {
				setData(
					data.map((item) =>
						item.id === id
							? {
									...item,
									name: updatedData.name,
									phone: updatedData.phone,
									institute: updatedData.institute,
									designation: updatedData.designation,
									city: updatedData.city,
									message: updatedData.message,
							  }
							: item
					)
				);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleNewDriveChange = (e) => {
		setNewDrive({ ...newDrive, [e.target.name]: e.target.value });
	};

	const handleCreateDrive = (e) => {
		e.preventDefault();
		axios.post('http://localhost:3001/api/host-blood-drive/create', newDrive)
			.then((response) => {
				setData([response.data, ...data]);
				setShowModal(false);
				setNewDrive({ name: '', phone: '', email: '', institute: '', designation: '', city: '', message: '' });
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const optionsData = [
		{ id: 1, name: "All", value: "all" },
		{ id: 2, name: "Name", value: "name" },
		{ id: 3, name: "Phone", value: "phone" },
		{ id: 4, name: "Email", value: "email" },
		{ id: 5, name: "Institute", value: "institute" },
		{ id: 6, name: "Designation", value: "designation" },
		{ id: 7, name: "City", value: "city" },
		{ id: 8, name: "Done", value: "done" },
	];

	const tableHeader = [
		"Name",
		"Email",
		"Phone",
		"Institute",
		"Designation",
		"City",
		"Message",
		"Done",
		"Action",
	];

	return (
		<>
			<HeaderStats heading="Blood Drive Hosting Users" />
			<div className="bg-white p-10 m-10 -mt-20 rounded-rsm">
				<button
					className="mb-6 px-4 py-2 bg-dark_red text-white rounded hover:bg-red transition"
					onClick={() => setShowModal(true)}
				>
					Add Blood Drive
				</button>

				{showModal && (
					<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
						<div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
							<button className="absolute top-2 right-2 text-gray-500 hover:text-dark_red" onClick={() => setShowModal(false)}>&times;</button>
							<h2 className="text-xl font-bold mb-4">Add New Blood Drive</h2>
							<form onSubmit={handleCreateDrive} className="space-y-3">
								<input name="name" value={newDrive.name} onChange={handleNewDriveChange} placeholder="Name" className="w-full border p-2 rounded" required />
								<input name="email" value={newDrive.email} onChange={handleNewDriveChange} placeholder="Email" className="w-full border p-2 rounded" required />
								<input name="phone" value={newDrive.phone} onChange={handleNewDriveChange} placeholder="Phone" className="w-full border p-2 rounded" required />
								<input name="institute" value={newDrive.institute} onChange={handleNewDriveChange} placeholder="Institute" className="w-full border p-2 rounded" />
								<input name="designation" value={newDrive.designation} onChange={handleNewDriveChange} placeholder="Designation" className="w-full border p-2 rounded" />
								<input name="city" value={newDrive.city} onChange={handleNewDriveChange} placeholder="City" className="w-full border p-2 rounded" />
								<textarea name="message" value={newDrive.message} onChange={handleNewDriveChange} placeholder="Message" className="w-full border p-2 rounded" />
								<button type="submit" className="w-full bg-dark_red text-white py-2 rounded hover:bg-red transition">Create</button>
							</form>
						</div>
					</div>
				)}
				<FilterableComponent
					filter={filter}
					handleSearchChange={handleSearchChange}
					optionsData={optionsData}
					selectedOpt={selectedOpt}
					handleInputChange={handleInputChange}
				/>

				<div className="overflow-x-scroll">
					<DisplayTableComponent
						tableHeader={tableHeader}
						filterData={filterData}
						filter={filter}
						handleCheckboxChange={handleHostChange}
						type={"host-blood-drive"}
						handleUpdateClick={handleUpdateClick}
						handleDelete={handleDelete}
						status={status}
						setStatus={setStatus}
						selectedId={selectedId}
						setSelectedId={setSelectedId}
						updatedData={updatedData}
						setUpdatedData={setUpdatedData}
					/>
				</div>
			</div>
		</>
	);
}
