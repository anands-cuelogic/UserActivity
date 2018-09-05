import restore from 'mongodb-restore';
import keys from '../../config/keys';
import path from 'path';

class DbRestore {
    dbRestore(req, res) {
        restore({
            uri: keys.mongoURI,
            root: path.join(__dirname, '../Database_Backup/UserActivity'),
            callback: function (err) {
                if (err) {
                    res.json({
                        message : err
                    });
                } else {
                    res.json({
                        message : 'Restore successfully'
                    });
                }
            }
        });
    }
}

export default new DbRestore();