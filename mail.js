export function createMail(data) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(data)) {
			reject(new Error("Invalid data format"));
		}

		let reservations = data.map(
			(element) => `
              <article>
                <h3>${element.type.toUpperCase()}</h3>
                <p>${element.id}</p>
                <p>$${element.price}</p>
              </article>
            `
		);
		let revenue = 0;
		data.map((element) => (revenue += +element.price));
		let seats = data.map((element) => `Seat ${element.id}`);

		const htmlContent = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Mail</title>
		<style>
			body {
				font-family: Verdana, Geneva, Tahoma, sans-serif;
			}
			section {
				width: 500px;
			}
			article {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		</style>
	</head>
	<body>
		<h1>You received a new booking!</h1>
		<main>
			<p>Hey Admin, you have a new reservation!</p>
			<section>
				${reservations.join("")}
				<hr />
				<article>
					<h3>YOUR REVENUE:</h3>
					<p>$${revenue}</p>
				</article>
			</section>
		</main>
		<p>
			The seats ${seats} are now reserved.
		</p>
		<p>The payment of $${revenue} will be transferred accordingly.</p>
	</body>
</html>
`;

		resolve(htmlContent);
	});
}
