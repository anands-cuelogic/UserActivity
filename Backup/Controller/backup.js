import backup from 'mongodb-backup';
import keys from '../../config/keys';
import path from 'path';

class DbBackup {
    dbBackup(req, res) {
        backup({
            uri: keys.mongoURI,
            root: path.join(__dirname, '../Database_Backup'),
            callback: function (err) {
                if (err) {
                   res.json({
                       message : err
                   });
                } else {
                    res.json({
                        message : 'Backup done successfully'
                    });
                }
            }
        });
    }
}

export default new DbBackup();