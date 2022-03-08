import {
  QueueAdvisorCreateRepository,
  QueueAdvisorImageUpdateRepository,
  QueueAdvisorUpdateRepository,
} from "../repositories/QueueAdvisorUpdateRepository";

class QueueAdvisorService {
  async pullQueue(quantity: number) {
    const items = await QueueAdvisorUpdateRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await QueueAdvisorUpdateRepository.collection.bulkWrite(
      items.map((item) => {
        return {
          updateOne: {
            filter: {
              code: item.code,
            },
            update: {
              $set: {
                code: item.code,
                lastUpdate: Date.now(),
              },
            },
          },
        };
      })
    );
    return items;
  }
  async pullImageQueue(quantity: number) {
    const items = await QueueAdvisorImageUpdateRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await QueueAdvisorImageUpdateRepository.collection.bulkWrite(
      items.map((item) => {
        return {
          updateOne: {
            filter: {
              code: item.code,
            },
            update: {
              $set: {
                code: item.code,
                lastUpdate: Date.now(),
              },
            },
          },
        };
      })
    );
    return items;
  }
  async pullCreateQueue(quantity: number) {
    const items = await QueueAdvisorCreateRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await QueueAdvisorCreateRepository.collection.bulkWrite(
      items.map((item) => {
        return {
          updateOne: {
            filter: {
              code: item.code,
            },
            update: {
              $set: {
                code: item.code,
                lastUpdate: Date.now(),
              },
            },
          },
        };
      })
    );
    return items;
  }
  async pullOne() {
    // for tests with a single item
    /// TU1203 do not exists on Channel Advisor`
    const items = await QueueAdvisorUpdateRepository.find({ code: "J1813" })
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(1);
    return items;
  }
}

export default new QueueAdvisorService();
