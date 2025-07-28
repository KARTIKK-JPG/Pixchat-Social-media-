import sharp from "sharp";
import { Post } from "../models/post.model.js"
import { User } from "../models/user.model.js"
import { Comment } from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: "Image Required" });

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(200).json({
            message: "New post added",
            post,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comment',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({ posts, success: true });
    } catch (error) {
        console.log(error);
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({
                path: 'comment',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({ posts, success: true });
    } catch (error) {
        console.log(error);
    }
};

export const likePost = async (req, res) => {
    try {
        const likeKrneValaId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $addToSet: { likes: likeKrneValaId } });
        await post.save();

        const user = await User.findById(likeKrneValaId).select('username profilePicture');
        const postOwnerId = post.author.toString();

        if (postOwnerId !== likeKrneValaId) {
            const notification = {
                type: 'like',
                user: likeKrneValaId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: "Post liked", success: true });
    } catch (error) {
        console.log(error);
    }
};

export const disLikePost = async (req, res) => {
    try {
        const disLikeKrneValaId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $pull: { likes: disLikeKrneValaId } });
        await post.save();

        const user = await User.findById(disLikeKrneValaId).select('username profilePicture');
        const postOwnerId = post.author.toString();

        if (postOwnerId !== disLikeKrneValaId) {
            const notification = {
                type: 'dislike',
                user: disLikeKrneValaId,
                userDetails: user,
                postId,
                message: 'Your post was disliked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: "Post disliked", success: true });
    } catch (error) {
        console.log(error);
    }
};

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId = req.id;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'text is required', success: false });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        const commentDoc = await Comment.create({
            text,
            author: commentKrneWalaUserKiId,
            post: postId
        });

        const comment = await Comment.findById(commentDoc._id).populate({
            path: 'author',
            select: 'username profilePicture'
        });

        post.comment.push(comment._id);
        await post.save();

        return res.status(200).json({
            message: 'Content Added',
            comment,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong',
            success: false
        });
    }
};

export const getCommentOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate({
            path: 'author',
            select: 'username profilePicture'
        });

        if (!comments) {
            return res.status(404).json({ message: "No comment found in this post", success: false });
        }

        return res.status(200).json({ success: true, comments });
    } catch (error) {
        console.log(error);
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        if (post.author.toString() !== authorId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Post.findByIdAndDelete(postId);

        const user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({ message: "Post deleted", success: true });
    } catch (error) {
        console.log(error);
    }
};

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found", success: false });

        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ message: "Post removed from bookmark", type: "unsaved", success: true });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ message: "Post bookmarked", type: "saved", success: true });
        }
    } catch (error) {
        console.log(error);
    }
};
