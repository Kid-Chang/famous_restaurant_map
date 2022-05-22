exports.readRestaurants = async function (connection, params = null) {
    const Query = `SELECT * FROM Restaurants where category = ifnull(?,category);`;
    const Params = [params && params];
    console.log(Params);

    const rows = await connection.query(Query, Params);

    return rows;
};

exports.exampleDao = async function (connection, params) {
    const Query = `SELECT * FROM Students`;
    const Params = [];

    const [rows] = await connection.query(Query, Params);

    return rows;
};
