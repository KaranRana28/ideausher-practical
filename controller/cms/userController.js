const User = require('../../model/user');
const { success, error, statusCode, commanMessage } = require('../../utils/responseConstant');

const getUser = async (req, res) => {
    try {
        let page = 1;
        if (req.query.page) {
            if (req.query.page < 1) { req.query.page = 1 };
            page = Number(req.query.page)
        }
        let limit = 10;
        if (req.query.limit) {
            if (req.query.limit < 1) { req.query.limit = 10 };
            limit = Number(req.query.limit)
        }

        var query = {}, search = req.query.search;
        let findData = { "$or": [] };
        query["$and"] = [];
        query["$and"].push({ role: 'User' })
        query['$and'].push({ isDeleted: false })
        if (search) {
            findData["$or"].push({ email: new RegExp(`${"^.*"}(${search.replace(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g, "\\$&").replace(/ /g, "|")}).*$`, "i") })
            findData["$or"].push({ firstName: new RegExp(search, "i") });
            findData["$or"].push({ lastName: new RegExp(search, "i") });

            let fullnameArr = search.split(" ");
            if (fullnameArr && fullnameArr[1]) {
                findData["$or"].push({ firstName: new RegExp(fullnameArr[0], "i"), lastName: new RegExp(fullnameArr[1], "i") });
            }
            query['$and'].push(findData)
        }
        const skip = page == 1 ? 0 : (page - 1) * limit;
        const [totalCount, userList] = await Promise.all([
            User.countDocuments(query),
            User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })
        ])

        const totalPages = Math.ceil(totalCount / limit);

        const data = {
            docs: userList,
            page: page,
            limit: limit,
            total: totalCount,
            pages: totalPages
        }
        return res.status(statusCode.OK).send(success(commanMessage.GET.replace(':name', 'User'), data, statusCode.OK))
    } catch (err) {
        console.log(err)
        return res.status(statusCode.BAD_REQUEST).send(error(err.message, statusCode.BAD_REQUEST));
    }
};

const deactiveUser = async (req, res) => {
    let { userId } = req.body;
    try {

        let isUserExists = await User.findOne({ _id: userId });

        if (!isUserExists) {
            return res.status(statusCode.BAD_REQUEST).send(error(commanMessage.NOT_FOUND.replace(':name', 'User'), statusCode.BAD_REQUEST));
        }

        let updateUser = await User.findOneAndUpdate({ _id: userId }, { $set: { isActive: false, isDeleted: true } }).lean()
        return res.status(statusCode.OK).send(success("User has been disabled", updateUser?.email, statusCode.OK, true));
    } catch (err) {
        console.log(err)
        return res.status(statusCode.BAD_REQUEST).send(error(err.message, statusCode.BAD_REQUEST));
    }
}

module.exports = {
    getUser: getUser,
    deactiveUser: deactiveUser
}