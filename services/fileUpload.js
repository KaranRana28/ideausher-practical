const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const fs = require('fs');
const { statusCode, success, commanMessage, error } = require('../utils/responseConstant');
const sharp = require('sharp');
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_SECRET = process.env.AWS_SECRET_KEY;
const REGION = process.env.AWS_BUCKET_REGION;

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_SECRET
    }
});


const imageUpload = async (files) => {
    try {

        let upFiles = [];

        for (let i = 0; i < files.length; i++) {

            const file = files[i];
            const uploadFile = await uploadToS3(file, 'photo',true);

            let uploadedFile = {}

            if (uploadFile) {
                uploadedFile['url'] = uploadFile.Key;
            }
            upFiles.push(uploadedFile);
        }
        return upFiles;
    } catch (err) {
        console.log(err)
        res.send(error(err.message, statusCode.BAD_REQUEST));
    }
};

const cleanFileName = async (fileName) => {
    // Split the filename and extension
    const parts = fileName.split('.');

    // Extract the filename without extension
    let fileNameWithoutExt = parts.slice(0, -1).join('.');

    // Replace special characters and spaces with hyphens
    fileNameWithoutExt = fileNameWithoutExt.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    // Reassemble the filename with the original extension
    return fileNameWithoutExt + (parts.length > 1 ? '.' + parts.pop() : '');
}

const uploadToS3 = async (file, folderName, isLocalFile) => {
    try {
        var fileName = await cleanFileName(file.originalname);
        let bodyData = file.buffer;

        if (isLocalFile) { bodyData = fs.readFileSync(file.path); }

        const params = {
            Bucket: BUCKET_NAME,
            Key: process.env.AWS_BUCKET_DESTINATION + "/" + folderName + "/" + fileName,
            Body: bodyData,
            acl: 'public-read',
            ContentType: file.mimetype
        };

        const s3upload = new Upload({
            client: s3Client,
            params: params
        });

        const result = await s3upload.done();
        fs.unlinkSync(file.path);

        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports = {
    imageUpload: imageUpload
}