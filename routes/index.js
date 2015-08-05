exports.index = function(req, res) {
    res.render('index', {title: 'Iot Starter Kit'});
};

exports.sensor = function(req, res) {
    var db         = req.db;
    var p          = req.params;
    var collection = db.get('sensors');

    if (p.slug) {
        collection.findOne({slug: p.slug})
            .on('success', function(doc) {
                res.render('sensors/view', {
                    title: 'View single sensor',
                    sensor: doc
                });
            })
            .on('error', function(err) {
                res.render('error', {
                    message: err.message,
                    title: 'Iot Starter Kit | Error'
                });
            });
    }
}

exports.sensorNewGet = function(req, res) {
    res.render('sensors/new', {title: 'New Sensor'});
};

exports.sensorNewPost = function(req, res) {

};