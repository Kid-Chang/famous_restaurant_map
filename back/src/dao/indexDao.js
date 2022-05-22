// dao : data access object

const { pool } = require("../../config/database");

exports.deleteStudent = async function (connection, studentIdx) {
    const Query = `update Students set status = "D" where studentIdx = ?;`;
    const Params = [studentIdx];

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.updateStudent = async function (
    connection,
    studentIdx,
    studentName,
    major,
    birth,
    address,
) {
    const Query = `update Students set studentName = ifnull(?, studentName), major = ifnull(?, major), birth = ifnull(?, birth), address = ifnull(?, address) where studentIdx = ?;`;
    const Params = [studentName, major, birth, address, studentIdx];
    const [rows] = await connection.query(Query, Params);

    return rows;
};

exports.isValidStudentIdx = async function (connection, studentIdx) {
    const Query = `SELECT * FROM Students where studentIdx = ? and status="A"`;
    const Params = [studentIdx];

    const [rows] = await connection.query(Query, Params);
    // console.log(rows);
    if (rows < 1) {
        return false;
    }
    return true;
};

exports.insertStudent = async function (
    connection,
    studentName,
    major,
    birth,
    address,
) {
    const Query = `insert into Students(studentName, major, birth, address) values (?,?,?,?);`;
    const Params = [studentName, major, birth, address];

    const [rows] = await connection.query(Query, Params);

    return rows;
};

exports.selectStudents = async function (connection, studentIdx) {
    // const selectAllStudentsQuery = `SELECT * FROM Students`;
    // const selectStudentByNameQuery = `SELECT * FROM Students where studentName = ?;`;
    // const Params = [studentName]; // ? 가 된 곳이 알아서 이걸 찾아서 가져감.

    const Query = `SELECT * FROM Students where studentIdx = ?`;
    const Params = [studentIdx];

    // let Query;

    // Query = studentName ? selectStudentByNameQuery : selectAllStudentsQuery;

    const [rows] = await connection.query(Query, Params);

    return rows;
};

exports.exampleDao = async function (connection, params) {
    const Query = `SELECT * FROM Students`;
    const Params = [];

    const [rows] = await connection.query(Query, Params);

    return rows;
};
