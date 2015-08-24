var util = require('../util.js');
var Client = require('../models/client.js');

/**
 * Create a new client.
 * @name createClient
 * @since 0.1.0
 * @version 1
 * @param {obj} user User object.
 * @param {string} name Client name to identify the client with.
 * @param {string} description Client description
 * @param {array} scopes Scopes used in the client.
 * @param {createClientCallback} callback Callback function after creating the client.
 */

/**
 * Callback for creating a new client.
 * @callback createClientCallback
 * @param {Error} err Error object, should be undefined.
 * @param {Object} client Client object of the new created client, id and secret are not hashed here, these values should be send back to the origin of the request.
 */
exports.create = function (user, name, description, scopes, callback) {
      var client = new Client();
      var id = util.uid(10);
      var secret = util.uid(10);
      client.name = name;
      client.description = description;
      client.scopes = scopes;
      client.id = id;
      client.secret = secret;
      client.userId = user._id;
      client.save(function(err) {
          if (err) {
              return callback(err, null);
          }
          var responseClient = client;
          responseClient.id = id;
          responseClient.secret = secret;
          callback(null, responseClient);
          util.log('New client `'+client.name+'` created');
      });
}

/**
 * .
 * @name getClient
 * @since 0.1.0
 * @version 1
 * @param {string|null} userID Userid of the user to find the sessions from, it finds all clients when null.
 * @param {int} limitBy Amount of clients to limit to. Default: 20
 * @param {int} skip Amount of clients to skip before returning, can be used for pagination. Default: 0;
 * @param {getClientCallback} callback Callback function after finding all client.
 */

/**
 * Callback for gettting all clients of a user.
 * @callback getClientCallback
 * @param {Error} err Error object, should be undefined.
 * @param {array} clients Found clients in a array.
 */
exports.get = function function_name(userID, limitBy, skip, callback) {
    limitBy = limitBy || 20;
    skip = skip || 0;
    var query = (userID) ? {userId: userID} : {};
    Client.find(query)
    .limit(limitBy)
    .skip(skip)
    .sort({name: 'asc'})
    .exec(function(err, clients) {
        if (err) {
            return callback(err, null);
        }
        return callback(null, clients);
    });
}
