import { Request, Response } from 'express';
import { testConnection } from '../model/db';

abstract class DB {
    static async testConnection(_req: Request, res: Response) {
        const result = await testConnection();

        if (result instanceof Error)
            return res.status(503).json({
                error: result.message,
            });

        res.status(200).json({
            project: 'Practice tables relations with Sequelize',
            version: '1.0.0',
            database: 'Connected',
            result,
        });
    }
}

export default DB;