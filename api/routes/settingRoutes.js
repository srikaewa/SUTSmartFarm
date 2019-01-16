'use strict';

module.exports = function(app) {
    var setting = require('../controllers/settingController');
    app.route('/api/host/ip')
        .get(setting.api_host_ip);
    app.route('/api/host/checkin')
        .get(setting.api_host_checkin);
}

