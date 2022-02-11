import { QueueAdvisorUpdateRepository } from "../repositories/QueueAdvisorUpdateRepository";

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
  async pullOne() {
    // for tests with a single item
    const items = await QueueAdvisorUpdateRepository.find({ code: "BR8928" })
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(5);
    return items;
  }
}

export default new QueueAdvisorService();
