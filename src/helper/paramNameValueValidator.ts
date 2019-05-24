import isEmpty from "../utils/is-empty";

import Value from "../model/params/value";

export type NameValueType = {
  valueId: string;
  name: string;
};

export type paramNameValueResultTypeInvalid = Array<NameValueType>;

export type paramNameValueResultTypeValid = Array<NameValueType>;

export type paramNameValueResultType = {
  valid: paramNameValueResultTypeValid;
  invalid: paramNameValueResultTypeInvalid;
};

class paramNameValueValidator {
  private _valid: Array<NameValueType> = [];
  private _invalid: Array<NameValueType> = [];

  public constructor(nv: Array<NameValueType>) {
    nv.map(item => {
      this.validateValueNamePair(item.valueId, item.name);
    });
    return this;
  }

  public result(): paramNameValueResultType {
    return { valid: this._valid, invalid: this._invalid };
  }

  public areAllValid(): boolean {
    return isEmpty(this._invalid);
  }

  public get valid() {
    return this._valid;
  }
  public get invalid() {
    return this._invalid;
  }

  private validateValueNamePair(valueId: string, name: string) {
    Value.find({ paramId: valueId })
      .populate("paramId")
      .then(item => {
        if (isEmpty(item)) this._invalid.push({ valueId, name });
        else {
          this._invalid.push({ valueId, name });
        }
      })
      .catch(e => {
        this._invalid.push({ valueId, name });
      });
  }
}

export default paramNameValueValidator;
