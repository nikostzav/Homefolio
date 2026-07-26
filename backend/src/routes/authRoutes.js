import express from "express";
import { register, login, logout, shouldBeLoggedIn } from "../controllers/authController.js";
import { getPreferences, updatePreferences} from "../controllers/preferenceController.js";
import { getCities } from '../controllers/cityController.js';
import { updateProfile } from '../controllers/profileController.js';
import authenticateToken from '../middlewares/authMiddleware.js'
import { getChatRooms, getAllChatRooms, getUserChatRooms, markAsSeen, unseenCount} from '../controllers/chatController.js';
import { getSavedPosts, getUserPost, addPost, addPostDetails, getPosts, getPostById, getDetails, checkIfSaved, savePost} from '../controllers/postController.js';
import { getUsers } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post('/getSavedPosts', authenticateToken, getSavedPosts);
router.post('/addPost',  addPost);
router.get('/getPosts', getPosts);
router.get("/posts/:id", getPostById); 
router.get("/chats/:id", getChatRooms);
router.post("/mark-as-seen", markAsSeen);
router.get("/unseen-count", unseenCount);
router.get("/userchats/:id", getUserChatRooms);
router.get("/chats", getAllChatRooms); 
router.post('/addPostDetails', addPostDetails);
router.get('/preferences/:userId', authenticateToken, getPreferences);
router.put('/preferences/:userId', authenticateToken, updatePreferences);
router.post('/checkIfSaved', authenticateToken, checkIfSaved);
router.post('/savePost', authenticateToken, savePost);
router.get('/getDetails/:id', getDetails);
router.get('/getCities', getCities);
router.get('/shouldBeLoggedIn', shouldBeLoggedIn);
router.post('/updateProfile',authenticateToken, updateProfile);
router.get('/users/:id',authenticateToken, getUsers);
router.get('/getUserPost/:userId',authenticateToken, getUserPost);

export default router;