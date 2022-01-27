import { QueueAdvisorUpdateRepository } from "../repositories/QueueAdvisorUpdateRepository";

class QueueAdvisorService {
  async pullQueue() {
    const items = await QueueAdvisorUpdateRepository.find({})
      .sort({
        lastUpdate: 1,
      })
      .limit(100);
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
}

export default new QueueAdvisorService();
