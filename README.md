# user-acl
> Hooks up ACL for users with the [hapi-rbac](https://github.com/franciscogouveia/hapi-rbac) plugin. [rbac docs](https://github.com/franciscogouveia/hapi-rbac/blob/master/API.md)

## Dependencies
[user-boilerplate](https://github.com/mattboutet/user-boilerplate) -- 
Plugin registration order is unimportant unless user-boilerplate ends up using this plugin.

## Registration
Register the plugin in boilerplate-api's manifest.
For now `npm-link` this in.

If any other plugins rely on user-acl, be sure to register this before them.

## ACL Setup
user-acl comes with 4 constant defaults for 4 basic user roles.
```
['SUPER_ADMIN', 'ADMIN', 'USER', 'GUEST']
```
The ACL setup is hierarchical. If a `GUEST` has access to a route, then so do `USER`, `ADMIN`, and `SUPER_ADMIN`.

## Usage
Grab the ACL constants at the top of your routes file
```
const ACL = require('user-acl').ACL;
```

Example route config. We only want a SUPER_ADMIN to get all the dogs!
```
 method: 'GET',
    path: '/dogs',
    config: {
        description: 'Get all dogs',
        tags: ['api', 'find'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
                .description('JWT')
            }).unknown()
        },
        auth: {
            strategy: 'api-user-jwt'
        },
        plugins: {
            rbac: ACL.SUPER_ADMIN
        }
    },
    handler: (request, reply) => {

        const Dogs = request.models().Dogs;

        Dogs.query()
        .then((allDogs) => {

            return reply(allDogs);
        });
    }
},
```

## Custom ACL

This plugin adds custom `target` functionality for the `Users` model.
When writing the target, whatever comes after the colon (`target: {'user:myProp': 'theVal'}`) will be grabbed from the
user object _after_ `strategy: 'api-user-jwt'` has run.
> Note: this being said, it's important to specify this plugin in the config _after_ you specify auth.



In your route config:
This will restrict the route to only allow a user with email `williamswoodruff@gmail.com`
```
plugins: {
    rbac: {
        target: { 'user:email': 'williamswoodruff@gmail.com' },
        apply: 'deny-overrides',
        rules: [
            {
                effect: 'permit'
            }
        ]
    }
}
```
To see more about this configuration (The `apply` and `rules` props in the example), see the [rbac docs](https://github.com/franciscogouveia/hapi-rbac/blob/master/API.md)
