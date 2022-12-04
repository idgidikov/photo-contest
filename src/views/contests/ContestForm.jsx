import React from "react";
import { useState, useEffect } from "react";
import CustomDate from "../../components/contests/CustomDate";
import CustomTime from "../../components/contests/CustomTime";
import { contestValidation } from "../../common/enums/contest.enum";
import { createContest } from "../../services/contests-services";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config.js";
import { useContext } from "react";
import { AppContext } from "../../context/app.context";
import { useNavigate } from "react-router-dom";

function ContestForm() {
	const [title, setTitle] = useState("");
	const [titleValidator, setTitleValidator] = useState(false);
	const [category, setCategory] = useState("");
	const [coverPhoto, setCoverPhoto] = useState("");
	const [startPhaseOne, setStartPhaseOne] = useState(null);
	const [startPhaseTwo, setStartPhaseTwo] = useState(null);
	const [startPhaseThree, setStartPhaseThree] = useState(null);
	const [imageUrl, setImageUrl] = useState("");

	const handleFileUpload = (e) => {
		setCoverPhoto(e.target?.files[0]);
		let value = URL.createObjectURL(e.target.files[0]);
		setImageUrl(value);
	};

	const navigate = useNavigate();

	const showAllContests = () => {
		navigate("/up-coming-contests/");
	};

	const { user, addToast, userData } = useContext(AppContext);
	const username = userData?.username;

	useEffect(() => {
		if (
			title.length > contestValidation.MIN_LENGTH_TITLE &&
			title.length < contestValidation.MAX_LENGTH_TITLE
		) {
			setTitleValidator(true);
		} else {
			setTitleValidator(false);
		}
	}, [title]);

	const sendData = async (e) => {
		e.preventDefault();
		const id = v4();
		const imageRef = ref(storage, `covers/${id}`);
		const file = coverPhoto;
		if (!titleValidator)
			addToast("error", "Title must between 1 - 64 characters");
		if (category.length == 0) addToast("error", "Write category");
		if (!file) addToast("error", "Choose cover photo");
		if (startPhaseOne == null) addToast("error", "Choose start date");
		if (startPhaseTwo == null)
			addToast("error", "Choose start for voting date");
		if (startPhaseThree == null)
			addToast("error", "Choose end hour for voting");
		if (titleValidator) {
			try {
				const result = await uploadBytes(imageRef, file);
				const url = await getDownloadURL(result.ref);
				const imagePath = "covers/" + id;
				setCoverPhoto(url);

				await createContest({
					title,
					category,
					startPhaseOne,
					startPhaseTwo,
					startPhaseThree,
					imagePath,
					url,
					username,
				});
				showAllContests();
			} catch (error) {
				console.log(error);
				addToast("error", error.message);
			}
		}
	};

	return (
		<div className="contest-form">
			<h1 className="title">Create new contest</h1>
			<div className="flex flex-wrap justify-around">
				<div className="card lg:card-side bg-base-100 shadow-xl">
					<figure>
						<img
							src={
								imageUrl !== "" ? imageUrl : "https://placeimg.com/400/400/arch"
							}
							className="h-[350px]"
							alt="Album"
						/>
					</figure>
					<div className="card-body">
						<label className="label">Title of you contest: </label>
						<input
							className="input input-bordered border-white w-full max-w-full mb-6"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							type="text"
						/>
						<label className="label">Category: </label>
						<input
							className="input input-bordered border-white w-full max-w-full mb-6"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							type="text"
						/>
						<label className="label">Choose Cover photo for your contest</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileUpload}
							className="file-input file-input-bordered file-input-info w-full max-w-full mb-6"
						/>
						<label className="label">
							Choose start and end date for participants{" "}
						</label>
						<CustomDate
							startPhaseOne={startPhaseOne}
							setStartPhaseOne={setStartPhaseOne}
							startPhaseTwo={startPhaseTwo}
							setStartPhaseTwo={setStartPhaseTwo}
						/>
						<br />
						{startPhaseOne !== null ? (
							<p>Open at: {startPhaseOne.toLocaleString()}</p>
						) : (
							<p>Open at: </p>
						)}
						{startPhaseTwo !== null ? (
							<p>Close at: {startPhaseTwo.toLocaleString()}</p>
						) : (
							<p>Close at: </p>
						)}
						<br />
						<label className="label">Choose end time for jury voting</label>
						<CustomTime
							startPhaseTwo={startPhaseTwo}
							startPhaseThree={startPhaseThree}
							setStartPhaseThree={setStartPhaseThree}
						/>
						<br />
						{startPhaseThree !== null ? (
							<p>End voting at: {startPhaseThree.toLocaleString()}</p>
						) : (
							<p>Choose period for voting</p>
						)}
						<button className="btn btn-primary mt-14" onClick={sendData}>
							Publish
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ContestForm;
