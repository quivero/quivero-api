import _ from 'lodash';

export const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(key, object[key]);
  return result;
}, {});

export const objectFilter = (object, filterFn) => {
  Object.entries(object).forEach(
    ([key, value]) => {
      if(filterFn(key, value)) {
        delete object[key]
      }
    }
  )
  
  return object
}

export const initObject = (keys, init_value) => {
  const a = [];
  let total = keys.length;

  while (total--) a.push(_.cloneDeep(init_value));

  return Object.fromEntries(
    _.zip(keys, [...a]),
  );
};
