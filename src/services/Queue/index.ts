import {
  ProductQueueRepository,
  ImageQueueRepository,
  LabelQueueRepository,
  CategoryQueueRepository,
} from "./repositories/QueueRepository";

class QueueAdvisorService {
  async pullQueue(quantity: number) {
    const items = await ProductQueueRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await ProductQueueRepository.collection.bulkWrite(
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
    const items = await ImageQueueRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await ImageQueueRepository.collection.bulkWrite(
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
    const items = await LabelQueueRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await LabelQueueRepository.collection.bulkWrite(
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
    const items = await CategoryQueueRepository.find({})
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(quantity);

    await CategoryQueueRepository.collection.bulkWrite(
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
    const items = await ProductQueueRepository.find({ code: "RM8365" })
      .populate("product")
      .sort({
        lastUpdate: 1,
      })
      .limit(1);
    return items;
  }
}

export default new QueueAdvisorService();
