const express = require("express");
const Twitter = require("twitter");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// TODO: Fill in your Twitter API credentials
const client = new Twitter({
	consumer_key: "",
	consumer_secret: "",
	access_token_key: "",
	access_token_secret: "",
});

// TODO: Fill in your list ID
const listId = "";

app.get("/", async (req, res) => {
	try {
		const perPage = 50;
		const currentPage = parseInt(req.query.page) || 1;

		const followers = await client.get("followers/ids", {
			stringify_ids: true,
		});
		const friends = await client.get("friends/ids", { stringify_ids: true });

		const nonFollowers = friends.ids.filter(
			(id) => !followers.ids.includes(id)
		);

		const totalPages = Math.ceil(nonFollowers.length / perPage);
		const startIndex = (currentPage - 1) * perPage;
		const endIndex = currentPage * perPage;

		const nonFollowersPage = nonFollowers.slice(startIndex, endIndex);

		let users = [];
		if (nonFollowersPage.length > 0) {
			users = await client.post("users/lookup", {
				user_id: nonFollowersPage.join(","),
			});
		}

		res.render("index", { users, currentPage, totalPages });
	} catch (error) {
		console.error(error);
		res.status(500).send("An error occurred");
	}
});

app.delete("/unfollow/:id", async (req, res) => {
	try {
		await client.post(`friendships/destroy`, { user_id: req.params.id });
		res.set("Content-Type", "application/json");
		res.status(200).send({ success: true });
	} catch (error) {
		console.error(error);
		res.set("Content-Type", "application/json");
		res.status(500).send({ success: false });
	}
});

app.put("/add-to-list/:id", async (req, res) => {
	try {
		await client.post(`lists/members/create`, {
			list_id: listId,
			user_id: req.params.id,
		});
		res.set("Content-Type", "application/json");
		res.status(200).send({ success: true });
	} catch (error) {
		console.error(error);
		res.set("Content-Type", "application/json");
		res.status(500).send({ success: false });
	}
});

app.listen(3000, () => {
	console.log("App is running on port 3000");
});
