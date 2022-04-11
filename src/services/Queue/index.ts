import {
  QueueAdvisorLabelRepository,
  QueueAdvisorImageUpdateRepository,
  QueueAdvisorUpdateRepository,
  QueueAdvisorCategoryRepository,
} from "./repositories/QueueAdvisorRepository";

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
  async pullLabelQueue(quantity: number) {
    const items = await QueueAdvisorLabelRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await QueueAdvisorLabelRepository.collection.bulkWrite(
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
  async pullCategoryQueue(quantity: number) {
    const items = await QueueAdvisorCategoryRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await QueueAdvisorCategoryRepository.collection.bulkWrite(
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
    const items = await QueueAdvisorUpdateRepository.find({ code: "RM8365" })
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(1);
    return items;
  }
}

export default new QueueAdvisorService();