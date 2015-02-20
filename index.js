var request = require('superagent');
var Promise = require('bluebird');
var _ = require('lodash');

var METHOD_MAP = {
    'create': 'post',
    'update': 'put',
    'delete': 'del',
    'read': 'get',
    'patch': 'patch'
};

function sync(method, model, options) {
    return new Promise(function(resolve, reject) {
        var req;
        var url = (options.url || _.result(model,'url'));
        var data = (options.data || (method === 'update' || method === 'create') ? model.toJSON() : {});

        function success(res) {
            options.res = {
                headers: res.headers
            };
            if (options.success) {
                options.success(res.body);
            }
            if (options.complete) {
                options.complete(res.body);
            }
            resolve(res.body);
        }

        function error(err) {
            if (options.error) {
                options.error(err);
            }
            if (options.complete) {
                options.complete(err);
            }
            reject(err);
        }

        function send() {

            req = request[METHOD_MAP[method]](url);

            // invoke exposed method on the request
            module.exports.editRequest(req, method, model, options);
            if (method === 'create' || method === 'update') {
                req.send(data);
            } else {
                req.query(data);
            }

            if (options.headers) {
                _.each(options.headers, function(val, key){
                    req.set(key, val);
                });
            }

            req.on('error', error);
            req.end(function(res){
                if (!res.ok) {
                    error(res);
                } else {
                    success(res);
                }
            });
        }
        send();
        model.trigger('request', model, req, options);
    });
}

module.exports = sync;
module.exports.editRequest = _.noop;
