'use strict';

// Docs: https://github.com/franciscogouveia/hapi-rbac/blob/master/API.md

const Hoek = require('hoek');

module.exports = {

    plugins: {
        register: require('hapi-rbac'),
        options: {
            responseCode: {
                onDeny: 403,
                onUndetermined: 403
            },
            dataRetrievers: [
                {
                    handles: ['user'], // Name the source this data retriever handles
                    handler: (source, path, request, callback) => {

                        // 'path' needs to be 'x.y.z'

                        const user = Hoek.reach(request, 'auth.credentials.user');

                        if (path === 'all') {
                            return callback(null, user);
                        }

                        const userProp = Hoek.reach(user, path);

                        if (!userProp) {
                            return callback(new Error(`User path ${path} not found`), null);
                        }

                        return callback(null, userProp);
                    }
                }
            ]
        }
    }
};
