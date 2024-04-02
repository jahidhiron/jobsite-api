const PostgresDbOperation = require('./postgres-db-operation');

class CommonService extends PostgresDbOperation {
  // async createLog(payload) {
  //   const newLog = await this.create(this.Log, payload);
  //   return newLog;
  // }

  async getRoles(query) {
    const { collection } = await this.findAndCountAll(this.Role, query);
    const roleArr = [];
    const roleObj = {};

    collection.forEach((element) => {
      roleArr.push(element.title);
      roleObj[element.title] = element.title;
    });

    return {
      roleArr,
      roleObj: Object.keys(roleObj).length > 0 ? roleObj : null,
    };
  }
}

module.exports = new CommonService();
