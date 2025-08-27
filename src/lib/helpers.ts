export function prepareFormData(values: Record<string, any>): FormData {
  const formData = new FormData();

  function appendFormData(data: any, parentKey = ""): void {
    if (data instanceof File || data instanceof Blob) {
      formData.append(parentKey, data);
    } else if (Array.isArray(data)) {
      data.forEach((item, index) => {
        appendFormData(item, `${parentKey}[${index}]`);
      });
    } else if (typeof data === "object" && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}[${key}]` : key;
        appendFormData(value, fullKey);
      });
    } else {
      if (data !== undefined && data !== null && !Number.isNaN(data)) {
        formData.append(parentKey, String(data));
      }
    }
  }

  appendFormData(values);

  return formData;
}

export function compareChanges(values, dirtyFields) {
  const changedValues = Object.keys(dirtyFields).reduce((acc, key) => {
    acc[key] = values[key];
    return acc;
  }, {});
  return changedValues;
}
