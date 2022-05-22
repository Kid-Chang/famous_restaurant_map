const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");

const indexDao = require("../dao/indexDao");

// 학생 삭제
exports.deleteStudent = async function (req, res) {
    const { studentIdx } = req.params;

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const isValidStudentIdx = await indexDao.isValidStudentIdx(
                connection,
                studentIdx,
            );

            if (!isValidStudentIdx) {
                return res.send({
                    isSuccess: false,
                    code: 410,
                    message: "유효한 학생인덱스가 아닙니다.",
                });
            }

            const [rows] = await indexDao.deleteStudent(connection, studentIdx);

            return res.send({
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "삭제 성공",
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

// 학생 업데이트
exports.updateStudent = async function (req, res) {
    const { studentName, major, birth, address } = req.body;
    const { studentIdx } = req.params;
    // console.log(studentName, major, birth, address);
    //db에 넣기전에 검사 타입 해줘야함.
    //studentName, major, address: 문자열

    if (studentName && typeof studentName !== "string") {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "값을 정확히 입력해주세요.",
        });
    }
    if (major && typeof major !== "string") {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "값을 정확히 입력해주세요.",
        });
    }
    if (address && typeof address !== "string") {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "값을 정확히 입력해주세요.",
        });
    }

    //birth: YYYY-MM-DD 형식 검사
    regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (birth && !regex.test(birth)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "날짜 형식을 확인해주세요.",
        });
    }

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const isValidStudentIdx = await indexDao.isValidStudentIdx(
                connection,
                studentIdx,
            );

            if (!isValidStudentIdx) {
                return res.send({
                    isSuccess: false,
                    code: 410,
                    message: "유효한 학생인덱스가 아닙니다.",
                });
            }

            const rows = await indexDao.updateStudent(
                connection,
                studentIdx,
                studentName,
                major,
                birth,
                address,
            );
            console.log(rows);
            return res.send({
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "학생수정 성공",
            });
        } catch (err) {
            logger.error(`updateStudent Query error\n: ${JSON.stringify(err)}`);
            console.dir(err);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `updateStudent DB Connection error\n: ${JSON.stringify(err)}`,
        );
        return false;
    }
};
// 학생 생성
exports.createStudent = async function (req, res) {
    const { studentName, major, birth, address } = req.body;
    console.log(studentName, major, birth, address);
    //db에 넣기전에 검사 타입 해줘야함.
    //studentName, major, address: 문자열
    if (
        typeof studentName !== "string" ||
        typeof major !== "string" ||
        typeof address !== "string"
    ) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "값을 정확히 입력해주세요.",
        });
    }
    //birth: YYYY-MM-DD 형식 검사
    regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (!regex.test(birth)) {
        return res.send({
            isSuccess: false,
            code: 400,
            message: "날짜 형식을 확인해주세요.",
        });
    }

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            // const [rows] = await indexDao.selectStudents(
            //     connection,
            //     studentName,
            // );
            const [rows] = await indexDao.insertStudent(
                connection,
                studentName,
                major,
                birth,
                address,
            );

            return res.send({
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "학생생성 성공",
            });
        } catch (err) {
            logger.error(
                `createStudents Query error\n: ${JSON.stringify(err)}`,
            );
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `createStudents DB Connection error\n: ${JSON.stringify(err)}`,
        );
        return false;
    }
};

// 학생 테이블 조회
exports.readStudents = async function (req, res) {
    // 하단은 query string으로 처리할 때.
    // const { studentName } = req.query; //params
    // console.log(studentName);

    // 하단은 pass variable을 params로 받아서 처리할 때.
    const { studentIdx } = req.params;
    console.log(studentIdx);

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            // const [rows] = await indexDao.selectStudents(
            //     connection,
            //     studentName,
            // );
            const [rows] = await indexDao.selectStudents(
                connection,
                studentIdx,
            );

            return res.send({
                result: rows,
                isSuccess: true,
                code: 200, // 요청 실패시 400번대 코드
                message: "요청 성공",
            });
        } catch (err) {
            logger.error(`readStudents Query error\n: ${JSON.stringify(err)}`);
            return false;
        } finally {
            connection.release();
        }
    } catch (err) {
        logger.error(
            `readStudents DB Connection error\n: ${JSON.stringify(err)}`,
        );
        return false;
    }
};

// 예시 코드
exports.example = async function (req, res) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            const [rows] = await indexDao.exampleDao(connection);

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
