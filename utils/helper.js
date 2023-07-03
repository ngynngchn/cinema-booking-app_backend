import fs from "fs";

export function read(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(`./screenings/${path}.json`, (err, data) => {
			if (err) {
				reject(err);
				console.log("Something went wront while reading file");
			} else {
				console.log("Reading screening for movie id", path);
				resolve(JSON.parse(data.toString()));
			}
		});
	});
}

export function updateData(newData, path) {
	return new Promise((resolve, reject) => {
		fs.writeFile(
			`./screenings/${path}.json`,
			JSON.stringify(newData, null, 2),
			(err) => {
				if (err) reject(err);
				else {
					resolve("Created reservation for movie id", path);
				}
			}
		);
	});
}

export function createShow(newData, path) {
	return new Promise((resolve, reject) => {
		console.log("Creating new screening:", newData);
		const regularSeats = [];
		const premiumSeats = [];

		for (let i = 1; i <= newData.regular; i++) {
			regularSeats.push({ id: i, reserved: false, type: "regular", price: 15 });
		}
		for (
			let j = +newData.regular + 1;
			j <= +newData.regular + +newData.premium;
			j++
		) {
			premiumSeats.push({ id: j, reserved: false, type: "premium", price: 18 });
		}
		const details = {
			title: newData.title,
			id: newData.id,
			time: newData.time,
			date: newData.date,
		};
		const allSeats = { details: details, seats: [regularSeats, premiumSeats] };
		fs.writeFile(path, JSON.stringify(allSeats, null, 2), (err) => {
			if (err) reject(err);
			else {
				resolve(`Successfully created new screening for ${newData.title}`);
			}
		});
	});
}

export function updateJSON(data, path) {
	return new Promise((resolve, reject) => {
		read(path)
			.then((reservations) => {
				data.forEach((object) => {
					let index = reservations.seats
						.flat()
						.findIndex((reservation) => reservation.id == object.id);
					reservations.seats.flat()[index].reserved = true;
				});
				updateData(reservations, path)
					.then(() => resolve(reservations))
					.catch((err) => reject(err));
			})
			.catch((err) => reject(err));
	});
}

export function readDirectory(path) {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, files) => {
			if (err) {
				reject(err);
			} else {
				console.log("Reading directory at", path);
				resolve(files);
			}
		});
	});
}
