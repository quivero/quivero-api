import {
  getAllIndexes,
  cyclicSort,
  isCyclicEqual,
  getUniques,
  extendedVenn
} from '../arrays';

console.error = jest.fn();

beforeEach(() => {
  console.error.mockClear();
});

describe('Array', () => {
  it('Get all indexes of given value within array', () => {
    expect(getAllIndexes([1, 2, 3, 3], 1)).toStrictEqual([0]);
    expect(getAllIndexes([1, 2, 3, 3], 2)).toStrictEqual([1]);
    expect(getAllIndexes([1, 2, 3, 3], 3)).toStrictEqual([2, 3]);
  });

  it('Array control_ is equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'DABC')).toStrictEqual(true);
  });

  it('Array control_ is not equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABDC')).toStrictEqual(false);
  });

  it('Array control_ has not the same length as treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABC')).toStrictEqual(false);
  });

  it('Reorder elements from chain in a cyclic form', () => {
    expect(cyclicSort('ABCD', 2)).toStrictEqual('CDAB');
  });

  it('Returns the unique array elements', () => {
    expect(getUniques('ABCDA')).toEqual(['A', 'B', 'C', 'D']);
  });

  it('Throws console.error in case the index exceeds array size', () => {
    cyclicSort('ABCD', 5);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe('Extended venn diagram', () => {
  it('Validate information from Extended Venn Diagram', () => {
    let list_1=[1, 2, 3, 4, 5];
    let list_2=[4, 5, 6, 7];
    
    expect(extendedVenn([list_1, list_2])).toEqual({
      '0,1':[4, 5],
      '0':[1, 2, 3],
      '1':[6, 7]
    });
  });

  it('Validate non-intersection from Extended Venn Diagram', () => {
    let list_1=[1, 2, 3];
    let list_2=[4, 5, 6];
    
    expect(extendedVenn([list_1, list_2])).toEqual({
      '0':[1, 2, 3],
      '1':[4, 5, 6]
    });
  });
  
  it('Validate empty exclusivity from Extended Venn Diagram', () => {
    let list_1=[1, 2, 3, 4, 5, 6];
    let list_2=[4, 5, 6];
    
    expect(extendedVenn([list_1, list_2])).toEqual({
      '0':[1, 2, 3],
      '0,1':[4, 5, 6]
    });
  });
})