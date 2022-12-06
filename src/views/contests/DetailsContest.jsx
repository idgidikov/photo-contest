import React from "react";
import { useState, useEffect } from "react";
import { getContesById } from "../../services/contests-services";
import { useContext } from "react";
import { AppContext } from "../../context/app.context";
import { useParams } from "react-router-dom";
import SubmissionForm from "../submissions/SubmissionForm";
import SubmissionsByContest from "../submissions/SubmissionsByContest";
import { getSubmissionsByContest } from "../../services/submission-services";
import { userRole } from "../../common/enums/user-role.enum";
import { getMySubmission } from "../../services/users.services";
import { contestPhases } from "../../common/enums/contest.enum";
import SubMenuContests from "../../components/contests/SubMenuContests";

function DetailsContest() {
	const { addToast, ...appState } = useContext(AppContext);
	const { userData } = appState;
	const { contestId } = useParams();
	const [contest, setContest] = useState({
		title: "",
		category: "",
		startPhaseOne: "",
		startPhaseTwo: "",
		startPhaseThree: "",
		phaseStatus: 0,
		id: "",
		url: "",
	});
	const [photos, setPhotos] = useState([]);
	const [mySubmissions, setMySubmissions] = useState();

	useEffect(() => {
		getContesById(contestId)
			.then((result) => {
				setContest((contest) => ({
					...contest,
					title: result.title,
					category: result.category,
					url: result.url,
					phaseStatus: result.phaseStatus,
					submissions: result.submissions,
					id: contestId,
				}));
			})
			.catch((e) => addToast("error", e.message));
		getSubmissionsByContest(contestId)
			.then((result) => {
				setPhotos(result);
			})
			.catch((e) => addToast("error", e.message));
		getMySubmission(contestId, userData.username)
			.then((result) => setMySubmissions(result))
			.catch((e) => addToast("error", e.message));
	}, [contestId]);

	return (
		<div>
			<SubMenuContests />
			<div className="card lg:card-side bg-base-100 shadow-xl">
				<figure>
					<img src={contest.url} className="h-[350px]" alt="Album" />
				</figure>
				<div className="card-body">
					<h2 className="card-title">{contest.title}</h2>
					<p>{contest.category}</p>
				</div>
			</div>

			{mySubmissions && userData.role === userRole.PHOTO_JUNKIES && (
				<div>
					<p>{mySubmissions.title}</p>
					<img src={mySubmissions.url} />
				</div>
			)}
			{!mySubmissions &&
				userData.role == userRole.PHOTO_JUNKIES &&
				contest.phaseStatus !== contestPhases.PHASE_THREE && (
					<SubmissionForm contestId={contest.id} />
				)}

			{contest.phaseStatus === contestPhases.PHASE_ONE &&
				userData?.role === userRole.ORGANIZER && (
					<SubmissionsByContest
						photos={photos}
						phaseStatus={contest.phaseStatus}
					/>
				)}
		</div>
	);
}

export default DetailsContest;
