// To parse this data:
//
//   import { Convert, IQrCodeRequest } from "./file";
//
//   const iQrCodeRequest = Convert.toIQrCodeRequest(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
export interface IResponse {
  data: IQRCodeData;
}

export interface IQRCodeData {
  qr_data: string;
}

export interface IQrCodeRequest {
  external_reference: string;
  title: string;
  description: string;
  notification_url: string;
  expiration_date: string;
  total_amount: number;
  items: Array<Item>;
}

export interface Item {
  sku_number: string;
  category: string;
  title: string;
  description: string;
  unit_price: number;
  quantity: number;
  unit_measure: string;
  total_amount: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toIQrCodeRequest(json: string): IQrCodeRequest {
    return cast(JSON.parse(json), r('IQrCodeRequest'));
  }

  public static iQrCodeRequestToJson(value: IQrCodeRequest): string {
    return JSON.stringify(uncast(value, r('IQrCodeRequest')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ,
      )} but got ${JSON.stringify(val)}`,
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`,
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    // eslint-disable-next-line no-prototype-builtins
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : // eslint-disable-next-line no-prototype-builtins
      typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : // eslint-disable-next-line no-prototype-builtins
      typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function r(name: string) {
  return { ref: name };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

const typeMap: any = {
  IQrCodeRequest: o(
    [
      { json: 'external_reference', js: 'external_reference', typ: '' },
      { json: 'title', js: 'title', typ: '' },
      { json: 'description', js: 'description', typ: '' },
      { json: 'notification_url', js: 'notification_url', typ: '' },
      { json: 'expiration_date', js: 'expiration_date', typ: Date },
      { json: 'total_amount', js: 'total_amount', typ: u('', 0) },
      { json: 'items', js: 'items', typ: a(r('Item')) },
    ],
    false,
  ),
  Item: o(
    [
      { json: 'sku_number', js: 'sku_number', typ: '' },
      { json: 'category', js: 'category', typ: '' },
      { json: 'title', js: 'title', typ: '' },
      { json: 'description', js: 'description', typ: '' },
      { json: 'unit_price', js: 'unit_price', typ: 0 },
      { json: 'quantity', js: 'quantity', typ: 0 },
      { json: 'unit_measure', js: 'unit_measure', typ: '' },
      { json: 'total_amount', js: 'total_amount', typ: 0 },
    ],
    false,
  ),
};
