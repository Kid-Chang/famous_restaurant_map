const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const foodMapDao = require("../dao/foodMapDao");

exports.readRestaurants = async function (req, res) {
    try {
        const { category } = req.query;

        const connection = await pool.getConnection(async (conn) => conn);
        try {
            let rows;
            if (category) {
                [rows] = await foodMapDao.readRestaurants(connection, category);
            } else {
                [rows] = await foodMapDao.readRestaurants(connection);
            }

            if (rows.length == 0) {
                return res.send({
                    result: rows,
                    isSuccess: true,
                    code: 400, // 요청 실패시 400번대 코드
                    message: "요청 실패. 유효한 카테고리가 아니다.",
                });
            }
            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(`example Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};
