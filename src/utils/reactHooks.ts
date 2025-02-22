import React from "react";
/**
 * Hooks that updates the data periodically
 * @param dataProvider function which return promise which resolves to the needed data
 * @param interval interval which the refresh happens
 * @param reps dependencies on the refresh function
 * @returns current data or NULL is it is not loaded
 */
export function useInterval<T>(
  dataProvider: () => Promise<T>,
  interval: number,
  reps: any[] = [],
  update: (newData: T | undefined, prev: T | undefined) => T | undefined = (
    newData
  ) => newData
): T | undefined {
  const [value, setValue] = React.useState<T | undefined>();
  React.useEffect(() => {
    let onProgress = false;
    const exec = () => {
      if (onProgress) {
        return;
      }
      onProgress = true;
      dataProvider()
        .then((data) => {
          setValue(update.bind(null, data));
        })
        .finally(() => (onProgress = false));
    };
    exec();
    const id = setInterval(exec, interval);
    return () => clearInterval(id);
  }, [setValue, ...reps]);
  return value;
}
