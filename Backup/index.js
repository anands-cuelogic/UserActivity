import express from 'express';
import DBBackupController from './Controller/backup';
import DBRestoreController from './Controller/restore';

const router = express.Router();

router.post('/backup', DBBackupController.dbBackup);
router.post('/restore', DBRestoreController.dbRestore);

export default router;