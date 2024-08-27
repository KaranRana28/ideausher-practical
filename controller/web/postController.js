const { success, error, statusCode, commanMessage } = require('../../utils/responseConstant');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { imageUpload } = require('../../services/fileUpload');
const Post = require('../../model/post');
const User = require('../../model/user');
const Tag = require('../../model/tag');
const postConstant = require('../../constant/postConstant');
const mongoose = require('mongoose');

const createPost = async (req, res) => {
    try {

        const { title, description, tags } = req.body;
        let photos = [];

        // check if tags all exist in database
        if (tags && tags.length > 0) {
            const foundTags = await Tag.find({ _id: { $in: tags } }).select('-_id name').lean();
            if (foundTags.length !== tags.length) {
                return res.status(statusCode.BAD_REQUEST).send(error(commanMessage.NOT_FOUND.replace(':name', 'Tag'), statusCode.BAD_REQUEST));
            }
        }

        const files = req.files;
        if (files && files.length > 0) {
            let uploadedFile = await imageUpload(files);
            if (uploadedFile) { photos = uploadedFile }
        }

        const addPost = await Post.create({
            title: title,
            description: description,
            tags: tags,
            photo: photos,
            createdBy: req.user._id
        })

        return res.status(statusCode.OK).send(success(commanMessage.CREATED.replace(':name', 'Post'), addPost, statusCode.OK, true))

    } catch (err) {
        console.log(err)
        return res.status(statusCode.BAD_REQUEST).send(error(err.message, statusCode.BAD_REQUEST));
    }
};

const listPost = async (req, res) => {
    try {

        const { page, limit, search, tags, date } = req.body;

        var query = {};
        let findData = { "$or": [] };
        query["$and"] = [];
        query["$and"].push({ status: postConstant.POST_STATUS.PUBLISHED })
        query['$and'].push({ isDeleted: false })
        if (search) {
            findData["$or"].push({ title: new RegExp(search, "i") });
            findData["$or"].push({ description: new RegExp(search, "i") });

            let fullsearchArr = search.split(" ");
            if (fullsearchArr && fullsearchArr[1]) {
                findData["$or"].push({ title: new RegExp(fullsearchArr[0], "i"), description: new RegExp(fullsearchArr[1], "i") });
            }
            query['$and'].push(findData)
        }
        if (tags && tags.length > 0) {
            query['$and'].push({ tags: { $in: tags } })
        }

        if (date && date?.startDate && date?.endDate) {
            query['$and'].push({ createdAt: { $gte: new Date(date.startDate), $lte: new Date(date.endDate) } })
        }
        const skip = page == 1 ? 0 : (page - 1) * limit;
        const [totalCount, postList] = await Promise.all([
            Post.countDocuments(query),
            Post.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })
        ])

        const totalPages = Math.ceil(totalCount / limit);

        const data = {
            docs: postList,
            page: page,
            limit: limit,
            total: totalCount,
            pages: totalPages
        }
        return res.status(statusCode.OK).send(success(commanMessage.GET.replace(':name', 'Post'), data, statusCode.OK))

    } catch (err) {
        console.log(err)
        return res.status(statusCode.BAD_REQUEST).send(error(err.message, statusCode.BAD_REQUEST));
    }
};

module.exports = {
    createPost: createPost,
    listPost: listPost
}