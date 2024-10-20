const axios = require("axios");
const FormData = require("form-data");

const url = process.env.IMAGE_HOST_SERVICE;
const api = process.env.IMAGE_HOST_SERVICE_APIKEY;

async function uploadImage(imageData) {
  const { originalname, mimetype, buffer } = imageData;

  const formData = new FormData();
  formData.append("image", buffer, {
    filename: originalname,
    contentType: mimetype,
  });
  formData.append("key", api);
  formData.append("name", originalname);

  try {
    const response = await axios.post(url, formData, {
      headers: { ...formData.getHeaders() },
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    return { status: 500, data: null };
  }
}

/**
 *
 * @param {string} imageUrl
 */
async function uploadImageUrl(imageUrl) {
  try {
    const formData = new FormData();
    formData.append("key", api);
    formData.append("image", imageUrl);

    const response = await axios.post(url, formData, {
      headers: { ...formData.getHeaders() },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { uploadImage, uploadImageUrl };
