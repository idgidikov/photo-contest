import React from "react";
import { useNavigate } from "react-router-dom";
import useCountdown from "./CountDown";

function ContestCard({ contest }) {
	const navigate = useNavigate();
	const redirectToDetails = () => {
		navigate(`/contest-details/${contest.id}`);
	};
	const [timeLeft, setEndTime] = useCountdown(() => {
		if (contest.phaseStatus == 0) return contest.startPhaseOne;
		if (contest.phaseStatus == 1) return contest.startPhaseTwo;
		if (contest.phaseStatus == 2) return contest.startPhaseThree;
	});

	const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
	const hours = Math.floor(timeLeft / (1000 * 60 * 60)) % 24;
	const minutes = Math.floor(timeLeft / 60000) % 60;
	const seconds = Math.floor(timeLeft / 1000) % 60;

	return (
		<div>
			<div className="card w-56 bg-base-100 shadow-xl">
				<figure>
					<img src={contest.url} alt="Shoes" />
				</figure>
				<div className="card-body">
					<h2 className="card-title">
						{contest.title}
						<div className="badge badge-secondary">NEW</div>
					</h2>
					<p>{contest.category}</p>
					<div className="card-actions justify-end">
						<div className="flex gap-3">
							<div>
								<span className="countdown font-mono text-2xl">
									<span style={{ "--value": days }} />
								</span>
								days
							</div>
							<div>
								<span className="countdown font-mono text-2xl">
									<span style={{ "--value": hours }} />
								</span>
								hours
							</div>
							<div>
								<span className="countdown font-mono text-2xl">
									<span style={{ "--value": minutes }} />
								</span>
								min
							</div>
							<div>
								<span className="countdown font-mono text-2xl">
									<span style={{ "--value": seconds }} />
								</span>
								sec
							</div>
						</div>
					</div>
					<div className="card-actions">
						<button className="btn btn-primary" onClick={redirectToDetails}>
							View
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ContestCard;
