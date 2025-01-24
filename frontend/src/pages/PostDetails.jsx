import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import axios from "axios";
import { URL, IF } from "../url";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);

  // State for likes
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const navigate = useNavigate();

  // Fetch post details
  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch post comments
  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId);
      setComments(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
  };

  // Fetch likes count and user like status
  const fetchLikesData = async () => {
     console.log(user);
    try {
      const likesRes = await axios.get(URL + "/api/likes/" + postId);
      setLikesCount(likesRes.data.totalLikes);
      console.log(user);
      const userLikeRes = await axios.get(URL + "/api/likes/hasliked", {
        params: { postId, userId: user._id }
      }, { withCredentials: true });
      console.log(user);
      setHasLiked(userLikeRes.data.hasLiked);
      console.log(userLikeRes);  // Log the entire response object
      console.log(userLikeRes.data);  // Log the data property of the response
      console.log(userLikeRes.data.hasLiked)
    } catch (err) {
      console.log("Error fetching like status:", err);
    }
  };

  useEffect(() => {
    
      fetchPost();
      fetchPostComments();
      if (user?._id) {
        fetchLikesData();
      }
    
  }, [postId, user]);

  const handleDeletePost = async () => {
    try {
      await axios.delete(URL + "/api/posts/" + postId, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Handle like/unlike functionality
  const handleLike = async () => {
    try {
      if (hasLiked) {
        await axios.delete(URL + "/api/likes/unlike", {
          data: { postId, userId: user._id },
          withCredentials: true,
        });
        setLikesCount(likesCount - 1);
      } else {
        await axios.post(
          URL + "/api/likes/like",
          { postId, userId: user._id },
          { withCredentials: true }
        );
        setLikesCount(likesCount + 1);
      }
      setHasLiked(!hasLiked);
    } catch (err) {
      console.log(err);
    }
  };

  // Post a comment
  const postComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        URL + "/api/comments/create",
        { comment: comment, author: user.username, postId: postId, userId: user._id },
        { withCredentials: true }
      );
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="pt-10 bg-light-green min-h-screen">
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
              {user?._id === post?.userId && (
                <div className="flex items-center space-x-2">
                  <BiEdit className="text-xl cursor-pointer text-blue-600" onClick={() => navigate("/edit/" + postId)} />
                  <MdDelete className="text-xl cursor-pointer text-red-600" onClick={handleDeletePost} />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-gray-600 mb-4">
              <p>@{post.username}</p>
              <div className="flex space-x-2 text-sm">
                <p>{new Date(post.updatedAt).toDateString()}</p>
                <p>{new Date(post.updatedAt).toLocaleTimeString()}</p>
              </div>
            </div>
            <img src={IF + post.photo} className="w-full h-auto max-w-full max-h-[60vh] object-contain rounded-lg mb-8" alt="" />
            <p className="text-gray-800 leading-relaxed mb-8" style={{ whiteSpace: 'pre-line' }}>{post.desc}</p>

            {/* Like Button */}
            <div className="mb-8 flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 ${hasLiked ? "text-blue-600" : "text-gray-600"}`}
              >
                {hasLiked ? <AiFillLike size={24} /> : <AiOutlineLike size={24} />}
                <span>{likesCount} {likesCount === 1 ? "like" : "likes"}</span>
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Comments:</h3>
              {comments?.map((c) => (
                <Comment key={c._id} c={c} post={post} />
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <input
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Write a comment"
                className="w-full md:flex-1 outline-none py-2 px-4 border border-gray-300 rounded-lg"
              />
              <button
                onClick={postComment}
                className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PostDetails;
