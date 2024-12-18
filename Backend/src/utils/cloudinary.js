import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { Readable } from "stream";

export const uploadOnCloudinary = async (fileBuffer, folderName = "") => {
    try {
        if (!fileBuffer) {
            console.log("Could not find file data to upload");
            return null;
        }

        // Convert buffer to a readable stream
        const bufferStream = new Readable();
        bufferStream.push(fileBuffer);
        bufferStream.push(null); // Indicates the end of the stream

        const response = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto", // Handles different file types (images, videos, etc.)
                    folder: folderName,
                },
                (error, result) => {
                    if (error) {
                        console.log("Cloudinary Upload Error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            // Pipe the buffer stream to Cloudinary
            bufferStream.pipe(uploadStream);
        });

        return response;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export const deleteImageFromCloudinary = async (avatarUrl) => {
    try {
        // Extract public ID from the URL (remove the extension)
        // Ex:- https://res.cloudinary.com/dsyy17vir/image/upload/v1729443265/products/main_images/fmd7np39law3jmk2vxfv.jpg (that is) = fmd7np39law3jmk2vxfv
        const publicId = avatarUrl.split("/").pop().split(".")[0]; // This extracts the image name without extension

        // Delete the image by its public ID
        await cloudinary.uploader.destroy(publicId);

        console.log(`Image ${publicId} successfully deleted`);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new ApiError(500, "Failed to delete the image");
    }
};

export default uploadOnCloudinary;
