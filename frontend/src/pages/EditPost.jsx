import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ImCross } from 'react-icons/im';
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const EditPost = () => {
    const postId = useParams().id;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [cat, setCat] = useState("");
    const [cats, setCats] = useState([]);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`${URL}/api/posts/${postId}`);
            setTitle(res.data.title);
            setDesc(res.data.desc);
            setFile(null);
            setCats(res.data.categories);
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const post = {
            title,
            desc,
            username: user.username,
            userId: user._id,
            categories: cats
        };

        if (file) {
            const data = new FormData();
            data.append("file", file);
            try {
                const uploadRes = await axios.post(`${URL}/api/upload`, data);
                post.photo = uploadRes.data.url;
            } catch (err) {
                console.log(err);
                return; // exit if image upload fails
            }
        }

        try {
            const res = await axios.put(`${URL}/api/posts/${postId}`, post, { withCredentials: true });
            navigate(`/posts/post/${res.data._id}`);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const deleteCategory = (i) => {
        let updatedCats = [...cats];
        updatedCats.splice(i, 1);
        setCats(updatedCats);
    };

    const addCategory = () => {
        let updatedCats = [...cats];
        updatedCats.push(cat);
        setCat("");
        setCats(updatedCats);
    };

    return (
        <div>
            <Navbar />
            <div className='px-6 md:px-[200px] mt-8 pt-10 bg-green-300 min-h-screen'>
                <h1 className='font-bold md:text-2xl text-xl mb-4'>Update This Post</h1>
                <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        type="text"
                        placeholder='Enter post title'
                        className='px-4 py-2 outline-none rounded-lg shadow-md border border-gray-300'
                    />
                    <input
                        onChange={(e) => setFile(e.target.files[0])}
                        type="file"
                        className='px-4 py-2 outline-none rounded-lg border border-gray-300 bg-white text-black file:py-2 file:px-4 file:bg-black file:text-white'
                    />
                    <div className='flex flex-col'>
                        <div className='flex items-center space-x-4 md:space-x-8'>
                            <input
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                                className='px-4 py-2 outline-none rounded-lg shadow-md border border-gray-300'
                                placeholder='Enter post category'
                                type="text"
                            />
                            <div
                                onClick={addCategory}
                                className='bg-black text-white px-4 py-2 font-semibold cursor-pointer rounded-lg shadow-md'
                            >
                                Add
                            </div>
                        </div>

                        {/* categories */}
                        <div className='flex flex-wrap gap-4 px-4 mt-3'>
                            {cats?.map((c, i) => (
                                <div
                                    key={i}
                                    className='flex justify-center items-center space-x-2 bg-gray-200 px-2 py-1 rounded-md shadow-md'
                                >
                                    <p>{c}</p>
                                    <p
                                        onClick={() => deleteCategory(i)}
                                        className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'
                                    >
                                        <ImCross />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <textarea
                        onChange={(e) => setDesc(e.target.value)}
                        value={desc}
                        rows={15}
                        cols={30}
                        className='px-4 py-2 outline-none rounded-lg shadow-md border border-gray-300'
                        placeholder='Enter post description'
                    />
                    <button
                        onClick={handleUpdate}
                        className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg rounded-lg shadow-md'
                    >
                        Update
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default EditPost;
