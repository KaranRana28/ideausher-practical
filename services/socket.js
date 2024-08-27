const { parseJSON } = require("../config/commonFunction");

const socketAPIService = (requestType, request, client) =>


    new Promise((resolve, reject) => {
        let startTime = new Date();
        console.log(startTime)
        request = parseJSON(request);
        if (!request) {
            return reject({
                error: "Invalid Request",
                code: 400,
            });
        }
        let { event, data } = request;

        if (!event) {
            return reject({
                error: "Invalid Event",
                code: 400,
            });
        }


        let controllerName = event.split("|");
        controllerName = controllerName[0];
        let functionName = event.split("|");
        functionName = functionName[1];

        switch (controllerName) {
            case "user":
                controllerName = `../controller/web/${controllerName}Controller.js`
                break;

            case "post":
                controllerName = `../controller/web/${controllerName}Controller.js`
                break;

            default:
                break;
        }

        let property;
        let payload = data || {};

        const findProperty = (controllerName, functionName) => new Promise((resolve, reject) => {

            try {
                const controller = require(controllerName);

                // Check if the specified function exists in the required module
                if (controller && typeof controller[functionName] === 'function') {
                    // If it exists, call the specified function and resolve with its result
                    let request = { body: {}, client: {} };
                    request.body = payload;
                    request.client = client;
                    const result = controller[functionName](request);
                    return resolve(result);
                } else {
                    return reject(new Error(`The file ${controllerName} does not export the ${functionName} function`));
                }
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") return reject(notFound);
                return reject(error);
            }
        });

        findProperty(controllerName, functionName)
    });

module.exports = socketAPIService