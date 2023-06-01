import fs from "fs";

export function readData() {
	return new Promise((resolve, reject) => {
		fs.readFile("./database.json", (err, data) => {
			if (err) reject(err);
			else {
				resolve(JSON.parse(data.toString()));
			}
		});
	});
}

export function read(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) reject(err);
			else {
				resolve(JSON.parse(data.toString()));
			}
		});
	});
}

export function updateData(newData) {
	return new Promise((resolve, reject) => {
		fs.writeFile("./database.json", JSON.stringify(newData, null, 2), (err) => {
			if (err) reject(err);
			else {
				resolve("Rewriting data successfull");
			}
		});
	});
}

export function createSeats(newData) {
	return new Promise((resolve, reject) => {
		console.log("i:", newData);
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
		const allSeats = [regularSeats, premiumSeats];

		fs.writeFile(
			"./database.json",
			JSON.stringify(allSeats, null, 2),
			(err) => {
				if (err) reject(err);
				else {
					resolve("Rewriting data successfull");
				}
			}
		);
	});
}

export function createShow(newData, path) {
	return new Promise((resolve, reject) => {
		console.log("i:", newData);
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
		const allSeats = [regularSeats, premiumSeats];

		fs.writeFile(path, JSON.stringify(allSeats, null, 2), (err) => {
			if (err) reject(err);
			else {
				resolve("Rewriting data successfull");
			}
		});
	});
}

export function updateJSON(data) {
	return new Promise((resolve, reject) => {
		readData()
			.then((reservations) => {
				data.forEach((object) => {
					let index = reservations
						.flat()
						.findIndex((reservation) => reservation.id == object.id);
					reservations.flat()[index].reserved = true;
				});
				updateData(reservations)
					.then(() => resolve(reservations))
					.catch((err) => reject(err));
			})
			.catch((err) => reject(err));
	});
}
