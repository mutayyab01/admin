import axios from 'axios';

const extractPublicIdFromUrl = (imageUrl) => {
    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload'); 
    if (uploadIndex === -1 || uploadIndex + 1 >= parts.length) {
        throw new Error('Invalid Cloudinary URL format');
    }
    // Extract the part after 'upload/'
    let publicIdWithExtension = parts.slice(uploadIndex + 1).join('/');
    // Remove the version if it exists (typically starts with 'v' followed by digits)
    publicIdWithExtension = publicIdWithExtension.replace(/^v\d+\//, '');
    // Remove the file extension
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
};

const deleteImageFromCloudinary = async (imageUrl) => {
    try {
        const publicId = extractPublicIdFromUrl(imageUrl);
        console.log(publicId, imageUrl);
        const response = await axios.post('/api/cloudinary/delete', { publicId });

        if (response.data.success) {
            console.log('Image deleted successfully:', response.data.result);
        } else {
            console.log('Image not found:', response.data.message);
        }
    } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
        throw err;
    }
};
 // Upload image to Cloudinary and get the URL
 const uploadImageToCloudinary = async (file,folderPath) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); // Use your unsigned upload preset
    formData.append('folder', folderPath);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.secure_url; // Return the secure URL of the uploaded image
    } catch (err) {
        console.error('Error uploading image to Cloudinary:', err);
        throw err;
    }
};
// Named exports
export { extractPublicIdFromUrl, deleteImageFromCloudinary,uploadImageToCloudinary };
