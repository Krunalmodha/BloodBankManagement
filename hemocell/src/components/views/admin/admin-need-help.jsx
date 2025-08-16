import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderStats from "../../sections/header-stats/header_stats";
import DisplayTableComponent from "../../sections/display-table/display-table-component";
import FilterableComponent from "../../sections/filterable/filterable-component";
import InitialDataFetching from "../../utility-functions/initial-data-fetching";

export default function AdminNeedHelp() {
	const [data, setData] = useState([]);
	const [filter, setFilter] = useState("");
	const [selectedOpt, setSelectedOpt] = useState("name");

	const [status, setStatus] = useState("normal");
	const [selectedId, setSelectedId] = useState(null);
	const [updatedData, setUpdatedData] = useState({
		name: "",
		phone: "",
		reason: "",
		message: "",
	});

	useEffect(() => {
		InitialDataFetching({ source: "need-help", setData });
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/api/need-help")
			.then((response) => {
				setData(response.data);
				console.log(response.data);
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
					reason: item.reason,
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
				selectedOpt === "answered" &&
				"no".toLowerCase().includes(search.toLowerCase()) &&
				item.answered === 0
			) {
				matches = true;
			} else if (
				selectedOpt === "answered" &&
				"yes".toLowerCase().includes(search.toLowerCase()) &&
				item.answered === 1
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

	const handleHelpNeedChange = (id) => {
		const item = data.find((item) => item.id === id);
		let status = !item.answered;

		axios
			.put(`http://localhost:3001/api/need-help/answered`, {
				status,
				id,
			})
			.then((response) => {
				setData(
					data.map((item) =>
						item.id === id ? { ...item, answered: status } : item
					)
				);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleDelete = (id) => {
		axios
			.delete(`http://localhost:3001/api/need-help/delete/${id}`)
			.then((response) => {
				setData(data.filter((item) => item.id !== id));
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleUpdateClick = (id) => {
		axios
			.put(`http://localhost:3001/api/need-help/update/${id}`, {
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
									reason: updatedData.reason,
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

	const optionsData = [
		{ id: 1, name: "All", value: "all" },
		{ id: 2, name: "Name", value: "name" },
		{ id: 3, name: "Phone", value: "phone" },
		{ id: 4, name: "Email", value: "email" },
		{ id: 5, name: "Reason", value: "reason" },
		{ id: 6, name: "Answered", value: "answered" },
	];

	const tableHeader = [
		"Name",
		"Email",
		"Phone",
		"Reason",
		"Message",
		"Status",
		"Action",
	];

	return (
		<>
			<HeaderStats heading="Help Needing Users" />{" "}
			<div className="bg-white p-10 m-10 -mt-20 rounded-rsm">
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
						// Custom row rendering for status and action
						customRowRender={(item) => (
							<tr key={item.id}>
								<td>{item.name}</td>
								<td>{item.email}</td>
								<td>{item.phone}</td>
								<td>{item.reason}</td>
								<td>{item.message}</td>
								<td>
									<span className={`px-2 py-1 rounded text-xs font-bold ${item.answered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
										{item.answered ? 'Resolved' : 'Unresolved'}
									</span>
								</td>
								<td>
									<button
										className={`px-3 py-1 rounded ${item.answered ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'} hover:opacity-80 transition`}
										onClick={() => handleHelpNeedChange(item.id)}
									>
										{item.answered ? 'Mark as Unresolved' : 'Mark as Resolved'}
									</button>
								</td>
							</tr>
						)}
						handleCheckboxChange={handleHelpNeedChange}
						type={"need-help"}
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
