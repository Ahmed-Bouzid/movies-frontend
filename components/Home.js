import { useState, useEffect } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";
const url = "https://image.tmdb.org/t/p/w500/";

function Home() {
	const [likedMovies, setLikedMovies] = useState([]);

	// Liked movies (inverse data flow)
	const updateLikedMovies = (movieTitle) => {
		if (likedMovies.find((movie) => movie === movieTitle)) {
			setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
		} else {
			setLikedMovies([...likedMovies, movieTitle]);
		}
	};

	const likedMoviesPopover = likedMovies.map((data, i) => {
		return (
			<div key={i} className={styles.likedMoviesContainer}>
				<span className="likedMovie">{data}</span>
				<FontAwesomeIcon
					icon={faCircleXmark}
					onClick={() => updateLikedMovies(data)}
					className={styles.crossIcon}
				/>
			</div>
		);
	});

	const popoverContent = (
		<div className={styles.popoverContent}>{likedMoviesPopover}</div>
	);

	// Movies list

	const [myMovie, setMyMovie] = useState([]);
	useEffect(() => {
		fetch("https://movies-backend-ba11svnn5-warais-projects.vercel.app")
			.then((response) => response.json())
			.then((e) => {
				console.log(e);

				let desctructuredData = e.movies.map((el) => {
					let title = el.title;
					let vote_average = el.vote_average;
					let vote_count = el.vote_count;
					let poster = el.poster_path;
					let overview = el.overview;

					return { title, vote_average, vote_count, poster, overview };
				});

				setMyMovie(desctructuredData);
			});
	}, []);

	console.log(myMovie);

	const movies = myMovie.map((data, i) => {
		const isLiked = likedMovies.some((movie) => movie === data.title);

		let overviewSlice;

		if (data.overview.length > 250) {
			overviewSlice = data.overview.slice(0, 250) + " ...";
		} else {
			overviewSlice = data.overview;
		}
		console.log(overviewSlice);

		return (
			<Movie
				key={i}
				updateLikedMovies={updateLikedMovies}
				isLiked={isLiked}
				title={data.title}
				overview={overviewSlice}
				poster={`${url}` + data.poster}
				voteAverage={data.vote_average}
				voteCount={data.vote_count}
			/>
		);
	});

	return (
		<div className={styles.main}>
			<div className={styles.header}>
				<div className={styles.logocontainer}>
					<img src="logo.png" alt="Logo" />
					<img className={styles.logo} src="logoletter.png" alt="Letter logo" />
				</div>
				<Popover
					title="Liked movies"
					content={popoverContent}
					className={styles.popover}
					trigger="click"
				>
					<Button>♥ {likedMovies.length} movie(s)</Button>
				</Popover>
			</div>
			<div className={styles.title}>LAST RELEASES</div>
			<div className={styles.moviesContainer}>{movies}</div>
		</div>
	);
}

export default Home;
