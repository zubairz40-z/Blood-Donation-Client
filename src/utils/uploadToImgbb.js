import axios from "axios";

const uploadToImgbb = async (imageFile) => {
  const apiKey = import.meta.env.VITE_IMGBB_KEY;
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await axios.post(url, formData);
  return res.data.data.display_url;
};

export default uploadToImgbb;
