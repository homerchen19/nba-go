import Table from 'cli-table3';

import { basicTable } from '../table';

describe('table', () => {
  it('should exist', () => {
    expect(basicTable).toBeDefined();
  });

  it('should return a Table instance', () => {
    const table = basicTable();

    expect(table).toBeInstanceOf(Table);
  });
});
