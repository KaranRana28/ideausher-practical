const Tag = require('../../model/tag');
const { success, error, statusCode, commanMessage } = require('../../utils/responseConstant');

const addTag = async (req, res) => {
    try {
        const { name } = req.body;
        const isTagExists = await Tag.findOne({ name: name })
        if (isTagExists) {
            return res.send(error(commanMessage.ALREDY_EXISTS.replace(':name', 'Tag'), statusCode.BAD_REQUEST));
        }
        const addTag = await Tag.create({ name: name });
        return res.send(success(commanMessage.CREATED.replace(':name', 'Tag'), addTag, statusCode.ACCEPTED))
    } catch (err) {
        console.log(err)
        return res.send(error(err.message, statusCode.BAD_REQUEST));
    }
};

const updateTag = async (req, res) => {
    try {
        let { name, id } = req.body
        let updatedInfo = {
            name: name,
            updatedBy: req.user.id
        }
        const updatedTag = await Tag.findOneAndUpdate({ _id: id }, { $set: updatedInfo }, { new: true }).lean()
        if (updatedTag && updatedTag != null) {
            return res.send(success(commanMessage.UPDATE.replace(':name', 'Tag'), updatedTag, statusCode.ACCEPTED))
        } else {
            return res.send(error(commanMessage.NOT_FOUND.replace(':name', 'Tag'), statusCode.BAD_REQUEST));
        }
    } catch (err) {
        console.log(err)
        return res.send(error(err.message, statusCode.BAD_REQUEST));
    }
}

const deleteTag = async (req, res) => {
    try {
        // check if tag exists in post
         

        let deletedTag = await Tag.deleteOne({ _id: req.body.id })
        if (deletedTag.deletedCount > 0) {
            return res.send(success(commanMessage.DELETED.replace(':name', 'Tag'), statusCode.ACCEPTED))
        } else {
            return res.send(error(commanMessage.NOT_FOUND.replace(':name', 'Tag'), statusCode.BAD_REQUEST));
        }
    } catch (err) {
        console.log(err)
        return res.send(error(err.message, statusCode.BAD_REQUEST));
    }
}
module.exports = {
    addTag: addTag,
    updateTag: updateTag,
    deleteTag: deleteTag
}