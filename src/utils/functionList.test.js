import { addDays } from './functionList';
import { loopThroughDays } from './functionList';

describe('loopThroughDays', () => {
  test('create a week', () => {
    const independantGroup = [
      new Date('2022, 05, 22'),
      new Date('2022, 05, 23'),
      new Date('2022, 05, 24'),
      new Date('2022, 05, 25'),
      new Date('2022, 05, 26'),
      new Date('2022, 05, 27'),
      new Date('2022, 05, 28'),
      new Date('2022, 05, 29'),
    ];
    const comparison = loopThroughDays(new Date('2022, 05, 22'), 7).map(
      (day, index) => {
        if (day.getTime() === independantGroup[index].getTime()) {
          return true;
        }
      }
    );
    const result = comparison.includes(false);
    expect(result).toBe(false);
  });

  test('array length', () => {
    const result = loopThroughDays(new Date('2022, 05, 22'), 7).length === 8;
    expect(result).toBe(true);
  });
});

describe('loopThroughDays', () => {
  test('return last day date', () => {
    const result =
      addDays(new Date('2022, 05, 22'), 7).getTime() ===
      new Date('2022, 05, 29').getTime();
    expect(result).toBe(true);
  });

  test('when encounter end of month', () => {
    const result =
      addDays(new Date('2022, 07, 30'), 3).getTime() ===
      new Date('2022, 08, 2').getTime();
    expect(result).toBe(true);
  });
});
