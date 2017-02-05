'use strict';

// Docs: https://github.com/franciscogouveia/hapi-rbac/blob/master/API.md

const ACL = {};
module.exports = ACL;

const internals = {};

const roles = [
    'SUPER_ADMIN',
    'ADMIN',
    'USER',
    'GUEST'
];

internals.hierarchyTarget = (role) => {

    const index = roles.indexOf(role);
    const slicedRoles = roles.slice(index);
    return slicedRoles.reduce((collector, role) => {

        collector.push({ 'user:acl.group': role });
        return collector;
    }, []);
}

roles.reverse().forEach((role) => {

    ACL[role] = {
        target: internals.hierarchyTarget(role),
        apply: 'deny-overrides',
        rules: [
            {
                effect: 'permit'
            }
        ]
    }
});
