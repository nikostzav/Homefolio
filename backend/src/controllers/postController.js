import client from "../models/db.js";

export const getPosts = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "Post"');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getPostById = async (req, res) => {
  const { id } = req.params; // Get the post ID from request parameters

  try {
    const result = await client.query('SELECT * FROM "Post" WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result.rows[0]); // Return the single post
  } catch (error) {
    // console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addPost = async (req, res) => {
  const {
    title,
    price,
    images,
    address,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    type,
    property,
    userId,
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO "Post" (title, price, images, address, city, bedroom, bathroom, latitude, longitude, type, property, userId)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        title,
        price,
        images,
        address,
        city,
        bedroom,
        bathroom,
        latitude,
        longitude,
        type,
        property,
        userId,
      ],
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addPostDetails = async (req, res) => {
  const { desc, utilities, pet, income, size, school, postId } = req.body;

  try {
    await client.query(
      `
      INSERT INTO "PostDetail" (description, utilities, pet, income, size, school, postId)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
      [desc, utilities, pet, income, size, school, postId],
    );

    res.status(201).json({ message: "Post details inserted successfully" });
  } catch (error) {
    console.error("Error inserting post details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDetails = async (req, res) => {
  const params = req.params;
  try {
    const response = await client.query(
      `SELECT 
        pd.*, 
        u.username, 
        u.avatar
    FROM 
        "PostDetail" AS pd
    JOIN 
        "Post" AS p ON pd.postId = p.id  
    JOIN 
        "User" AS u ON p.userId = u.id
    WHERE 
        pd.postId = $1;`,
      [params.id],
    );
    if (response.rowCount > 0) {
      res.send(response.rows[0]);
    } else {
      res.json({ message: "no details found" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving saved posts" });
  }
};

export const checkIfSaved = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.body;

  try {
    const response = await client.query(
      `SELECT * FROM "SavedPost" 
       WHERE userId = $1 AND postId = $2;`,
      [userId, postId],
    );

    if (response.rowCount > 0) {
      res.json({ message: "saved" });
    } else {
      res.json({ message: "notSaved" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const savePost = async (req, res) => {
  const userId = req.user.id;
  const { postId, action } = req.body;

  try {
    if (action === "save") {
      await client.query(
        `INSERT INTO "SavedPost" (userId, postId)
        VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
        [userId, postId],
      );

      res.json({ success: true, message: "Post saved" });
    } else if (action === "remove") {
      await client.query(
        `DELETE FROM "SavedPost"
        WHERE userId = $1
        AND postId = $2;`,
        [userId, postId],
      );

      res.json({ success: true, message: "Post removed" });
    } else {
      res.status(400).json({ success: false, message: "Invalid action" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSavedPosts = async (req, res) => {
  const id = req.user.id;
  try {
    const response = await client.query(
      `SELECT * FROM "SavedPost" WHERE userId = $1`,
      [id],
    );
    let postsId = response.rows.map((item) => item.postid);

    if (postsId.length === 0) {
      return res.json([]);
    }
    const postQueries = postsId.map((postId) => {
      return client.query(`SELECT * FROM "Post" WHERE id = $1`, [postId]);
    });

    const postResults = await Promise.all(postQueries);

    const posts = postResults.flatMap((result) => result.rows);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving saved posts" });
  }
};

export const getUserPost = async (req, res) => {
  const id = req.params.userId;
  try {
    const response = await client.query(
      `SELECT * FROM "Post" WHERE userId = $1`,
      [id],
    );

    if (response.rowCount > 0) {
      res.status(200).json(response.rows);
    } else {
      res
        .status(404)
        .json({ message: "No posts found for the given user ID." });
    }
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
