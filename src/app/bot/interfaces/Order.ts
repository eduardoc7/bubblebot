// To parse this data:
//
//   import { Convert, IOrder } from "./file";
//
//   const iOrder = Convert.toIOrder(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
// https://app.quicktype.io/

export interface IOrder {
  id?: number;
  identifier?: string;
  name: string;
  contact_number: string;
  payment_method?: string;
  payment_status?: string;
  delivery_method?: string;
  total: number;
  items: Array<Item>;
  location: Location;
  status?: string;
  chatId: string;
  created_at?: string;
  updated_at?: string;
}

export interface Item {
  /** Product Id */
  id?: string;
  /** Price */
  price?: string;
  /** Product Thumbnail*/
  thumbnailUrl?: string;
  /** Currency */
  currency?: string;
  /** Product Name */
  name: string;
  /** Product Quantity*/
  quantity: number;

  data?: null;
}

export interface Location {
  latitude?: string;
  longitude?: string;
  bairro?: string;

  taxa_entrega?: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toIOrder(json: string): IOrder {
    return cast(JSON.parse(json), r('IOrder'));
  }

  public static iOrderToJson(value: IOrder): string {
    return JSON.stringify(uncast(value, r('IOrder')), null, 2);
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
  IOrder: o(
    [
      { json: 'identifier', js: 'identifier', typ: u(undefined, '') },
      { json: 'id', js: 'id', typ: u(undefined, 0) },
      { json: 'name', js: 'name', typ: '' },
      { json: 'contact_number', js: 'contact_number', typ: '' },
      { json: 'payment_method', js: 'payment_method', typ: u(undefined, '') },
      { json: 'payment_status', js: 'payment_status', typ: u(undefined, '') },
      { json: 'delivery_method', js: 'delivery_method', typ: u(undefined, '') },
      { json: 'total', js: 'total', typ: 0 },
      { json: 'items', js: 'items', typ: a(r('Item')) },
      { json: 'location', js: 'location', typ: r('Location') },
      { json: 'status', js: 'status', typ: u(undefined, '') },
      { json: 'chatId', js: 'chatId', typ: '' },
      { json: 'created_at', js: 'created_at', typ: u(undefined, '', 0) },
      { json: 'updated_at', js: 'updated_at', typ: u(undefined, '', 0) },
    ],
    false,
  ),
  Item: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, '') },
      { json: 'price', js: 'price', typ: u(undefined, '', 0) },
      { json: 'thumbnailUrl', js: 'thumbnailUrl', typ: u(undefined, '') },
      { json: 'currency', js: 'currency', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: '' },
      { json: 'quantity', js: 'quantity', typ: 0 },
      { json: 'data', js: 'data', typ: u(undefined, '', null) },
    ],
    false,
  ),
  Location: o(
    [
      { json: 'latitude', js: 'latitude', typ: u(undefined, '') },
      { json: 'longitude', js: 'longitude', typ: u(undefined, '') },
      { json: 'bairro', js: 'bairro', typ: u(undefined, '') },
      { json: 'taxa_entrega', js: 'taxa_entrega', typ: u(undefined, 0) },
    ],
    false,
  ),
};
