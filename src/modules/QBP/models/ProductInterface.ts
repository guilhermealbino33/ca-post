export interface IProductInterface {
  code: string;
  data: {
    code: string;
    name: string;
    model: {
      code: string;
      name: string;
      description: string;
      bulletPoints: [];
    };
    unit: string;
    manufacturerPartNumber: string;
    basePrice: number;
    mapPrice: number;
    msrp: number;
    brand: {
      code: string;
      name: string;
    };
    discontinued: boolean;
    weightsAndMeasures: {
      weight: {
        value: number;
        unit: string;
      };
      length: {
        value: number;
        unit: string;
      };
      width: {
        value: number;
        unit: string;
      };
      height: {
        value: number;
        unit: string;
      };
    };
    hazmat: boolean;
    ormd: boolean;
    thirdPartyAllowed: boolean;
    intendedAgeWarningType: string;
    intendedAgeWarningText: string;
    chokingHazardWarningType: string;
    chokingHazardWarningText: string;
    prop65Text: string;
    orderProcess: string;
    images: [];
    categoryCodes: [];
    bulletPoints: [];
    barcodes: [];
    substitutes: [];
    smallParts: [];
    supersedes: [];
    seeAlsos: [];
    recommendations: [];
    productAttributes: [
      {
        value: string;
        name: string;
        unit: string;
      }
    ];
  };
}
